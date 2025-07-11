export function generetaMock(value: any): any {
  if (value === null) return null;

  if (Array.isArray(value)) {
    if (value.length === 0) return [];
    return [generetaMock(value[0])];
  }

  function isDateString(value: any): boolean {
    return typeof value === "string" && !isNaN(Date.parse(value));
  }

  const type = typeof value;

  switch (type) {
    case "string":
      if (isDateString(value)) return "2025-01-01";
      return "example";
    case "number":
      return 0;
    case "boolean":
      return false;
    case "object":
      const res: any = {};
      for (const key in value) {
        res[key] = generetaMock(value[key]);
      }
      return res;

    default:
      return null;
  }
}
