import { describe, it, expect } from "vitest";
import {
  defaultProfile,
  roommates,
  filterListings,
  listings,
  type Roommate,
} from "../src/lib/data";
import { compatibility, directionalScore } from "../src/lib/matching";
const clone = () => structuredClone(defaultProfile);
describe("two-way compatibility", () => {
  it("ranks identical compatible profiles at 100", () => {
    expect(compatibility(defaultProfile, roommates[0])?.score).toBe(100);
  });
  it.each(["city", "budget", "gender", "id"] as const)(
    "excludes incompatible %s",
    (key) => {
      const p = clone();
      if (key === "city") p.city = "Delhi";
      if (key === "budget") p.budget = [20000, 25000];
      if (key === "gender") p.gender = "Man";
      if (key === "id") p.id = "ananya";
      expect(compatibility(p, roommates[0])).toBeNull();
    },
  );
  it("requires both people to opt into any-gender matches", () => {
    const a = clone();
    a.anyGender = true;
    const b = structuredClone(roommates[3]);
    expect(compatibility(a, b)).toBeNull();
    b.anyGender = true;
    expect(compatibility(a, b)).not.toBeNull();
  });
  it("enforces dealbreakers from both directions", () => {
    const a = clone();
    const b = structuredClone(roommates[0]);
    b.traits.smoking = "Yes";
    expect(compatibility(a, b)).toBeNull();
    a.preferences.dealbreakers = [];
    a.traits.smoking = "Occasionally";
    expect(compatibility(a, b)).toBeNull();
  });
  it("uses preference weights and ordinal cleanliness closeness", () => {
    const a = clone();
    const b = structuredClone(roommates[0]);
    b.traits.cleanliness = 3;
    expect(directionalScore(a, b)).toBe(95);
    a.preferences.weights.cleanliness = 0;
    expect(directionalScore(a, b)).toBe(100);
  });
  it("is symmetric even when directional scores differ", () => {
    const a = clone();
    const b = structuredClone(roommates[1]);
    a.preferences.traits.social = "Introvert";
    expect(compatibility(a, b)?.score).toBe(compatibility(b, a)?.score);
    expect(directionalScore(a, b)).not.toBe(directionalScore(b, a));
  });
  it("handles all zero weights and caps college bonuses", () => {
    const a = clone();
    Object.keys(a.preferences.weights).forEach(
      (k) => (a.preferences.weights[k as keyof Roommate["traits"]] = 0),
    );
    expect(compatibility(a, roommates[0])?.score).toBe(100);
  });
});
describe("PG search", () => {
  const filters = {
    query: "",
    budget: 15000,
    genders: [],
    sharing: [],
    food: false,
    ac: false,
    sort: "recommended",
  };
  it("searches colleges and localities case insensitively", () => {
    expect(
      filterListings(listings, { ...filters, query: "  btm layout  " }),
    ).toHaveLength(2);
    expect(
      filterListings(listings, { ...filters, query: "Christ University" }),
    ).toHaveLength(4);
  });
  it("combines budget, gender, room sharing, and amenities", () => {
    expect(
      filterListings(listings, {
        ...filters,
        genders: ["Girls"],
        sharing: ["Single"],
        food: true,
        ac: true,
        budget: 11000,
      }).map((x) => x.id),
    ).toEqual(["nest"]);
    expect(filterListings(listings, { ...filters, budget: 3000 })).toEqual([]);
  });
  it("sorts by price without mutating source data", () => {
    const first = listings[0].id;
    expect(filterListings(listings, { ...filters, sort: "price" })[0].id).toBe(
      "campus",
    );
    expect(listings[0].id).toBe(first);
  });
});
