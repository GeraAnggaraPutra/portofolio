import assert from "node:assert/strict";
import test from "node:test";
import {
  advance, asteroidAt, beginAction, distance, lakeWind, lightingThreshold,
  newRun, objective, spring, steerTo, worlds,
} from "../src/lib/game-rules.ts";

const idle = { x: 0, y: 0 };
const step = 1 / 30;

test("both steering inputs move every protagonist over time", () => {
  for (const world of worlds) {
    const run = newRun(world);
    const destination = { x: run.position.x + 82, y: run.position.y };
    steerTo(world, run, destination);
    assert.deepEqual(run.position, world.spawn);
    advance(world, run, idle, step);
    assert.ok(run.position.x > world.spawn.x && run.position.x < destination.x);
    advance(world, run, { x: -1, y: 0 }, step);
    assert.equal(run.destination, null);
  }
});

test("objectives require proximity and the island's spring replenishes a depleted tank", () => {
  const world = worlds.find(({id}) => id === "drone");
  const run = newRun(world);
  beginAction(world, run);
  assert.equal(run.progress, null);
  function visit() {
    run.position = { ...objective(world, run) };
    beginAction(world, run);
    while (run.progress !== null) advance(world, run, idle, step);
  }
  visit();
  visit();
  assert.equal(objective(world, run), spring);
  assert.equal(run.water, 0);
  visit();
  assert.equal(run.water, 2);
  assert.equal(run.current, 2);
});

test("the lantern only catches in a lull and stays lit once completed", () => {
  const world = worlds.find(({id}) => id === "boat");
  const run = newRun(world);
  run.position = {...objective(world, run)};
  run.time = .75;
  assert.ok(lakeWind(run.time) > lightingThreshold);
  beginAction(world, run);
  assert.equal(run.progress, null);
  run.time = 2.5;
  beginAction(world, run);
  assert.equal(run.progress, 0);
  for (let i=0; i<40; i++) advance(world, run, idle, step);
  assert.equal(run.visited[0], true);
  assert.equal(run.current, 1);
});

test("an asteroid interrupts scanning and the final shield ends the run", () => {
  const world = worlds.find(({id}) => id === "ship");
  const run = newRun(world);
  run.position = asteroidAt(0, step);
  run.shields = 1;
  run.progress = .2;
  advance(world, run, idle, step);
  assert.equal(run.shields, 0);
  assert.equal(run.finish, "lost");
  assert.equal(run.progress, null);
  const stopped = structuredClone(run);
  advance(world, run, {x:1,y:0}, step);
  assert.deepEqual(run, stopped);
});

test("a koi feeding waits for the school to reach the lead fish", () => {
  const world = worlds[0], run = newRun(world);
  run.position = {...objective(world, run)};
  run.companions.forEach(f => {f.x = 850; f.y = 460;});
  beginAction(world,run);
  for(let i=0;i<200 && run.current===0;i++) advance(world,run,idle,step);
  assert.equal(run.current,1);
  assert.ok(run.companions.every(f=>distance(f,run.position)<62));
});
