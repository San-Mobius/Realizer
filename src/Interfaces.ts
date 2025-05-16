// ------------------------
// Typescript Interfaces
// ------------------------

export type ArgValue = string | number | boolean | ArgGetVar | ArgSetVar;

export interface NamedActionPlan extends ActionPlan {
  name: string; // unique function name like "fileUploader", "submitForm"
}

export interface ArgGetVar {
  getVar: string;
}

export interface ArgSetVar {
  setVar: string;
  value: ArgValue;
}

export type ActionArg = ArgValue | Record<string, any>;

export interface BaseAction {
  type: string;
  op: string;
  condition?: LogicCondition;
  resultVar?: string;
  next?: Action | Action[];
}

export interface MathAction extends BaseAction {
  type: "math";
  op: "add" | "subtract" | "multiply" | "divide";
  args: [ArgValue, ArgValue];
  resultVar: string;
}

export interface LogicCondition {
  op: "==" | "!=" | ">" | "<" | ">=" | "<=";
  args: [ArgValue, ArgValue];
}

export interface LogicAction extends BaseAction {
  type: "logic";
  op: "if";
  condition: LogicCondition;
  then: Action[];
  else?: Action[];
}

export interface DOMAction extends BaseAction {
  type: "action";
  op: "setStyle";
  args: [string, Record<string, any>]; // selector, styles
}

export interface UtilityAction extends BaseAction {
  type: "utility";
  op: "log";
  args: ArgValue[];
}

export type Action = MathAction | LogicAction | DOMAction | UtilityAction;

export interface ActionPlan {
  version: number;
  scope?: "global" | "component";
  actions: Action[];
  debug?: boolean;
}
