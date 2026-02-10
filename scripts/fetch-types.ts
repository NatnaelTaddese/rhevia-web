import fs from "fs/promises";
import path from "path";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL as string;
const dtsPath = "/server.d.ts";
const outputDir = "types/server.d.ts";

async function fetchTypes() {
  try {
    const response = await fetch(`${backendUrl}${dtsPath}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch types: ${response.status}`);
    }
    const typesContent = await response.text();
    const fixed = typesContent + "\n\nexport {};\n";
    // Write to file
    const outputPath = path.join(process.cwd(), outputDir);
    await fs.writeFile(outputPath, fixed, "utf-8");
    console.log(`Types fetched and saved to ${outputPath}`);
  } catch (error) {
    console.error("Error fetching types:", error);
    process.exit(1);
  }
}

fetchTypes();
