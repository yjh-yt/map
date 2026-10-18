"use client";
import { useState, useEffect } from "react";

type MsgItem = {
  id: number;
  role: "user" | "ai";
  content: string;
};

export default function ChatPage() {
  const [msgList, setMsgList] = useState<MsgItem[]>([]);
  const [input, setInput] = useState("");

  // 页面加载读取历史消息
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/chat");
      const data = await res.json();
      setMsgList(data.messages || []);
    })();
  }, []);

  async function sendMessage() {
    if (!input.trim()) return;
    const content = input;
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    const data = await res.json();
    setMsgList(data.messages);
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex gap-4 mb-6">
          <a href="/chat" className="text-emerald-400">聊天页</a>
          <a href="/map" className="text-slate-300 hover:text-white">地图页</a>
        </div>
        <h1 className="text-2xl mb-4">AI聊天（数据存入SQLite持久化）</h1>

        <div className="border border-slate-700 rounded p-4 h-96 overflow-y-auto mb-4">
          {msgList.map((item) => (
            <div key={item.id} className={`mb-3 ${item.role === "user" ? "text-blue-300" : "text-amber-200"}`}>
              <p><b>{item.role === "user" ? "你" : "AI"}：</b>{item.content}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 px-3 py-2 rounded bg-slate-800 border border-slate-700"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入消息"
          />
          <button onClick={sendMessage} className="bg-emerald-600 px-4 py-2 rounded">发送</button>
        </div>
      </div>
    </main>
  );
}
