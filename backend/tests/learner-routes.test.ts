import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import jwt from 'jsonwebtoken';
import type { AddressInfo } from 'node:net';

// No live database is contacted: every query below is answered by a stub.
process.env.SUPABASE_URL = 'http://127.0.0.1:1';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-only';
process.env.JWT_SECRET = 'learner-routes-test-secret-0123456789';
const { supabase } = await import('../src/database/db.js');
const { default: learnerRoutes } = await import('../src/modules/learner/learner.route.js');

const roles: Record<number, string> = { 7: 'learner', 8: 'learner', 9: 'admin' };
const updates: any[] = [];
const original = supabase.from;
supabase.from = ((table: string) => {
  const filters: Record<string, number> = {};
  const query: any = {
    select: () => query,
    eq: (key: string, value: number) => { filters[key] = value; return query; },
    update: (row: unknown) => { updates.push(row); return query; },
    then: (resolve: (value: unknown) => void) => resolve({ data: null, error: null }),
    maybeSingle: async () => ({ error: null, data: table === 'users'
      ? { auth_version: 0, role: roles[filters.id] }
      : { id: filters.id ?? 100 + filters.user_id, user_id: filters.user_id ?? 7, name: 'Kid', avatar: '🦊', grade: 1 } }),
  };
  return query;
}) as any;

const app = express();
app.use(express.json());
app.use('/api/learner', learnerRoutes);
const server = app.listen(0);
const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/learner`;
const auth = (id: number) => ({ Authorization: `Bearer ${jwt.sign({ id, role: roles[id], authVersion: 0 }, process.env.JWT_SECRET!)}`, 'Content-Type': 'application/json' });
test.after(() => { server.close(); supabase.from = original; });

test('unused learner profile routes are removed', async () => {
  assert.equal((await fetch(`${base}/107`, { headers: auth(7) })).status, 404);
  assert.equal((await fetch(`${base}/107`, { method: 'PUT', headers: auth(7), body: JSON.stringify({ grade: 3 }) })).status, 404);
  assert.equal((await fetch(base, { method: 'POST', headers: auth(7), body: JSON.stringify({ user_id: 8, name: 'X' }) })).status, 404);
  assert.equal(updates.length, 0);
});

test('profile by user id is limited to the owner or an admin', async () => {
  assert.equal((await fetch(`${base}/user/8`, { headers: auth(7) })).status, 403);
  const own = await fetch(`${base}/user/7`, { headers: auth(7) });
  assert.equal(own.status, 200);
  assert.equal((await own.json()).user_id, 7);
  const admin = await fetch(`${base}/user/8`, { headers: auth(9) });
  assert.equal(admin.status, 200);
  assert.equal((await admin.json()).user_id, 8);
  assert.equal((await fetch(`${base}/user/abc`, { headers: auth(7) })).status, 400);
});

test('child setup only creates a profile once, with a starter avatar and short nickname', async () => {
  const post = (body: unknown, id = 7) => fetch(`${base}/profile`, { method: 'POST', headers: auth(id), body: JSON.stringify(body) });
  assert.equal((await post({ name: 'Ana', avatar: '🦄' })).status, 400);
  assert.equal((await post({ name: 'x'.repeat(21), avatar: '🐻' })).status, 400);
  assert.equal((await post({ name: 'Ana', avatar: '🐻' })).status, 409);
  assert.equal((await post({ name: 'Ana', avatar: '🐻' }, 9)).status, 403);
  assert.equal(updates.length, 0);
});

test('own profile updates save only the nickname', async () => {
  updates.length = 0;
  const res = await fetch(`${base}/me`, { method: 'PUT', headers: auth(7),
    body: JSON.stringify({ name: '  Ana  ', grade: 6, user_id: 8, equipped_frame_id: 3 }) });
  assert.equal(res.status, 200);
  assert.deepEqual(updates, [{ name: 'Ana' }]);
  const long = await fetch(`${base}/me`, { method: 'PUT', headers: auth(7), body: JSON.stringify({ name: 'x'.repeat(21) }) });
  assert.equal(long.status, 400);
});
