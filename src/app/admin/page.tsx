"use client";

import TimetableControl from "@/components/TimetableControl";
import { useEffect, useState } from "react";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const auth = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(auth);
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    const adminPassword = "1234"; // 관리자 비밀번호
    if (password === adminPassword) {
      localStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);
    } else {
      alert("비밀번호가 일치하지 않습니다. 다시 시도해주세요.");
      setPassword("");
    }
  };

  // 로딩 중일 때는 빈 화면 또는 로딩 스피너 표시
  if (isLoading) {
    return <div className="w-full h-screen flex justify-center items-center">로딩 중...</div>;
  }

  return (
    <>
      {isLoggedIn ? (
        <TimetableControl isAdmin />
      ) : (
        <div className="w-full flex justify-center items-center flex-col p-10">
          <h1 className="font-bold text-lg mb-4">관리자 인증</h1>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md w-96">
            <label htmlFor="password" className="block text-center mb-4 font-medium">
              비밀번호 입력
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyUp={(e) => e.code === "Enter" && handleLogin()}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="****"
            />
            <button
              onClick={handleLogin}
              className="w-full mt-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}
