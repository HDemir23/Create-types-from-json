import * as fs from "fs";
import { generetaMock } from "./generateMockDatafromType";

type InputScheme = {
  name: string;
  age: number;
  date: Date;
  isActive: boolean;
};

function isDateString(value: any): boolean {
  return typeof value === "string" && !isNaN(Date.parse(value));
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function generetaForm<T>(scheme: T): string {
  const fields: string[] = [];

  for (const key in scheme) {
    const value = scheme[key];
    const type = typeof value;

    if (value instanceof Date || isDateString(value)) {
      fields.push(
        `<View style={{ marginBottom: 10 }}>
  <Text>${key}</Text>
  <TextInput placeholder="${key}" value={${key}} onChangeText={set${capitalize(
          key
        )}} />
</View>`
      );
    } else if (type === "string") {
      fields.push(
        `<View style={{ marginBottom: 10 }}>
  <Text>${key}</Text>
  <TextInput placeholder="${key}" value={${key}} onChangeText={set${capitalize(
          key
        )}} />
</View>`
      );
    } else if (type === "number") {
      fields.push(
        `<View style={{ marginBottom: 10 }}>
  <Text>${key}</Text>
  <TextInput placeholder="${key}" keyboardType="numeric" value={String(${key})} onChangeText={(val) => set${capitalize(
          key
        )}(Number(val))} />
</View>`
      );
    } else if (type === "boolean") {
      fields.push(
        `<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
  <Text>${key}</Text>
  <Switch value={${key}} onValueChange={set${capitalize(key)}} />
</View>`
      );
    }
  }

  return fields.join("\n\n");
}

// ✅ Burada önce mock data üretiyoruz:
const mockInput = generetaMock({
  name: "",
  age: 0,
  date: new Date(),
  isActive: false,
});

// ✅ mock veriyi kullanarak JSX üretiyoruz:
const form = generetaForm(mockInput);

// JSX'i dosyaya yaz (örnek: form.tsx içine)
const outputPath = "./generatedForm.tsx";
fs.writeFileSync(outputPath, form, "utf-8");

console.log("✅ JSX form generated to:", outputPath);
