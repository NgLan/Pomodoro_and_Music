import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(projectRoot, "openapi/openapi.json");
const inputUrl =
  process.env.OPENAPI_INPUT ?? "http://localhost:3000/docs/openapi.json";

const response = await fetch(inputUrl);
if (!response.ok) {
  throw new Error(
    `Unable to download OpenAPI contract: ${response.status} ${response.statusText}`,
  );
}

const document = await response.json();
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(document, null, 2)}\n`, "utf8");

console.log(`OpenAPI contract saved to ${outputPath}`);
