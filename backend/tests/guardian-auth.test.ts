import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcrypt';

// No live database is contacted: every query below is answered by a stub.
process.env.SUPABASE_URL = 'http://127.0.0.1:1';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-only';
process.env.JWT_SECRET = 'guardian-auth-test-secret-0123456789';
const { supabase } = await import('../src/database/db.js');
const { getJwtSecret } = await import('../src/config/jwt.js');
const { AuthService } = await import('../src/modules/auth/auth.service.js');
const { AuthController, CONSENT_VERSION } = await import('../src/modules/auth/auth.controller.js');
const { loginLimit } = await import('../src/modules/auth/auth.route.js');

const controller = new AuthController(new AuthService());
function response() {
  return { statusCode: 200, body: undefined as any,
    status(code: number) { this.statusCode = code; return this; },
    json(body: unknown) { this.body = body; return this; } };
}
function stubUsers(passwordHash = '') {
  const original = supabase.from;
  const calls = { inserts: [] as any[], deletes: 0 };
  supabase.from = ((table: string) => {
    const query: any = {
      select: () => query, eq: () => query,
      maybeSingle: async () => ({ data: passwordHash ? { password_hash: passwordHash } : null, error: null }),
      insert: (row: any) => { calls.inserts.push({ table, row }); return query; },
      single: async () => ({ data: { id: 5, email: calls.inserts.at(-1)?.row.email, role: calls.inserts.at(-1)?.row.role }, error: null }),
      delete: () => { calls.deletes++; return { eq: async () => ({ data: null, error: null }) }; },
    };
    return query;
  }) as any;
  return { calls, restore: () => { supabase.from = original; } };
}
const registration = { email: 'Guardian@Example.com', password: 'Secret12!', confirmPassword: 'Secret12!', role: 'learner' };

test('registration is rejected without guardian confirmation and consent', async () => {
  const stub = stubUsers();
  try {
    for (const extra of [{}, { guardianConfirmed: true }, { consent: true, consentVersion: CONSENT_VERSION },
      { guardianConfirmed: true, consent: true }, { guardianConfirmed: true, consent: true, consentVersion: 'old' },
      { guardianConfirmed: 'true', consent: true, consentVersion: CONSENT_VERSION }]) {
      const res = response();
      await controller.register({ body: { ...registration, ...extra } } as any, res as any);
      assert.equal(res.statusCode, 400);
    }
    assert.equal(stub.calls.inserts.length, 0);
  } finally { stub.restore(); }
});

test('registration with consent stores consent time and version and no child profile', async () => {
  const stub = stubUsers();
  try {
    const res = response();
    await controller.register({ body: { ...registration, guardianConfirmed: true, consent: true, consentVersion: CONSENT_VERSION } } as any, res as any);
    assert.equal(res.statusCode, 201);
    assert.equal(stub.calls.inserts.length, 1);
    const { table, row } = stub.calls.inserts[0];
    assert.equal(table, 'users');
    assert.equal(row.email, 'guardian@example.com');
    assert.equal(row.consent_version, CONSENT_VERSION);
    assert.ok(Date.parse(row.consent_at) > 0);
    assert.notEqual(row.password_hash, 'Secret12!');
  } finally { stub.restore(); }
});

test('registration and recovery require a strong password', async () => {
  const { isStrongPassword } = await import('../src/modules/auth/passwordPolicy.js');
  for (const weak of ['Sh0rt!', 'alllower1!', 'ALLUPPER1!', 'NoNumber!', 'NoSpecial1', 'Aa1!' + 'x'.repeat(69), 12345678, undefined]) {
    assert.equal(isStrongPassword(weak), false, String(weak));
  }
  assert.equal(isStrongPassword('Secret12!'), true);
  const stub = stubUsers();
  try {
    const res = response();
    await controller.register({ body: { ...registration, password: 'secret12', confirmPassword: 'secret12', guardianConfirmed: true, consent: true, consentVersion: CONSENT_VERSION } } as any, res as any);
    assert.equal(res.statusCode, 400);
    assert.match(res.body.message, /uppercase/);
    assert.equal(stub.calls.inserts.length, 0);
  } finally { stub.restore(); }
});

test('account deletion requires DELETE and the correct guardian password', async () => {
  const stub = stubUsers(await bcrypt.hash('right-pass', 4));
  try {
    for (const body of [{ password: 'right-pass' }, { confirmation: 'delete', password: 'right-pass' }, { confirmation: 'DELETE' }, undefined]) {
      const res = response();
      await controller.deleteAccount({ userId: 21, body } as any, res as any);
      assert.equal(res.statusCode, 400);
    }
    const wrong = response();
    await controller.deleteAccount({ userId: 21, body: { confirmation: 'DELETE', password: 'wrong-pass' } } as any, wrong as any);
    assert.equal(wrong.statusCode, 403);
    assert.equal(stub.calls.deletes, 0);
    const ok = response();
    await controller.deleteAccount({ userId: 21, body: { confirmation: 'DELETE', password: 'right-pass' } } as any, ok as any);
    assert.equal(ok.statusCode, 200);
    assert.equal(stub.calls.deletes, 1);
  } finally { stub.restore(); }
});

test('five wrong delete passwords lock deletion even with the right password', async () => {
  const stub = stubUsers(await bcrypt.hash('right-pass', 4));
  try {
    for (let attempt = 0; attempt < 5; attempt++) {
      const res = response();
      await controller.deleteAccount({ userId: 22, body: { confirmation: 'DELETE', password: 'wrong-pass' } } as any, res as any);
      assert.equal(res.statusCode, 403);
    }
    const locked = response();
    await controller.deleteAccount({ userId: 22, body: { confirmation: 'DELETE', password: 'right-pass' } } as any, locked as any);
    assert.equal(locked.statusCode, 429);
    assert.equal(stub.calls.deletes, 0);
  } finally { stub.restore(); }
});

test('JWT_SECRET is required and must be at least 32 characters', () => {
  const original = process.env.JWT_SECRET;
  try {
    delete process.env.JWT_SECRET;
    assert.throws(getJwtSecret, /at least 32/);
    process.env.JWT_SECRET = 'x'.repeat(31);
    assert.throws(getJwtSecret, /at least 32/);
    process.env.JWT_SECRET = 'x'.repeat(32);
    assert.equal(getJwtSecret(), 'x'.repeat(32));
  } finally { process.env.JWT_SECRET = original; }
});

test('login is rate limited per IP', () => {
  let passed = 0;
  const run = (ip: string) => { const res = response(); loginLimit.middleware({ ip } as any, res as any, () => { passed++; }); return res; };
  for (let attempt = 0; attempt < 60; attempt++) run('203.0.113.9');
  assert.equal(passed, 60);
  assert.equal(run('203.0.113.9').statusCode, 429);
  assert.equal(passed, 60);
  run('203.0.113.10');
  assert.equal(passed, 61);
});
