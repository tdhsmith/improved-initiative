import { AbilityScores, StatBlock } from "../../../common/StatBlock";
import { IRules } from "../Rules";

export interface FormulaTerm {
  HasStaticResult: boolean;
  RequiresStats: boolean;
  Evaluate: (stats?: StatBlock) => FormulaResult;
  EvaluateStatic: (stats?: StatBlock) => FormulaResult;
  FormulaString: () => string;
  Annotated: (stats?: StatBlock) => string;
}

export interface FormulaResult {
  Total: number;
  String: string;
  FormattedString: string;
}

export interface FormulaClass {
  Pattern: RegExp;
  TestPattern: RegExp;
  new (text: string, rules?: IRules): FormulaTerm;
}