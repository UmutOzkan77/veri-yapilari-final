import { NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "DeepSeek API anahtarı tanımlı değil. Vercel'de DEEPSEEK_API_KEY env değişkenini ekleyince AI öğretmen aktif olur.",
      },
      { status: 200 },
    );
  }

  const body = (await request.json()) as {
    lesson?: string;
    prompt?: string;
    messages?: ChatMessage[];
  };

  const lesson = body.lesson ?? "Veri Yapıları";
  const prompt = body.prompt?.trim();

  if (!prompt) {
    return NextResponse.json({ error: "Boş soru gönderildi." }, { status: 400 });
  }

  const messages = [
    {
      role: "system",
      content:
        "Sen BANÜ Veri Yapıları finaline hazırlanan, C# ve veri yapıları bilmeyen bir öğrenciye ders anlatan Türkçe bir öğretmensin. Teknik terimi önce günlük hayat benzetmesiyle anlat, sonra sınav diliyle bağla. Cevabı ezberletme; 1 küçük kontrol sorusu sor. Kısa, net, motive edici ama abartısız konuş.",
    },
    {
      role: "user",
      content: `Aktif ders: ${lesson}. Öğrencinin sorusu: ${prompt}`,
    },
    ...(body.messages ?? []).slice(-4).map((message) => ({
      role: message.role,
      content: message.content,
    })),
  ];

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL ?? "deepseek-chat",
        temperature: 0.35,
        messages,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `DeepSeek yanıt vermedi (${response.status}). Anahtar veya kota kontrol edilmeli.`,
        },
        { status: 200 },
      );
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const answer = data.choices?.[0]?.message?.content;

    return NextResponse.json({
      answer:
        answer ??
        "Cevap üretilemedi. İstersen sorunu daha kısa yaz: örneğin 'Stack ve Queue farkı ne?'",
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "DeepSeek bağlantısı kurulamadı. İnternet, API anahtarı veya endpoint daha sonra tekrar kontrol edilmeli.",
      },
      { status: 200 },
    );
  }
}
