// ------------------------
// Example Usage
// ------------------------

import { NamedActionPlan } from "./Interfaces.js";
import { generateMultipleFunctionsFromJson } from "./Realizer.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const plans: NamedActionPlan[] = [
  {
    name: "addNumbers",
    version: 1,
    actions: [
      {
        type: "math",
        op: "add",
        args: [2, 3],
        resultVar: "total"
      },
      {
        type: "math",
        op: "add",
        args: ["#total", 10],
        resultVar: "total"
      },
      {
        type: "utility",
        op: "log",
        args: [{ getVar: "total" }]
      }
    ]
  },
  {
    name: "boxColorToggle",
    version: 1,
    actions: [
      {
        type: "logic",
        op: "if",
        condition: {
          op: "==",
          args: [1, 1]
        },
        then: [
          {
            type: "action",
            op: "setStyle",
            args: ["#box", { backgroundColor: "green" }]
          }
        ]
      }
    ]
  }
];

console.log("Generating JS code from JSON plans...");
let js = generateMultipleFunctionsFromJson(plans);

function writeJsToFile(jsCode: string, filename: string = "build.js") {
  const outputDir = path.join(__dirname, "..", "output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const filePath = path.join(outputDir, filename);
  fs.writeFileSync(filePath, jsCode, "utf8");
  console.log(`JS code written to ${filePath}`);
}

writeJsToFile(js);

