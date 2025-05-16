// ------------------------
// Code Generator Function
// ------------------------

import { Action, ActionArg, NamedActionPlan } from "./Interfaces.js";

// --- Assuming all interfaces from previous answer are already defined ---

export function generateMultipleFunctionsFromJson(plans: NamedActionPlan[]): string {
  const indent = (level: number) => '  '.repeat(level);

  const resolveArg = (arg: ActionArg): string => {
    if (typeof arg === 'object') {
      if ('getVar' in arg) return `vars["${arg.getVar}"]`;
      if ('setVar' in arg) return `vars["${arg.setVar}"] = ${resolveArg(arg.value)}`;
      return JSON.stringify(arg);
    }
    return JSON.stringify(arg);
  };

  const convertAction = (action: Action, level: number = 1): string => {
    const i = indent(level);
    let code = '';

    switch (action.type) {
      case "math": {
        const opMap: Record<string, string> = {
          add: "+",
          subtract: "-",
          multiply: "*",
          divide: "/"
        };
        const left = resolveArg(action.args[0]);
        const right = resolveArg(action.args[1]);
        code += `${i}vars["${action.resultVar}"] = ${left} ${opMap[action.op]} ${right};\n`;
        break;
      }

      case "logic": {
        if (action.op === "if") {
          const cond = `${resolveArg(action.condition.args[0])} ${action.condition.op} ${resolveArg(action.condition.args[1])}`;
          code += `${i}if (${cond}) {\n`;
          for (const a of action.then) {
            code += convertAction(a, level + 1);
          }
          if (action.else) {
            code += `${i}} else {\n`;
            for (const a of action.else) {
              code += convertAction(a, level + 1);
            }
          }
          code += `${i}}\n`;
        }
        break;
      }

      case "action": {
        if (action.op === "setStyle") {
          const [selector, styles] = action.args;
          const styleSet = Object.entries(styles)
            .map(([key, value]) => `el.style.${key} = "${value}";`)
            .join(" ");
          code += `${i}{ const el = document.querySelector(${JSON.stringify(selector)}); if (el) { ${styleSet} } }\n`;
        }
        break;
      }

      case "utility": {
        if (action.op === "log") {
          const val = resolveArg(action.args[0]);
          code += `${i}console.log(${val});\n`;
        }
        break;
      }

      default:
        //@ts-ignore
        code += `${i}// Unknown action type: ${action.type}\n`;
    }

    return code;
  };

  const allFunctions = plans.map(plan => {
    const funcName = `execute${plan.name[0].toUpperCase()}${plan.name.slice(1)}`;
    const body = plan.actions.map(action => convertAction(action)).join('');
    return `
function ${funcName}(vars = {}) {
${body}
  return vars;
}
`.trim();
  });

  return allFunctions.join('\n\n');
}
