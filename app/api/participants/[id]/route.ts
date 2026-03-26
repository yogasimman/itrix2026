import { NextRequest, NextResponse } from 'next/server';
import { 
  getParticipant, 
  getScenario,
  getScenarioComponents,
  getUnlockedSnippets,
  getRound2HintSummary,
  assignScenario,
  startTimer,
  lockParticipant,
  unlockParticipant,
  deleteParticipant,
  updateParticipant,
  logActivity, 
  logViolation,
  initializeDatabase,
  isInitialized,
  getViolations
  ,setRound1UnlockedSection
} from '@/lib/db';
import { seedDatabase } from '@/lib/seed-data';

function ensureInitialized() {
  if (!isInitialized()) {
    initializeDatabase();
    seedDatabase();
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    ensureInitialized();
    const { id } = await params;
    
    const participant = getParticipant(id);
    
    if (!participant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }
    
    let round2HintSummary = null;
    if (participant.scenario_id) {
      try {
        round2HintSummary = getRound2HintSummary(id);
      } catch {
        round2HintSummary = null;
      }
    }

    // Get scenario details if assigned
    let scenario = null;
    let components: Array<{
      id: number;
      name: string;
      description: string;
      pinout: string;
      category: string;
      code_snippet: string;
      is_unlocked?: boolean;
      component_hint_penalty?: number;
      setup_instructions?: string;
      connection_diagram?: string;
      warnings?: string[];
      required_libraries?: string[];
      complexity_level?: 'Beginner' | 'Intermediate' | 'Advanced';
    }> = [];
    
    if (participant.scenario_id) {
      scenario = getScenario(participant.scenario_id);
      const scenarioComps = getScenarioComponents(participant.scenario_id);
      const unlockedIds = getUnlockedSnippets(id).map(s => s.component_id);
      
      components = scenarioComps.map(c => ({
        ...c,
        is_unlocked: unlockedIds.includes(c.id),
        component_hint_penalty: (round2HintSummary?.components || []).find((item) => item.componentId === c.id)?.penalty || 0,
      }));
    }
    
    // Get unlocked snippets and violations
    const unlockedSnippets = getUnlockedSnippets(id);
    const violations = getViolations(id);
    
    return NextResponse.json({ 
      participant: {
        ...participant,
        scenario_title: scenario?.title,
        situation: scenario?.situation,
        what_to_build: scenario?.what_to_build,
        snippets_unlocked: unlockedSnippets.length,
        violation_count: violations.length,
        round2_hint_count: round2HintSummary?.hintsUsedCount || 0,
        round2_hint_penalty: round2HintSummary?.totalPenalty || 0,
        round2_score: round2HintSummary?.finalScore ?? participant.round2_score ?? 0,
      }, 
      components,
      unlockedSnippets,
      round2HintSummary,
    });
  } catch (error) {
    console.error('Error fetching participant:', error);
    return NextResponse.json({ error: 'Failed to fetch participant' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    ensureInitialized();
    const { id } = await params;
    const body = await request.json();
    
    const participant = getParticipant(id);
    if (!participant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }
    
    // Handle different update actions
    if (body.action === 'assign_scenario') {
      assignScenario(id, body.scenarioId);
      logActivity(id, 'scenario_assigned', `Assigned scenario ID: ${body.scenarioId}`);
      return NextResponse.json({ success: true });
    }
    
    if (body.action === 'start_timer') {
      const duration = body.duration || 3600;
      startTimer(id, duration);
      return NextResponse.json({ success: true });
    }
    
    if (body.action === 'lock') {
      lockParticipant(id);
      return NextResponse.json({ success: true });
    }

    if (body.action === 'complete_round2') {
      const round2Summary = getRound2HintSummary(id);
      updateParticipant(id, {
        round2_score: round2Summary.finalScore,
        round2_completed: true,
        round2_completed_at: new Date().toISOString(),
        is_locked: 1,
        is_active: 0,
      });
      logActivity(
        id,
        'round2_completed',
        `Round 2 completed. Score: ${round2Summary.finalScore}/${round2Summary.baseScore}, Penalty: ${round2Summary.totalPenalty}/${round2Summary.maxPenalty}, Components accessed: ${round2Summary.hintsUsedCount}/${round2Summary.totalComponents}`
      );
      return NextResponse.json({ success: true, round2Summary });
    }
    
    if (body.action === 'unlock') {
      unlockParticipant(id);
      return NextResponse.json({ success: true });
    }
    
    if (body.action === 'reset') {
      updateParticipant(id, {
        timer_started_at: null,
        is_active: 0,
        is_locked: 0
      });
      // Note: In-memory store doesn't support deleting related records in reset
      // This would need additional cleanup functions
      logActivity(id, 'reset', 'Participant session reset');
      return NextResponse.json({ success: true });
    }
    
    if (body.action === 'log_violation') {
      logViolation(id, body.violationType, body.details, {
        severity: body.severity,
        app_name: body.appName,
      });
      return NextResponse.json({ success: true });
    }
    
    if (body.action === 'log_activity') {
      logActivity(id, body.eventType, body.details);
      return NextResponse.json({ success: true });
    }

    if (body.action === 'assign_round') {
      const round = body.assigned_round === 'null' ? null : body.assigned_round;
      updateParticipant(id, { assigned_round: round });
      logActivity(id, 'round_assigned', `Assigned to: ${round || 'unassigned'}`);
      return NextResponse.json({ success: true });
    }

    if (body.action === 'round1_override_section') {
      const sectionIndex = Number(body.sectionIndex);
      if (Number.isNaN(sectionIndex)) {
        return NextResponse.json({ error: 'sectionIndex must be a number' }, { status: 400 });
      }
      const unlockedSection = setRound1UnlockedSection(id, sectionIndex);
      return NextResponse.json({ success: true, unlockedSection });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error updating participant:', error);
    return NextResponse.json({ error: 'Failed to update participant' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    ensureInitialized();
    const { id } = await params;
    
    deleteParticipant(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting participant:', error);
    return NextResponse.json({ error: 'Failed to delete participant' }, { status: 500 });
  }
}
