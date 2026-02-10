import fs from "node:fs/promises";

async function cleanUpFiles(...paths) {
  for (const path of paths) {
    if (!path) continue;
    try {
      await fs.rm(path, { recursive: true, force: true });
    } catch (err) {
      console.error("Cleanup failed for:", path);
      console.error(err.message);
    }
  }
}

export default cleanUpFiles;
