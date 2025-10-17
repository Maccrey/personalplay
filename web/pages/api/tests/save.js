import { promises as fs } from "fs";
import path from "path";

const TEST_FILE = path.join(process.cwd(), "data", "test-contents.json");

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await fs.writeFile(TEST_FILE, JSON.stringify(req.body, null, 2));
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Failed to save tests:", error);
      res.status(500).json({ error: "저장 실패" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
