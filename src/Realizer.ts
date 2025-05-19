// ------------------------
// Code Generator Function
// ------------------------

// --- Assuming all interfaces from previous answer are already defined ---

// realizer.js

// realizer.ts

import { Instruction, Program } from "./Interfaces.js";

export function realizeToJavaScript(program: Program): string {
  const out: string[] = [];
  out.push("async function handler(vars = {}) {");

  const emit = (line: string, indent = 1) => {
    out.push("  ".repeat(indent) + line);
  };

  const renderArg = (arg: string | number | boolean): string => {
    if (typeof arg === "string") return `vars["${arg}"]`;
    return JSON.stringify(arg);
  };

  const compile = (instructions: Instruction[], indent = 1) => {
     const opMap: Record<string, string> = {
      add: "+",
      sub: "-",
      mul: "*",
      div: "/",
      eq: "==",
      neq: "!=",
      gt: ">",
      lt: "<",
      gte: ">=",
      lte: "<="
    };
    for (const instr of instructions) {
      switch (instr.op) {
        case "const":
          emit(`vars["${instr.target}"] = ${JSON.stringify(instr.value)};`, indent);
          break;

        case "copy":
          emit(`vars["${instr.target}"] = vars["${instr.source}"];`, indent);
          break;

        case "add":
        case "sub":
        case "mul":
        case "div":
        case "eq":
        case "neq":
        case "gt":
        case "lt":
        case "gte":
        case "lte": {
          const [a1, a2] = instr.args;
          emit(`vars["${instr.target}"] = ${renderArg(a1)} ${opMap[instr.op]} ${renderArg(a2)};`, indent);
          break;
        }

        case "log":
          emit(`console.log(${instr.args.map(renderArg).join(", ")});`, indent);
          break;

        case "set_style": {
          const entries = Object.entries(instr.style);
          for (const [prop, val] of entries) {
            emit(`document.querySelector("${instr.selector}")?.style.setProperty("${prop}", "${val}");`, indent);
          }
          break;
        }

        case "fetch":
          emit(`vars["${instr.target}"] = await fetch("${instr.url}", ${JSON.stringify(instr.options || {})});`, indent);
          break;

        case "if":
          emit(
            `if (${renderArg(instr.condition.args[0])} ${opMap[instr.condition.op]} ${renderArg(instr.condition.args[1])}) {`,
            indent
          );
          compile(instr.then, indent + 1);
          if (instr.else) {
            emit(`} else {`, indent);
            compile(instr.else, indent + 1);
          }
          emit(`}`, indent);
          break;

        case "loop":
          emit(
            `while (${renderArg(instr.condition.args[0])} ${opMap[instr.condition.op]} ${renderArg(instr.condition.args[1])}) {`,
            indent
          );
          compile(instr.body, indent + 1);
          emit(`}`, indent);
          break;

        case "return":
          emit(`return ${renderArg(instr.value)};`, indent);
          break;

        default:
          emit(`// unknown instruction: ${JSON.stringify(instr)}`, indent);
      }
    }
  };

  compile(program.program);
  out.push("}");

  return out.join("\n");
}

