import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const type = formData.get("type") as string | null;

  if (!file) {
    return NextResponse.json(
      { success: false, message: "No se proporcionó archivo" },
      { status: 400 }
    );
  }

  const backendFormData = new FormData();
  backendFormData.append("file", file);

  const endpoint =
    type === "stock"
      ? `${env.NEXT_PUBLIC_API_URL}/api/v1/stock/import/excel`
      : `${env.NEXT_PUBLIC_API_URL}/api/v1/upload/excel`;

  const res = await fetch(endpoint, {
    method: "POST",
    body: backendFormData,
  });

  const data = await res.json().catch(() => ({
    success: false,
    message: res.statusText,
  }));

  return NextResponse.json(data, { status: res.status });
}
