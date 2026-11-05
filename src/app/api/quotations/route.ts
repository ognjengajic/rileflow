import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { QuotationItem } from "@/types/quotation";

type QuotationItemRow = {
  article_id: number | null;
  name: string;
  code: string;
  serial_number: string;
  unit: string;
  price: number | string;
  vat: number | string;
  quantity: number | string;
  sort_order: number;
};

type QuotationRow = {
  id: number;
  number: string;
  date: string;
  customer_name: string;
  customer_address: string;
  customer_tax_number: string;
  customer_phone: string;
  customer_email: string;
  total_without_vat: number | string;
  total_vat: number | string;
  total_with_vat: number | string;
  quotation_items: QuotationItemRow[];
};

function mapQuotation(row: QuotationRow) {
  return {
    id: Number(row.id),
    number: row.number,
    date: row.date,
    customer: {
      name: row.customer_name,
      address: row.customer_address,
      taxNumber: row.customer_tax_number,
      phone: row.customer_phone,
      email: row.customer_email,
    },
    items: [...(row.quotation_items ?? [])]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((item) => ({
        articleId: Number(item.article_id ?? 0),
        name: item.name,
        code: item.code,
        serialNumber: item.serial_number,
        unit: item.unit,
        price: Number(item.price),
        vat: Number(item.vat),
        quantity: Number(item.quantity),
      })),
    totalWithoutVat: Number(row.total_without_vat),
    totalVat: Number(row.total_vat),
    totalWithVat: Number(row.total_with_vat),
  };
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("quotations")
    .select("*, quotation_items(*)")
    .order("id", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Učitavanje predračuna nije uspjelo." },
      { status: 500 },
    );
  }

  return NextResponse.json(data.map(mapQuotation));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, ...quotation } = body;

    if (
      !quotation.number ||
      !quotation.date ||
      !quotation.customer?.name?.trim() ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: "Nedostaju obavezni podaci predračuna." },
        { status: 400 },
      );
    }

    const { data: savedQuotation, error: quotationError } = await supabaseAdmin
      .from("quotations")
      .insert({
        number: quotation.number,
        date: quotation.date,
        customer_name: quotation.customer.name,
        customer_address: quotation.customer.address ?? "",
        customer_tax_number: quotation.customer.taxNumber ?? "",
        customer_phone: quotation.customer.phone ?? "",
        customer_email: quotation.customer.email ?? "",
        total_without_vat: Number(quotation.totalWithoutVat) || 0,
        total_vat: Number(quotation.totalVat) || 0,
        total_with_vat: Number(quotation.totalWithVat) || 0,
      })
      .select()
      .single();

    if (quotationError || !savedQuotation) {
      return NextResponse.json(
        {
          error:
            quotationError?.code === "23505"
              ? "Predračun sa ovim brojem već postoji."
              : "Čuvanje predračuna nije uspjelo.",
        },
        { status: 500 },
      );
    }

    const itemRows = items.map((item: QuotationItem, index: number) => ({
      quotation_id: savedQuotation.id,
      article_id: item.articleId || null,
      name: item.name,
      code: item.code ?? "",
      serial_number: item.serialNumber ?? "",
      unit: item.unit ?? "",
      price: Number(item.price) || 0,
      vat: Number(item.vat) || 0,
      quantity: Number(item.quantity) || 0,
      sort_order: index,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("quotation_items")
      .insert(itemRows);

    if (itemsError) {
      await supabaseAdmin
        .from("quotations")
        .delete()
        .eq("id", savedQuotation.id);

      return NextResponse.json(
        { error: "Čuvanje stavki predračuna nije uspjelo." },
        { status: 500 },
      );
    }

    const { data: completeQuotation, error: fetchError } = await supabaseAdmin
      .from("quotations")
      .select("*, quotation_items(*)")
      .eq("id", savedQuotation.id)
      .single();

    if (fetchError || !completeQuotation) {
      return NextResponse.json(
        { error: "Predračun je sačuvan, ali učitavanje nije uspjelo." },
        { status: 500 },
      );
    }

    return NextResponse.json(mapQuotation(completeQuotation), {
      status: 201,
    });
  } catch {
    return NextResponse.json(
      { error: "Neispravni podaci predračuna." },
      { status: 400 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id || !Number.isFinite(Number(id))) {
      return NextResponse.json(
        { error: "Neispravan ID predračuna." },
        { status: 400 },
      );
    }

    const { error } = await supabaseAdmin
      .from("quotations")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: "Brisanje predračuna nije uspjelo." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Neispravan zahtjev." }, { status: 400 });
  }
}
