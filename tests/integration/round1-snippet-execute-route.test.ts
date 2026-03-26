import { beforeEach, describe, expect, it, vi } from 'vitest';

import { POST as executeSnippet } from '@/app/api/round1/snippet-execute/route';

const compileArduinoSketchMock = vi.fn();

vi.mock('@/lib/arduino-cli', () => ({
  compileArduinoSketch: (...args: unknown[]) => compileArduinoSketchMock(...args),
}));

function makeJsonRequest(body: unknown): Request {
  return new Request('http://localhost/api/round1/snippet-execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('round1 snippet execute route', () => {
  beforeEach(() => {
    compileArduinoSketchMock.mockReset();
  });

  it('returns 400 for empty code', async () => {
    const res = await executeSnippet(makeJsonRequest({ code: '   ' }) as never);
    const body = (await res.json()) as { error: string };

    expect(res.status).toBe(400);
    expect(body.error).toBe('Code is required');
    expect(compileArduinoSketchMock).not.toHaveBeenCalled();
  });

  it('returns success payload for successful compile', async () => {
    compileArduinoSketchMock.mockResolvedValue({
      success: true,
      message: 'Compilation successful.',
      stdout: 'Sketch uses 1234 bytes',
      stderr: '',
      command: 'arduino-cli compile --fqbn arduino:avr:uno',
    });

    const res = await executeSnippet(makeJsonRequest({ code: 'void setup() {} void loop() {}' }) as never);
    const body = (await res.json()) as { success: boolean; message: string };

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toContain('successful');
  });

  it('returns 503 when arduino-cli is unavailable', async () => {
    compileArduinoSketchMock.mockResolvedValue({
      success: false,
      message: 'arduino-cli was not found. Install Arduino CLI and add it to PATH.',
      stdout: '',
      stderr: 'ENOENT',
      command: 'arduino-cli compile --fqbn arduino:avr:uno',
    });

    const res = await executeSnippet(makeJsonRequest({ code: 'void setup() {} void loop() {}' }) as never);
    const body = (await res.json()) as { success: boolean; message: string };

    expect(res.status).toBe(503);
    expect(body.success).toBe(false);
    expect(body.message).toContain('not found');
  });
});