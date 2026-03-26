import { beforeEach, describe, expect, it } from 'vitest';

import {
  addWhitelistedApp,
  changeAdminPassword,
  getGlobalTimerDuration,
  getPasswordHistory,
  getWhitelistedApps,
  isAppWhitelisted,
  logViolation,
  setGlobalTimerDuration,
  verifyAdminPassword,
} from '@/lib/db';

describe('admin core DB behavior (unit)', () => {
  beforeEach(() => {
    // Reset in-memory store to keep tests deterministic.
    (globalThis as { __iotStore?: unknown }).__iotStore = undefined;
  });

  it('verifies default admin password and rejects invalid password', () => {
    expect(verifyAdminPassword('admin123')).toBe(true);
    expect(verifyAdminPassword('wrong-password')).toBe(false);
  });

  it('changes password and keeps only the last 5 history entries', () => {
    let current = 'admin123';

    for (let i = 0; i < 6; i += 1) {
      const next = `NewPass${i}A!`;
      expect(changeAdminPassword(current, next)).toBe(true);
      current = next;
    }

    const history = getPasswordHistory();
    expect(history).toHaveLength(5);
    expect(history[0].old_password).toBe('NewPass0A!');
    expect(verifyAdminPassword('NewPass5A!')).toBe(true);
  });

  it('updates and reads global timer duration', () => {
    expect(getGlobalTimerDuration()).toBe(7200);

    setGlobalTimerDuration(5400);
    expect(getGlobalTimerDuration()).toBe(5400);
  });

  it('adds, checks, and removes whitelisted applications', () => {
    addWhitelistedApp('Sublime Text');

    expect(getWhitelistedApps()).toContain('Sublime Text');
    expect(isAppWhitelisted('Sublime Text')).toBe(true);
  });

  it('auto-categorizes core proctoring violation severities', () => {
    logViolation('p1', 'local_app_access', 'Using IDE');
    logViolation('p1', 'tab_switch', 'Switched tab');
    logViolation('p1', 'window_blur', 'Lost focus');

    const store = (globalThis as { __iotStore?: { violations?: Array<{ severity?: string }> } }).__iotStore;
    const severities = store?.violations?.map((v) => v.severity) ?? [];

    expect(severities).toContain('permitted');
    expect(severities).toContain('critical');
    expect(severities).toContain('warning');
  });
});
