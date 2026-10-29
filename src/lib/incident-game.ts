export const waves = [
  { name: "Opening traffic", demand: 45, event: "normal", brief: "A quiet launch. Build capacity or save credits for the next wave." },
  { name: "Morning rush", demand: 70, event: "normal", brief: "More users arrive. Capacity upgrades stay active for the entire campaign." },
  { name: "Unwanted visitors", demand: 85, event: "attack", brief: "Abusive traffic is approaching. A gateway shield prevents 18 points of incident damage." },
  { name: "A dependency stalls", demand: 105, event: "outage", brief: "An upstream is failing. A circuit breaker prevents 20 points of incident damage." },
  { name: "Launch day", demand: 125, event: "normal", brief: "Demand climbs. Every unserved request adds pressure to service health." },
  { name: "Another attack", demand: 140, event: "attack", brief: "The gateway is under pressure again. Earlier defensive investments still protect you." },
  { name: "Upstream turbulence", demand: 155, event: "outage", brief: "A second dependency incident arrives while load is high. Balance repairs and capacity." },
  { name: "The final surge", demand: 175, event: "normal", brief: "Keep the service alive through the peak to complete your shift." },
] as const;

export const upgrades = {
  server: { name: "Add worker", cost: 30, description: "+25 capacity, permanently", icon: "server" },
  cache: { name: "Deploy cache", cost: 40, description: "+40 capacity, one installation", icon: "cache" },
  shield: { name: "Gateway shield", cost: 25, description: "Blocks attack damage", icon: "shield" },
  breaker: { name: "Circuit breaker", cost: 25, description: "Blocks upstream incident damage", icon: "breaker" },
  repair: { name: "Restore service", cost: 20, description: "+25 health before the wave", icon: "repair" },
  hold: { name: "Hold budget", cost: 0, description: "Save credits for a later wave", icon: "hold" },
} as const;
export type Upgrade = keyof typeof upgrades;
export type Report = { wave: string; demand: number; served: number; damage: number; overloadDamage: number; incidentDamage: number; action: string; protected: boolean };
export type Game = { round: number; credits: number; health: number; capacity: number; cache: boolean; shield: boolean; breaker: boolean; selected: Upgrade; phase: "plan" | "report" | "finished"; reports: Report[] };
export function newGame(): Game { return { round: 0, credits: 75, health: 100, capacity: 60, cache: false, shield: false, breaker: false, selected: "hold", phase: "plan", reports: [] }; }
export function unavailable(game: Game, upgrade: Upgrade): string | null {
  if (game.phase !== "plan") return "Wave already resolved";
  if ((upgrade === "cache" || upgrade === "shield" || upgrade === "breaker") && game[upgrade]) return "Installed";
  if (upgrade === "repair" && game.health === 100) return "Health is full";
  return game.credits < upgrades[upgrade].cost ? "Not enough credits" : null;
}
export type Action = { type: "select"; upgrade: Upgrade } | { type: "run" } | { type: "next" } | { type: "reset" };
export function gameReducer(game: Game, action: Action): Game {
  if (action.type === "reset") return newGame();
  if (action.type === "select") return unavailable(game, action.upgrade) ? game : { ...game, selected: action.upgrade };
  if (action.type === "next") return game.phase === "report" ? { ...game, round: game.round + 1, selected: "hold", phase: "plan" } : game;
  if (action.type !== "run" || unavailable(game, game.selected)) return game;
  const next = { ...game, credits: game.credits - upgrades[game.selected].cost };
  if (game.selected === "server") next.capacity += 25;
  if (game.selected === "cache") { next.cache = true; next.capacity += 40; }
  if (game.selected === "shield") next.shield = true;
  if (game.selected === "breaker") next.breaker = true;
  if (game.selected === "repair") next.health = Math.min(100, next.health + 25);
  const wave = waves[game.round];
  const protectedEvent = wave.event === "attack" ? next.shield : wave.event === "outage" ? next.breaker : true;
  const served = Math.min(next.capacity, wave.demand);
  const overloadDamage = Math.ceil((wave.demand - served) / 2);
  const incidentDamage = protectedEvent ? 0 : wave.event === "attack" ? 18 : 20;
  const damage = overloadDamage + incidentDamage;
  next.health = Math.max(0, next.health - damage);
  next.credits += 22;
  next.reports = [...game.reports, { wave: wave.name, demand: wave.demand, served, damage, overloadDamage, incidentDamage, action: upgrades[game.selected].name, protected: protectedEvent }];
  next.phase = next.health === 0 || next.round === waves.length - 1 ? "finished" : "report";
  return next;
}
