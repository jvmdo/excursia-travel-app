import { createClient } from "npm:@supabase/supabase-js@2.29.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

Deno.serve(async (req: Request) => {
  try {
    const payload = await req.json().catch(() => null);
    console.log("Received payload:", JSON.stringify(payload));

    if (!payload || typeof payload !== "object") {
      return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const customer = (payload as any).customer;
    if (!customer || typeof customer !== "object") {
      return new Response(JSON.stringify({ error: "Missing customer field" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { name, lastname, document, email, phone, cell } = customer;
    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ error: "Customer email is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const upsertPayload = {
      name: name ?? null,
      lastname: lastname ?? null,
      document: document ?? null,
      email,
      phone: phone ?? null,
      cell: cell ?? null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("customers")
      .upsert(upsertPayload, { onConflict: "email" })
      .select()
      .single();

    if (error) {
      console.error("Upsert error:", error);
      return new Response(
        JSON.stringify({ error: "Database upsert failed", details: error }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify({ success: true, customer: data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Handler error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
