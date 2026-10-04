import fs from "fs";
import path from "path";

function ReadData() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error(
      "❌ Please provide a JSON file path.\nUsage: ts-node json-to-types.ts ./data.json"
    );
    process.exit(1);
  }

  try {
    const rawData = fs.readFileSync(inputPath, "utf-8");
    const json = JSON.parse(rawData);

    for (const key in json) {
      const data = json[key];

      console.log(`\n🔑 Key: ${key}`);
      console.log(`🔎 Type: ${detectType(data)}`);
      console.log(`📦 Value Preview:`, preview(data));

      if (Array.isArray(data) && data.length > 0) {
        console.log(detectType(data[0]));
      }
    }
  } catch (error) {
    console.log(error);
  }
}

ReadData();

function detectType(value: any): any {
  if (value === null) return null;
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function preview(value: any): any {
  if (typeof value === "object") {
    if (Array.isArray(value)) {
      return `[Array with ${value.length} items]`;
    }
    return "{Object}";
  }
  return value;
}
