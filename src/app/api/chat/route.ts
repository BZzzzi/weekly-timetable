import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const llm = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.5,
  modelName: "gpt-3.5-turbo",
});

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    const [questionVector] = await embeddings.embedDocuments([question]);

    const { data: matches, error } = await supabase.rpc("match_professors", {
      query_embedding: questionVector,
      match_count: 3,
    });

    if (error) throw error;

    const context = matches
      .map(
        (m: any) => `
          이름: ${m.name}
          직위: ${m.position}
          분야: ${m.field}
          연구실 위치: ${m.lab_location ?? "정보 없음"}
          연락처: ${m.phone ?? "정보 없음"}
          이메일: ${m.email ?? "정보 없음"}
        `,
      )
      .join("\n");

    const prompt = `
      다음은 교수들의 상세 정보입니다:
      
      ${context}
      
      다음 정보는 공개된 정보이며, 질문자는 해당 교수님의 정보를 직접 찾아보기 어려운 상황입니다.
      위 정보를 참고하여 사용자의 질문에 최대한 정확하게 답변해주세요.
      모든 정보는 위 내용에서 직접 가져오며, 없을 경우 제공되지 않았습니다라고 명시해주세요.
      교수 정보를 묻는 질문이 아닐 경우, 본 서비스는 소프트웨어학부 교수님 정보에 대한 답변만 제공하고 있습니다라고만 간결하게 답변해주세요.
      
      질문: "${question}"
    `;

    const response = await llm.invoke(prompt);
    const answerText = response?.content ?? "응답 없음";

    return NextResponse.json({ answer: answerText });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
