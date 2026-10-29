import test from 'node:test';
import assert from 'node:assert/strict';
import { newGame, gameReducer, unavailable, waves } from '../src/lib/incident-game.ts';

const play = (state, upgrade) => gameReducer(gameReducer(state, { type: 'select', upgrade }), { type: 'run' });

test('a planned strategy survives all eight waves with valid resource bounds', () => {
  let state = newGame();
  const strategy = ['cache', 'server', 'shield', 'breaker', 'server', 'server', 'hold', 'hold'];
  for (const upgrade of strategy) {
    assert.equal(unavailable(state, upgrade), null);
    state = play(state, upgrade);
    assert.ok(state.health >= 0 && state.health <= 100);
    assert.ok(state.credits >= 0);
    assert.ok(state.reports.at(-1).served <= state.reports.at(-1).demand);
    if (state.phase === 'report') state = gameReducer(state, { type: 'next' });
  }
  assert.equal(state.phase, 'finished');
  assert.equal(state.reports.length, waves.length);
  assert.ok(state.health > 0);
});

test('neglect can lose, and repeated run/next actions cannot award extra credits', () => {
  let state = newGame();
  while (state.phase !== 'finished') {
    state = play(state, 'hold');
    assert.strictEqual(gameReducer(state, { type: 'run' }), state);
    if (state.phase === 'report') state = gameReducer(state, { type: 'next' });
  }
  assert.equal(state.health, 0);
  assert.strictEqual(gameReducer(state, { type: 'next' }), state);
  assert.deepEqual(gameReducer(state, { type: 'reset' }), newGame());
});

test('installed upgrades, insufficient credits, and premature next are rejected', () => {
  let state = newGame();
  assert.strictEqual(gameReducer(state, { type: 'next' }), state);
  state = gameReducer(play(state, 'cache'), { type: 'next' });
  assert.equal(unavailable(state, 'cache'), 'Installed');
  assert.strictEqual(gameReducer(state, { type: 'select', upgrade: 'cache' }), state);
  state = { ...state, credits: 0 };
  assert.strictEqual(gameReducer(state, { type: 'select', upgrade: 'server' }), state);
});

test('repairs cap health and defenses prevent only their corresponding incident', () => {
  assert.equal(play({ ...newGame(), health: 90 }, 'repair').health, 100);
  const attack = { ...newGame(), round: 2, capacity: 200 };
  assert.equal(play(attack, 'shield').health, 100);
  assert.equal(play(attack, 'breaker').health, 82);
  const outage = { ...newGame(), round: 3, capacity: 200 };
  assert.equal(play(outage, 'breaker').health, 100);
  assert.equal(play(outage, 'shield').health, 80);
});

test('incident reports explain overload separately from dependency damage', () => {
  const state = play({ ...newGame(), round: 3 }, 'hold');
  const report = state.reports.at(-1);
  assert.equal(report.overloadDamage, 23);
  assert.equal(report.incidentDamage, 20);
  assert.equal(report.damage, report.overloadDamage + report.incidentDamage);
  const protectedState = play({ ...newGame(), round: 3 }, 'breaker');
  assert.equal(protectedState.reports.at(-1).overloadDamage, 23);
  assert.equal(protectedState.reports.at(-1).incidentDamage, 0);
});
