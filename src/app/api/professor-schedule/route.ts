import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.from("admin").upsert(body).select();

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

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.from("admin").update(body).eq("id", body.id).select();

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

    const { data, error } = await supabase.from("admin").delete().eq("id", body.id);

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
