let EVENTS = [];

export default function handler(req, res) {
  if (req.method === "POST") {
    const body = req.body || {};
    const ev = { ...body, ts: Date.now() };
    EVENTS.push(ev);
    // keep last 500 events (increased from 100)
    if (EVENTS.length > 500) EVENTS.shift();
    return res.status(201).json({ ok: true, event: ev });
  }

  if (req.method === "GET") {
    const { event_type, test_id, limit } = req.query;

    let filtered = EVENTS;

    // Filter by event type
    if (event_type) {
      filtered = filtered.filter((e) => e.event === event_type);
    }

    // Filter by test_id
    if (test_id) {
      filtered = filtered.filter((e) => e.test_id === test_id);
    }

    // Limit results
    const limitNum = limit ? parseInt(limit, 10) : filtered.length;
    const limited = filtered.slice(-limitNum);

    // Calculate basic stats
    const stats = {
      total_events: filtered.length,
      event_types: {},
      tests: {},
    };

    filtered.forEach((e) => {
      if (e.event) {
        stats.event_types[e.event] = (stats.event_types[e.event] || 0) + 1;
      }
      if (e.test_id) {
        stats.tests[e.test_id] = (stats.tests[e.test_id] || 0) + 1;
      }
    });

    return res.status(200).json({
      events: limited,
      stats,
      total: filtered.length,
    });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end("Method Not Allowed");
}
