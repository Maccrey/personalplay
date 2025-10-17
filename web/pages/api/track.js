let EVENTS = [];

export default function handler(req, res) {
  if (req.method === "POST") {
    const body = req.body || {};
    const ev = { ...body, ts: Date.now() };
    EVENTS.push(ev);
    // keep last 100 events
    if (EVENTS.length > 100) EVENTS.shift();
    return res.status(201).json({ ok: true, event: ev });
  }

  if (req.method === "GET") {
    return res.status(200).json({ events: EVENTS });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end("Method Not Allowed");
}
