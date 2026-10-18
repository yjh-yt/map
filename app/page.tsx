'use client'
import { useEffect, useRef, useState } from 'react'

type Msg = { id: number; role: string; content: string; createTime: string }

export default function Home() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState('')
  const [list, setList] = useState<Msg[]>([])
  const [mapErr, setMapErr] = useState('')

  const load = async () => {
    const res = await fetch('/api/chat')
    setList(await res.json())
  }
  useEffect(() => { load() }, [])

  // 高德 JS API（使用申请的 key + 安全密钥）
  useEffect(() => {
    // @ts-ignore
    window._AMapSecurityConfig = { securityJsCode: '4c2f9723fabf52f2807c1d0b9378e2a5' }
    const init = () => {
      // @ts-ignore
      if (window.AMap && mapRef.current) {
        // @ts-ignore
        new window.AMap.Map(mapRef.current, { zoom: 12, center: [121.47, 31.23] })
      } else {
        setMapErr('AMap 未加载：请到高德控制台把 localhost 加入 Web端 key 的安全域名白名单')
      }
    }
    const s = document.createElement('script')
    s.src = 'https://webapi.amap.com/maps?v=2.0&key=70852f4698e9923cbf3a7779dbf0513b'
    s.onerror = () => setMapErr('高德脚本加载失败，检查 key 是否正确')
    s.onload = init
    document.body.appendChild(s)
  }, [])

  const send = async () => {
    if (!input.trim()) return
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: input }),
    })
    setInput('')
    load()
  }

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: 32, marginBottom: 16 }}>对话机器人</h1>

      {/* 高德地图（标题下、输入框上） */}
      <div style={{ marginBottom: 24 }}>
        {mapErr && <p style={{ color: 'red', fontSize: 13, marginBottom: 8 }}>{mapErr}</p>}
        <div ref={mapRef} style={{ width: '100%', height: 320, border: '1px solid #ccc', borderRadius: 8 }}></div>
      </div>

      {/* 输入框 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="输入消息..."
          style={{ flex: 1, padding: 8, border: '1px solid #ccc' }}
        />
        <button onClick={send} style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 4 }}>发送</button>
      </div>

      {/* 聊天记录 */}
      <h2 style={{ fontSize: 20, marginBottom: 8 }}>聊天记录</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {list.map((m) => (
          <div key={m.id} style={{ border: '1px solid #ccc', padding: 8, borderRadius: 4, fontSize: 14 }}>
            {m.role === 'user' ? '我：' : 'AI：'}{m.content}
            <span style={{ color: '#999', fontSize: 12, float: 'right' }}>{m.createTime}</span>
          </div>
        ))}
      </div>
    </main>
  )
}
