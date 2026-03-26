import { NextRequest, NextResponse } from 'next/server';

import { compileArduinoSketch } from '@/lib/arduino-cli';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const code = typeof body?.code === 'string' ? body.code : '';
    const fqbn = typeof body?.fqbn === 'string' && body.fqbn.trim() ? body.fqbn.trim() : 'arduino:avr:uno';

    if (!code.trim()) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const result = await compileArduinoSketch(code, fqbn);

    if (!result.success && result.message.includes('not found')) {
      return NextResponse.json(
        {
          success: false,
          ...result,
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: result.success,
        ...result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error executing snippet compile:', error);
    return NextResponse.json({ error: 'Failed to execute compile check' }, { status: 500 });
  }
}