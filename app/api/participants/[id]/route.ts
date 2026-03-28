import { NextRequest, NextResponse } from 'next/server';
import { 
  getParticipant, 
  getAllParticipants,
  getAllScenarios,
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

function resolveParticipantId(rawId: string): string {
  const trimmed = rawId.trim();
  if (!trimmed) return trimmed;
  const candidates = [trimmed, trimmed.toUpperCase(), trimmed.toLowerCase()];
  for (const candidate of candidates) {
    if (getParticipant(candidate)) {
      return candidate;
    }
  }
  return trimmed.toUpperCase();
}

function isRequireRound2(value: string | null): boolean {
  if (!value) return false;
  return ['1', 'true', 'yes'].includes(value.toLowerCase());
}

function pickAvailableScenarioId(currentParticipantId: string): number | null {
  const scenarios = getAllScenarios();
  if (scenarios.length === 0) return null;

  const participants = getAllParticipants();
  const assignedScenarioIds = new Set(
    participants
      .filter((p) => p.scenario_id && p.id !== currentParticipantId)
      .map((p) => p.scenario_id)
  );

  const available = scenarios.filter((s) => !assignedScenarioIds.has(s.id));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)].id;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    const participantId = resolveParticipantId(id);
    const { searchParams } = new URL(request.url);
    const requireRound2 = isRequireRound2(searchParams.get('requireRound2'));
    
    const participant = getParticipant(participantId);
    
    if (!participant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }

    if (requireRound2 && participant.assigned_round !== 'round2') {
      return NextResponse.json(
        { error: 'Participant is not assigned to Round 2' },
        { status: 403 }
      );
    }
    
    const serverNow = new Date();
    let timerRemainingSeconds: number | null = null;
    if (participant.timer_started_at) {
      const startedAtMs = new Date(participant.timer_started_at).getTime();
      const elapsed = Math.max(0, Math.floor((serverNow.getTime() - startedAtMs) / 1000));
      timerRemainingSeconds = Math.max(0, participant.timer_duration - elapsed);
    }

    let round2HintSummary = null;
    if (participant.scenario_id) {
      try {
        round2HintSummary = getRound2HintSummary(participantId);
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
    }

    if (scenario) {
      const scenarioComps = getScenarioComponents(scenario.id);
      const unlockedIds = getUnlockedSnippets(participantId).map(s => s.component_id);
      
      components = scenarioComps.map(c => ({
        ...c,
        is_unlocked: unlockedIds.includes(c.id),
        component_hint_penalty: (round2HintSummary?.components || []).find((item) => item.componentId === c.id)?.penalty || 0,
      }));
    }
    
    // Get unlocked snippets and violations
    const unlockedSnippets = getUnlockedSnippets(participantId);
    const violations = participant.assigned_round === 'round2' ? [] : getViolations(participantId);
    
    return NextResponse.json({ 
      participant: {
        ...participant,
        scenario_id: scenario?.id || null,
        scenario_title: scenario?.title,
        situation: scenario?.situation,
        what_to_build: scenario?.what_to_build,
        snippets_unlocked: unlockedSnippets.length,
        violation_count: violations.length,
        round2_hint_count: round2HintSummary?.hintsUsedCount || 0,
        round2_hint_penalty: round2HintSummary?.totalPenalty || 0,
        round2_score: round2HintSummary?.finalScore ?? participant.round2_score ?? 0,
        timer_remaining_seconds: timerRemainingSeconds,
      }, 
      components,
      unlockedSnippets,
      round2HintSummary,
      server_now: serverNow.toISOString(),
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
    const participantId = resolveParticipantId(id);
    const body = await request.json();
    
    const participant = getParticipant(participantId);
    if (!participant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }
    
    // Handle different update actions
    if (body.action === 'assign_scenario') {
      const scenario = getScenario(Number(body.scenarioId));
      if (!scenario) {
        return NextResponse.json({ error: 'Invalid scenario ID. Only official PDF scenarios are allowed.' }, { status: 400 });
      }
      assignScenario(participantId, scenario.id);
      logActivity(participantId, 'scenario_assigned', `Assigned scenario ID: ${scenario.id}`);
      return NextResponse.json({ success: true });
    }
    
    if (body.action === 'start_timer') {
      const duration = body.duration || 5400;
      startTimer(participantId, duration);
      return NextResponse.json({ success: true });
    }
    
    if (body.action === 'lock') {
      lockParticipant(participantId);
      return NextResponse.json({ success: true });
    }

    if (body.action === 'complete_round2') {
      const round2Summary = getRound2HintSummary(participantId);
      updateParticipant(participantId, {
        round2_score: round2Summary.finalScore,
        round2_completed: true,
        round2_completed_at: new Date().toISOString(),
        is_locked: 1,
        is_active: 0,
      });
      logActivity(
        participantId,
        'round2_completed',
        `Round 2 completed. Score: ${round2Summary.finalScore}/${round2Summary.baseScore}, Penalty: ${round2Summary.totalPenalty}/${round2Summary.maxPenalty}, Components accessed: ${round2Summary.hintsUsedCount}/${round2Summary.totalComponents}`
      );
      return NextResponse.json({ success: true, round2Summary });
    }
    
    if (body.action === 'unlock') {
      unlockParticipant(participantId);
      return NextResponse.json({ success: true });
    }
    
    if (body.action === 'reset') {
      updateParticipant(participantId, {
        timer_started_at: null,
        is_active: 0,
        is_locked: 0
      });
      // Note: In-memory store doesn't support deleting related records in reset
      // This would need additional cleanup functions
      logActivity(participantId, 'reset', 'Participant session reset');
      return NextResponse.json({ success: true });
    }
    
    if (body.action === 'log_violation') {
      if (participant.assigned_round === 'round2') {
        return NextResponse.json({ success: true, skipped: true });
      }
      logViolation(participantId, body.violationType, body.details, {
        severity: body.severity,
        app_name: body.appName,
      });
      return NextResponse.json({ success: true });
    }
    
    if (body.action === 'log_activity') {
      logActivity(participantId, body.eventType, body.details);
      return NextResponse.json({ success: true });
    }

    if (body.action === 'assign_round') {
      const round = body.assigned_round === 'null' ? null : body.assigned_round;
      if (round === 'round2' && !participant.round2_completed) {
        updateParticipant(participantId, {
          assigned_round: round,
          is_locked: 0,
          is_active: 0,
          timer_started_at: null,
        });
      } else {
        updateParticipant(participantId, { assigned_round: round });
      }
      if (round === 'round2' && !participant.scenario_id) {
        const scenarioId = pickAvailableScenarioId(participantId);
        if (scenarioId !== null) {
          assignScenario(participantId, scenarioId);
          logActivity(participantId, 'scenario_assigned', `Auto-assigned scenario ID: ${scenarioId}`);
        }
      }
      logActivity(participantId, 'round_assigned', `Assigned to: ${round || 'unassigned'}`);
      return NextResponse.json({ success: true });
    }

    if (body.action === 'round1_override_section') {
      const sectionIndex = Number(body.sectionIndex);
      if (Number.isNaN(sectionIndex)) {
        return NextResponse.json({ error: 'sectionIndex must be a number' }, { status: 400 });
      }
      const unlockedSection = setRound1UnlockedSection(participantId, sectionIndex);
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
    const participantId = resolveParticipantId(id);

    const participant = getParticipant(participantId);
    if (!participant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }
    
    deleteParticipant(participantId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting participant:', error);
    return NextResponse.json({ error: 'Failed to delete participant' }, { status: 500 });
  }
}
