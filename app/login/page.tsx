'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [pwd, setPwd] = useState('')
  const router = useRouter()

  const login = async () => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pwd }),
    })
    if (res.ok) router.push('/')
    else alert('密码错误')
  }

  return (
    <main style={{ padding: 40, maxWidth: 360, margin: '80px auto' }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>系统登录</h1>
      <p style={{ color: '#888', marginBottom: 16 }}>默认密码：admin123</p>
      <input
        type="password"
        value={pwd}
        onChange={(e) => setPwd(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && login()}
        placeholder="请输入密码"
        style={{ width: '100%', padding: 8, marginBottom: 16, border: '1px solid #ccc' }}
      />
      <button onClick={login} style={{ width: '100%', padding: 8, background: '#3b82f6', color: '#fff', border: 'none' }}>登录</button>
    </main>
  )
}
