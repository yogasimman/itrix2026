import { beforeEach, describe, expect, it } from 'vitest';

import { GET as getPasswordHistoryRoute, POST as postPasswordRoute } from '@/app/api/admin/password/route';
import { GET as getTimerRoute, POST as postTimerRoute } from '@/app/api/admin/timer/route';
import { POST as postVerifyRoute } from '@/app/api/admin/verify/route';
import { GET as getWhitelistRoute, POST as postWhitelistRoute } from '@/app/api/admin/whitelist/route';

function makeJsonRequest(body: unknown): Request {
  return new Request('http://localhost/api/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('admin API routes (integration)', () => {
  beforeEach(() => {
    // Reset in-memory store to keep tests independent.
    (globalThis as { __iotStore?: unknown }).__iotStore = undefined;
  });

  it('verifies credentials via /api/admin/verify', async () => {
    const ok = await postVerifyRoute(makeJsonRequest({ password: 'admin123' }) as never);
    const bad = await postVerifyRoute(makeJsonRequest({ password: 'bad' }) as never);

    expect(ok.status).toBe(200);
    expect(await ok.json()).toEqual({ valid: true });

    expect(bad.status).toBe(401);
    expect(await bad.json()).toEqual({ valid: false, error: 'Invalid password' });
  });

  it('enforces password policy and supports password changes with history endpoint', async () => {
    const weak = await postPasswordRoute(
      makeJsonRequest({
        currentPassword: 'admin123',
        newPassword: 'weak',
        confirmPassword: 'weak',
      }) as never
    );

    expect(weak.status).toBe(400);

    const changed = await postPasswordRoute(
      makeJsonRequest({
        currentPassword: 'admin123',
        newPassword: 'Stronger1!',
        confirmPassword: 'Stronger1!',
      }) as never
    );

    expect(changed.status).toBe(200);

    const historyRes = await getPasswordHistoryRoute();
    const historyData = (await historyRes.json()) as { history: Array<{ new_password: string }> };

    expect(historyRes.status).toBe(200);
    expect(historyData.history.length).toBe(1);
    expect(historyData.history[0].new_password).toBe('Stronger1!');
  });

  it('gets and sets the global timer via /api/admin/timer', async () => {
    const initial = await getTimerRoute();
    const initialData = (await initial.json()) as { global_timer_duration: number; minutes: number };

    expect(initialData.global_timer_duration).toBe(7200);
    expect(initialData.minutes).toBe(120);

    const updated = await postTimerRoute(makeJsonRequest({ duration: 3600 }) as never);
    const updatedData = (await updated.json()) as { success: boolean; global_timer_duration: number; minutes: number };

    expect(updated.status).toBe(200);
    expect(updatedData).toEqual({
      success: true,
      global_timer_duration: 3600,
      minutes: 60,
    });
  });

  it('manages whitelist apps via /api/admin/whitelist', async () => {
    const add = await postWhitelistRoute(
      makeJsonRequest({ action: 'add', app_name: 'Sublime Text' }) as never
    );
    expect(add.status).toBe(200);

    const list = await getWhitelistRoute();
    const listData = (await list.json()) as { whitelisted_apps: string[] };
    expect(listData.whitelisted_apps).toContain('Sublime Text');

    const remove = await postWhitelistRoute(
      makeJsonRequest({ action: 'remove', app_name: 'Sublime Text' }) as never
    );
    expect(remove.status).toBe(200);

    const listAfterRemove = await getWhitelistRoute();
    const afterData = (await listAfterRemove.json()) as { whitelisted_apps: string[] };
    expect(afterData.whitelisted_apps).not.toContain('Sublime Text');
  });
});
