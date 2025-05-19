// types.ts

export type Arg = string | number | boolean | Array<Arg>;

export interface ConstInstruction {
  op: "const";
  target: string;
  value: Arg;
}

export interface CopyInstruction {
  op: "copy";
  source: string;
  target: string;
}

export interface BinaryOpInstruction {
  op: "add" | "sub" | "mul" | "div" | "eq" | "neq" | "gt" | "lt" | "gte" | "lte";
  target: string;
  args: [Arg, Arg];
}

export interface LogInstruction {
  op: "log";
  args: Arg[];
}

export interface SetStyleInstruction {
  op: "set_style";
  selector: string;
  style: Record<string, string>;
}

export interface FetchInstruction {
  op: "fetch";
  url: string;
  target: string;
  options?: Record<string, any>;
}

export interface IfInstruction {
  op: "if";
  condition: {
    op: "eq" | "neq" | "gt" | "lt" | "gte" | "lte";
    args: [Arg, Arg];
  };
  then: Instruction[];
  else?: Instruction[];
}

export interface LoopInstruction {
  op: "loop";
  condition: {
    op: "eq" | "neq" | "gt" | "lt" | "gte" | "lte";
    args: [Arg, Arg];
  };
  body: Instruction[];
}

export interface ReturnInstruction {
  op: "return";
  value: Arg;
}

export interface NamedProgram {
  name: string;
  program: Instruction[];
}

export type Instruction =
  | ConstInstruction
  | CopyInstruction
  | BinaryOpInstruction
  | LogInstruction
  | SetStyleInstruction
  | FetchInstruction
  | IfInstruction
  | LoopInstruction
  | ReturnInstruction;
