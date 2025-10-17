import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const p = path.join(process.cwd(), "data", "categories.json");
  const raw = fs.readFileSync(p, "utf8");
  const obj = JSON.parse(raw);
  res.setHeader("Content-Type", "application/json");
  res.status(200).json(obj);
}
