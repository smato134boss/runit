"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  profiles: { full_name: string } | null;
}

export default function Chat({
  taskId,
  currentUserId,
}: {
  taskId: string;
  currentUserId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("messages")
      .select("*, profiles(full_name)")
      .eq("task_id", taskId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) setMessages(data as Message[]);
      });

    const channel = supabase
      .channel(`task-chat-${taskId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `task_id=eq.${taskId}`,
        },
        async (payload) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", payload.new.sender_id)
            .single();

          setMessages((prev) => [
            ...prev,
            { ...payload.new, profiles: profile } as Message,
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setInput("");
    await supabase
      .from("messages")
      .insert({ task_id: taskId, sender_id: currentUserId, content: text });
    setSending(false);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: 520,
        backgroundColor: "white",
        borderRadius: 20,
        border: "1px solid #E7E5E4",
        overflow: "hidden",
        position: "sticky",
        top: 80,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #F5F4F2",
          backgroundColor: "#FAFAF8",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 16 }}>💬</span>
        <p
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#1C1917",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            margin: 0,
          }}
        >
          Chat
        </p>
        <span
          style={{
            marginLeft: "auto",
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "#22C55E",
            boxShadow: "0 0 0 2px #F0FDF4",
          }}
        />
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#A8A29E",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 32 }}>👋</span>
            <p style={{ fontSize: 14, margin: 0 }}>No messages yet — say hi!</p>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUserId;
          return (
            <div
              key={msg.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isMe ? "flex-end" : "flex-start",
                gap: 3,
              }}
            >
              <p style={{ fontSize: 11, color: "#A8A29E", fontWeight: 500, margin: 0 }}>
                {isMe ? "You" : (msg.profiles?.full_name ?? "Runner")}
              </p>
              <div
                style={{
                  backgroundColor: isMe ? "#F97316" : "#F5F4F2",
                  color: isMe ? "white" : "#1C1917",
                  padding: "10px 14px",
                  borderRadius: isMe
                    ? "16px 16px 4px 16px"
                    : "16px 16px 16px 4px",
                  maxWidth: "82%",
                  fontSize: 14,
                  lineHeight: 1.5,
                  wordBreak: "break-word",
                }}
              >
                {msg.content}
              </div>
              <p style={{ fontSize: 10, color: "#D6D3D1", margin: 0 }}>
                {new Date(msg.created_at).toLocaleTimeString("en-CA", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid #F5F4F2",
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Type a message..."
          style={{
            flex: 1,
            border: "1px solid #E7E5E4",
            borderRadius: 999,
            padding: "10px 16px",
            fontSize: 14,
            outline: "none",
            backgroundColor: "#FAFAF8",
            color: "#1C1917",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#F97316")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#E7E5E4")}
        />
        <button
          onClick={send}
          disabled={!input.trim() || sending}
          style={{
            backgroundColor: input.trim() && !sending ? "#F97316" : "#E7E5E4",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: 42,
            height: 42,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: input.trim() && !sending ? "pointer" : "default",
            transition: "background-color 0.2s",
            flexShrink: 0,
            fontSize: 18,
            fontWeight: 700,
          }}
        >
          ↑
        </button>
      </div>
    </div>
  );
}
