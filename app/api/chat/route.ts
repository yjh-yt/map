import Database from 'better-sqlite3'
const db = new Database(process.cwd() + '/chat.db')
db.exec(`CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role TEXT,
  content TEXT,
  createTime DATETIME DEFAULT (datetime('now','localtime'))
)`)

export async function GET() {
  const rows = db.prepare('SELECT * FROM messages ORDER BY id ASC').all()
  return Response.json(rows)
}

export async function POST(req: Request) {
  const { content } = await req.json()

  const r = await fetch(`${process.env.ANTHROPIC_BASE_URL}/v1/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.ANTHROPIC_AUTH_TOKEN}`,
      'x-api-key': process.env.ANTHROPIC_AUTH_TOKEN!,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL,
      max_tokens: 1024,
      messages: [{ role: 'user', content }],
    }),
  })
  const data = await r.json()
  const block = data.content?.find((b: any) => b.type === 'text')
  const reply = block?.text || JSON.stringify(data)

  db.prepare('INSERT INTO messages(role, content) VALUES (?,?)').run('user', content)
  db.prepare('INSERT INTO messages(role, content) VALUES (?,?)').run('ai', reply)
  return Response.json({ reply })
}
