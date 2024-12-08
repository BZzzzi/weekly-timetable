import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const startDate = req.nextUrl.searchParams.get("startDate");
  const endDate = req.nextUrl.searchParams.get("endDate");

  if (!startDate || !endDate) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    // users 테이블 조회
    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .select()
      .gte("date", startDate)
      .lte("date", endDate);

    if (usersError) {
      console.error("Error fetching users data:", usersError);
      return NextResponse.json({ error: usersError.message }, { status: 400 });
    }

    // admin 테이블 조회
    const { data: adminData, error: adminError } = await supabase
      .from("admin")
      .select()
      .gte("date", startDate)
      .lte("date", endDate);

    if (adminError) {
      console.error("Error fetching admin data:", adminError);
      return NextResponse.json({ error: adminError.message }, { status: 400 });
    }

    // 두 데이터를 합치기
    const combinedData = [...(usersData || []), ...(adminData || [])];
    return NextResponse.json({ success: true, data: combinedData }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.from("users").upsert(body).select();

    if (error) {
      // 이메일
      return NextResponse.json({ message: error.message }, { status: 400 });
    } else {
      return NextResponse.json({ message: "success", data }, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.from("users").update(body).eq("id", body.id).select();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    } else {
      return NextResponse.json({ message: "success", data }, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.from("users").delete().eq("id", body.id);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    } else {
      return NextResponse.json({ message: "success", data }, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}
