import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { OpenAIEmbeddings } from "@langchain/openai";

// CLI 실행용 Supabase 설정
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// OpenAI 임베딩 객체 생성
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

async function run() {
  // 1. 임베딩이 아직 없는 교수들 가져오기
  const { data: professors, error } = await supabase
    .from("professors")
    .select("*")
    .is("embedding", null); // embedding이 null인 경우만

  if (error) {
    console.error("Error fetching professors:", error);
    return;
  }

  if (!professors || professors.length === 0) {
    console.log("모든 교수 데이터가 이미 벡터화되었습니다.");
    return;
  }

  console.log(`${professors.length}명의 교수 데이터 벡터화 시작`);

  for (const prof of professors) {
    const textToEmbed = `${prof.field} ${prof.name} ${prof.position} ${prof.lab_location ?? ""} ${
      prof.phone ?? ""
    } ${prof.email}`;
    try {
      const [embedding] = await embeddings.embedDocuments([textToEmbed]);

      // 업데이트
      const { error: updateError } = await supabase
        .from("professors")
        .update({ embedding })
        .eq("id", prof.id);

      if (updateError) {
        console.error(`${prof.name} 업데이트 중 오류 발생:`, updateError.message);
      } else {
        console.log(`${prof.name} - 벡터 저장 완료`);
      }
    } catch (e) {
      console.error(`${prof.name} - 벡터화 실패`, e);
    }
  }

  console.log("모든 벡터화 작업 완료");
}

run();
