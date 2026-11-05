import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function mapArticle(article: {
  id: number;
  name: string;
  code: string;
  serial_number: string;
  unit: string;
  price: number;
  vat: number;
}) {
  return {
    id: Number(article.id),
    name: article.name,
    code: article.code,
    serialNumber: article.serial_number,
    unit: article.unit,
    price: Number(article.price),
    vat: Number(article.vat),
  };
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("articles")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data.map(mapArticle));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const articles = Array.isArray(body) ? body : [body];

    const rows = articles.map((article) => ({
      name: article.name,
      code: article.code ?? "",
      serial_number: article.serialNumber ?? "",
      unit: article.unit ?? "",
      price: Number(article.price) || 0,
      vat: Number(article.vat) || 0,
    }));

    if (rows.length === 0) {
      return NextResponse.json([]);
    }

    const { data, error } = await supabaseAdmin
      .from("articles")
      .insert(rows)
      .select("*");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data.map(mapArticle), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Neispravni podaci." }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from("articles")
      .update({
        name: body.name,
        code: body.code ?? "",
        serial_number: body.serialNumber ?? "",
        unit: body.unit ?? "",
        price: Number(body.price) || 0,
        vat: Number(body.vat) || 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", body.id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(mapArticle(data));
  } catch {
    return NextResponse.json({ error: "Neispravni podaci." }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    const { error } = await supabaseAdmin
      .from("articles")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Neispravni podaci." }, { status: 400 });
  }
}
