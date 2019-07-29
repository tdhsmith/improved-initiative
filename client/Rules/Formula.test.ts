// import { DefaultRules, IRules } from "./Rules";
import { text } from "body-parser";
import { StatBlock } from "../../common/StatBlock";
import {
  AbilityReference,
  Die,
  Formula,
  FormulaTerm,
  StatReference
} from "./Formula";
import { DefaultRules } from "./Rules";

describe("Formula", () => {
  let term: FormulaTerm;
  let stats: StatBlock;
  let rules = new DefaultRules();

  beforeEach(() => {
    stats = StatBlock.Default();
    stats.Abilities.Dex = 16;
    stats.ProficiencyBonus = 2;
  });

  test("Die roll", () => {
    term = new Die("2d6", rules);
    Math.random = jest
      .fn()
      .mockReturnValueOnce(5 / 6)
      .mockReturnValueOnce(3 / 6);
    expect(term.Evaluate()).toBe(8);
  });

  test("Extract dexterity", () => {
    term = new AbilityReference("[DEX]", rules);
    expect(term.Evaluate(stats)).toBe(3);
    expect(term.FormulaString()).toBe("Dex");
  });

  test("Extract proficiency bonus", () => {
    term = new StatReference("[PROF]", rules);
    expect(term.Evaluate(stats)).toBe(2);
    expect(term.FormulaString()).toBe("ProficiencyBonus");
  });

  test("Build formula", () => {
    term = new Formula("1d6 + [DEX] + [PROF] - 5", rules);
    expect(term.FormulaString()).toBe("1d6+Dex+ProficiencyBonus-5");
  });

  test("Evaluate formula", () => {
    term = new Formula("1d6 + [DEX] + [PROF] - 5", rules);
    Math.random = jest.fn().mockReturnValueOnce(5 / 6);
    expect(term.Evaluate(stats)).toBe(5 + 3 + 2 - 5);
  });

  test("Requiring stats", () => {
    term = new Formula("1d6 + [DEX] + [PROF] - 5", rules);
    expect(term.RequiresStats).toBe(true);
    expect(() => term.Evaluate()).toThrow();
  });

  test("Static evaluation", () => {
    term = new Formula("[DEX] + [PROF] - 5", rules);
    expect(term.HasStaticResult).toBe(true);
    expect(term.EvaluateStatic(stats)).toBe(3 + 2 - 5);
  });
});
