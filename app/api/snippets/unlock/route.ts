import { NextRequest, NextResponse } from 'next/server';
import { 
  getParticipant, 
  getComponent,
  unlockSnippet, 
  initializeDatabase, 
  isInitialized 
} from '@/lib/db';
import { seedDatabase } from '@/lib/seed-data';

function buildStarterHintPack(component: {
  name: string;
  description: string;
  pinout: string;
  setup_instructions?: string;
  warnings?: string[];
  required_libraries?: string[];
}): string {
  const setupLines = component.setup_instructions
    ? component.setup_instructions.split('\n').map((line) => line.trim()).filter(Boolean)
    : ['1. Verify power (VCC) and GND first.', '2. Confirm signal pins before coding.', '3. Test with a minimal serial output.'];

  const warningLines = component.warnings && component.warnings.length > 0
    ? component.warnings
    : ['Keep wiring stable and avoid hot-plugging while powered.'];

  const libs = component.required_libraries && component.required_libraries.length > 0
    ? component.required_libraries.join(', ')
    : 'None required';

  return [
    `// Starter Guidance Pack: ${component.name}`,
    '// This is intentionally basic. Complete the logic yourself.',
    '',
    '/*',
    `Description: ${component.description}`,
    `Pinout: ${component.pinout}`,
    `Libraries: ${libs}`,
    'Setup checklist:',
    ...setupLines.map((line) => `- ${line}`),
    'Warnings:',
    ...warningLines.map((line) => `- ${line}`),
    '*/',
    '',
    'void setup() {',
    '  // TODO: initialize serial and pin modes based on the pinout above',
    '}',
    '',
    'void loop() {',
    '  // TODO: read inputs, apply logic, and drive outputs for this component',
    '}',
  ].join('\n');
}

function ensureInitialized() {
  if (!isInitialized()) {
    initializeDatabase();
    seedDatabase();
  }
}

export async function POST(request: NextRequest) {
  try {
    ensureInitialized();
    const body = await request.json();
    const { participantId, componentId } = body;
    
    if (!participantId || !componentId) {
      return NextResponse.json({ error: 'Participant ID and Component ID are required' }, { status: 400 });
    }
    
    // Check if participant exists and is not locked
    const participant = getParticipant(participantId);
    if (!participant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }
    
    if (participant.is_locked) {
      return NextResponse.json({ error: 'Dashboard is locked' }, { status: 403 });
    }
    
    // Unlock the snippet
    const result = unlockSnippet(participantId, componentId);
    
    if (!result.success) {
      return NextResponse.json({ success: true, alreadyUnlocked: true });
    }
    
    // Get the snippet
    const component = getComponent(componentId);
    
    return NextResponse.json({ 
      success: true, 
      snippet: component ? buildStarterHintPack(component) : null,
    });
  } catch (error) {
    console.error('Error unlocking snippet:', error);
    return NextResponse.json({ error: 'Failed to unlock snippet' }, { status: 500 });
  }
}
