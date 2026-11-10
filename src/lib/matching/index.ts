import type { Roommate, Traits } from "../data";
function closeness(a: Traits[keyof Traits], b: Traits[keyof Traits]) {
  return typeof a === "number" && typeof b === "number"
    ? 1 - Math.abs(a - b) / 4
    : Number(a === b);
}
export function directionalScore(a: Roommate, b: Roommate) {
  let sum = 0,
    weights = 0;
  for (const key of Object.keys(a.preferences.traits) as (keyof Traits)[]) {
    const w = a.preferences.weights[key];
    sum += w * closeness(a.preferences.traits[key], b.traits[key]);
    weights += w;
  }
  return weights ? (100 * sum) / weights : 100;
}
export function compatibility(
  a: Roommate,
  b: Roommate,
): { score: number; reasons: string[] } | null {
  if (
    a.id === b.id ||
    a.city !== b.city ||
    (!(a.anyGender && b.anyGender) && a.gender !== b.gender) ||
    a.budget[0] > b.budget[1] ||
    b.budget[0] > a.budget[1]
  )
    return null;
  for (const [from, to] of [
    [a, b],
    [b, a],
  ])
    for (const key of from.preferences.dealbreakers)
      if (closeness(from.preferences.traits[key], to.traits[key]) < 1)
        return null;
  const reasons = ["Budget fits"];
  if (a.traits.sleep === b.traits.sleep)
    reasons.push(`Both ${a.traits.sleep.toLowerCase()}s`);
  if (a.traits.food === b.traits.food) reasons.push(a.traits.food);
  if (a.college === b.college) reasons.push("Same college");
  const bonus = a.college === b.college ? 4 : 0;
  return {
    score: Math.min(
      100,
      Math.round(
        Math.sqrt(directionalScore(a, b) * directionalScore(b, a)) + bonus,
      ),
    ),
    reasons,
  };
}
