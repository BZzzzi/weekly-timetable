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
      .map((m: any) => `${m.name} (${m.position}) - ${m.field} / ${m.lab_location ?? ""}`)
      .join("\n");

    const prompt = `
다음은 교수 정보입니다:

${context}

이 정보를 참고해서 다음 질문에 답변해주세요:

"${question}"
`;

    const response = await llm.invoke(prompt);
    const answerText = response?.content ?? "응답 없음";

    return NextResponse.json({ answer: answerText });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
