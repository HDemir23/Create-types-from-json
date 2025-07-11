// json-to-types.ts
// CLI tool that reads a JSON file, infers its structure, and generates TypeScript types

import * as fs from "fs";
import * as path from "path";

// Define a valid JSON value
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

// Type map to store all generated types
export type TypeMap = { [name: string]: string };

/**
 * Merges a list of objects into a single object with all possible keys.
 * Useful for inferring the full shape of an array of objects.
 */
function mergeObjects(
  array: Record<string, JsonValue>[]
): Record<string, JsonValue> {
  const merged: Record<string, JsonValue> = {};
  for (const obj of array) {
    for (const key in obj) {
      if (!(key in merged)) {
        merged[key] = obj[key];
      }
    }
  }
  return merged;
}

/**
 * Recursively infers the TypeScript type of a given value.
 * It also registers nested object types into the type map.
 */
function inferType(
  value: JsonValue,
  typeMap: TypeMap,
  parentName = "Nested"
): string {
  if (value === null) return "any";
  if (Array.isArray(value)) {
    if (value.length === 0) return "any[]";
    return `${inferType(value[0], typeMap, parentName)}[]`;
  }

  const type = typeof value;
  if (type === "string") return "string";
  if (type === "number") return "number";
  if (type === "boolean") return "boolean";

  if (type === "object") {
    const nestedName = `${parentName}Inner${Object.keys(typeMap).length}`;
    const obj = value as Record<string, JsonValue>;
    const fields = Object.entries(obj)
      .map(([key, val]) => `  ${key}: ${inferType(val, typeMap, nestedName)};`)
      .join("\n");
    typeMap[nestedName] = `type ${nestedName} = {\n${fields}\n};`;
    return nestedName;
  }

  return "any";
}

/**
 * Generates a top-level TypeScript type from a flat object
 */
function generateType(
  name: string,
  obj: Record<string, JsonValue>,
  typeMap: TypeMap
): string {
  const fields = Object.entries(obj)
    .map(([key, val]) => `  ${key}: ${inferType(val, typeMap, name)};`)
    .join("\n");
  return `type ${name} = {\n${fields}\n};`;
}

/**
 * Entry point: Reads input JSON file and writes generated types to .d.ts file
 */
function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error(
      "❌ Please provide a JSON file path.\nUsage: ts-node json-to-types.ts ./data.json"
    );
    process.exit(1);
  }

  const raw = fs.readFileSync(path.resolve(inputPath), "utf-8");
  const json = JSON.parse(raw);

  const typeMap: TypeMap = {};
  const rootFields: string[] = [];

  for (const key in json) {
    const value = json[key];
    if (
      Array.isArray(value) &&
      value.length > 0 &&
      typeof value[0] === "object"
    ) {
      const merged = mergeObjects(value as Record<string, JsonValue>[]);
      const typeName =
        key.slice(0, -1).charAt(0).toUpperCase() + key.slice(1, -1); // "users" → "User"
      typeMap[typeName] = generateType(typeName, merged, typeMap);
      rootFields.push(`  ${key}: ${typeName}[];`);
    } else {
      rootFields.push(`  ${key}: ${inferType(value, typeMap)};`);
    }
  }

  const rootType = `type Root = {\n${rootFields.join("\n")}\n};\n`;
  const allTypes = [rootType, ...Object.values(typeMap)].join("\n\n");

  fs.writeFileSync("types.generated.d.ts", allTypes, "utf-8");
  console.log("✅ TypeScript types written to 'types.generated.d.ts'");
}

main();
