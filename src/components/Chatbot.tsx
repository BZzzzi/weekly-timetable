"use client";

import { useState } from "react";

const Chatbot = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAnswer(data.answer);
    } catch (error) {
      setAnswer("오류가 발생했어요. 다시 시도해주세요!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>교수 정보 챗봇</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="질문을 입력하세요 (예: 김동회의 연구 분야는?)"
          style={{ width: "300px", padding: "8px", marginRight: "10px" }}
        />
        <button type="submit" disabled={loading}>
          {loading ? "처리 중..." : "질문하기"}
        </button>
      </form>
      {answer && (
        <div style={{ marginTop: "20px" }}>
          <h3>답변:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
