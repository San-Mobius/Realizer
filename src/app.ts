// ------------------------
// Example Usage
// ------------------------

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from 'url';
import { NamedProgram } from "./Interfaces.js";
import { realizeToJavaScript } from './Realizer.js'; // ✅ required in ESM

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const plans: NamedProgram[] = [
  {
    name: "func1",
    "program": [
      {
        "op": "const",
        "target": "a",
        "value": 10
      },
      {
        "op": "const",
        "target": "b",
        "value": 5
      },
      {
        "op": "add",
        "target": "sum",
        "args": ["a", "b"]
      },
      {
        "op": "log",
        "args": ["sum"]
      },
      {
        "op": "if",
        "condition": {
          "op": "gt",
          "args": ["sum", 10]
        },
        "then": [
          {
            "op": "set_style",
            "selector": "#box",
            "style": {
              "backgroundColor": "green"
            }
          },
          {
            "op": "log",
            "args": ["'sum is greater than 10'"]
          }
        ],
        "else": [
          {
            "op": "set_style",
            "selector": "#box",
            "style": {
              "backgroundColor": "red"
            }
          },
          {
            "op": "log",
            "args": ["'sum is less than or equal to 10'"]
          }
        ]
      },
      {
        "op": "return",
        "value": "sum"
      }
    ]
  },
  {
    "name": "funcWithLoop",
    "program": [
    {
      "op": "const",
      "target": "arr",
      "value": [1, 2, 3, 4, 5]
    },
    {
      "op": "const",
      "target": "sum",
      "value": 0
    },
    {
    "op": "loop",
    condition: {
        op: "eq",
        args: ["sum", 5]
    },
    "body": [
      {
        "op": "add",
        "target": "sum",
        "args": ["sum", "i"]
      },
      {
        "op": "log",
        "args": ["sum"]
      }
    ]
    },
    {
      "op": "log",
      "args": ["'Final sum is:'", "sum"]
    },
    {
      "op": "return",
      "value": "sum"
    }
    ]
  },
  {
  "name": "complexConditionExample",
  "program": [
    {
      "op": "const",
      "target": "a",
      "value": 10
    },
    {
      "op": "const",
      "target": "b",
      "value": 5
    },
    {
      "op": "if",
      "condition": {
        "op": "or",
        "args": [
          {
            "op": "and",
            "args": [
              {
                "op": "gt",
                "args": ["a", "b"]
              },
              {
                "op": "eq",
                "args": ["b", 5]
              }
            ]
          },
          {
            "op": "gt",
            "args": ["b", "a"]
          }
        ]
      },
      "then": [
        {
          "op": "log",
          "args": ["'Complex condition evaluated to true'"]
        }
      ],
      "else": [
        {
          "op": "log",
          "args": ["'Complex condition evaluated to false'"]
        }
      ]
    }
  ]
  }
]


console.log("Generating JS code from JSON plans...");
let js = realizeToJavaScript(plans);

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

