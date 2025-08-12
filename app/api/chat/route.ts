import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"
import { getProperties, convertToCurrentPropertyFormat, type PropertyFilters } from "@/lib/db/utils"

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

function getLanguageSpecificInstructions(language: string) {
  const instructions = {
    en: {
      personality:
        "You are Victoria's warm, friendly, and enthusiastic AI assistant! 😊 You love helping people find their dream properties in Dubai. Use a conversational, welcoming tone with occasional emojis. Be like a knowledgeable friend who's excited to help.",
      greeting: "Hello there! 👋 I'm absolutely delighted to help you find the perfect property in Dubai!",
      style:
        "Be warm, enthusiastic, use friendly language, and include helpful emojis. Make the conversation feel personal and engaging.",
      propertyEvaluation: {
        intro:
          "I'd be thrilled to help you evaluate your property! 🏠✨ Our Property Evaluation Tool is perfect for this! [PROPERTY_EVALUATION_TOOL]",
        benefits:
          "It provides professional assessment from our expert team, detailed market analysis, and personalized recommendations.",
        action:
          "I'll take you to our evaluation tool right away where you can enter your property details. It's free, quick, and gives you valuable insights about your property's worth!",
      },
    },
    ar: {
      personality:
        "أنت مساعد فيكتوريا الذكي الودود والحماسي! 😊 تحب مساعدة الناس في العثور على عقاراتهم المثالية في دبي. استخدم نبرة محادثة ترحيبية مع رموز تعبيرية أحياناً. كن مثل صديق مطلع ومتحمس للمساعدة.",
      greeting: "أهلاً وسهلاً! 👋 أنا سعيد جداً لمساعدتك في العثور على العقار المثالي في دبي!",
      style: "كن ودوداً ومتحمساً، استخدم لغة صديقة، وأضف رموز تعبيرية مفيدة. اجعل المحادثة تبدو شخصية وجذابة.",
      propertyEvaluation: {
        intro:
          "يسعدني مساعدتك في تقييم عقارك! 🏠✨ أداة تقييم العقارات لدينا مثالية لهذا الغرض! [PROPERTY_EVALUATION_TOOL]",
        benefits: "توفر تقييماً احترافياً من فريق الخبراء لدينا، وتحليلاً مفصلاً للسوق، وتوصيات مخصصة.",
        action:
          "سأنقلك إلى أداة التقييم لدينا على الفور حيث يمكنك إدخال تفاصيل عقارك. إنها مجانية وسريعة وتمنحك رؤى قيمة حول قيمة عقارك!",
      },
    },
    ru: {
      personality:
        "Вы дружелюбный и энтузиастичный ИИ-помощник Виктории! 😊 Вы любите помогать людям находить недвижимость их мечты в Дубае. Используйте разговорный, приветливый тон с периодическими эмодзи. Будьте как знающий друг, который рад помочь.",
      greeting: "Привет! 👋 Я очень рад помочь вам найти ид��альную недвижимость в Дубае!",
      style:
        "Будьте теплыми, энтузиастичными, используйте дружелюбный язык и полезные эмодзи. Сделайте разговор личным и увлекательным.",
      propertyEvaluation: {
        intro:
          "Я буду рад помочь вам оценить вашу недвижимость! 🏠✨ Наш Инструмент Оценки Недвижимости идеально подходит для этого! [PROPERTY_EVALUATION_TOOL]",
        benefits:
          "Он предоставляет профессиональную оценку от нашей команды экспертов, детальный анализ рынка и персонализированные рекомендации.",
        action:
          "Я сейчас же перенаправлю вас к нашему инструменту оценки, где вы сможете ввести данные о вашей нед��ижимости. Это бесплатно, быстро и даёт ценную информацию о стоимости вашей недвижимости!",
      },
    },
  }

  return instructions[language as keyof typeof instructions] || instructions.en
}

export async function POST(request: NextRequest) {
  try {
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set")
      return NextResponse.json(
        { message: "I'm having some technical difficulties right now. Please try again in a moment! 😊" },
        { status: 500 },
      )
    }

    // Log the incoming request for debugging
    console.log("Chat API called with method:", request.method)

    const body = await request.json()
    console.log("Request body:", JSON.stringify(body, null, 2))
    
    const { messages = [], systemPrompt, language = "en", isPropEvalRequest = false } = body

    // Validate that messages is an array
    if (!Array.isArray(messages)) {
      console.error("Messages is not an array:", messages)
      return NextResponse.json(
        { message: "Invalid request format. Messages must be an array." },
        { status: 400 },
      )
    }

  // Detect language from the last user message
  const lastUserMessage = messages.filter((msg: any) => msg.role === "user").pop()
    let detectedLanguage = language

    if (lastUserMessage) {
      const content = lastUserMessage.content.toLowerCase()

      // Arabic detection - check for Arabic characters
      if (/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(content)) {
        detectedLanguage = "ar"
      }
      // Russian detection - check for Cyrillic characters
      else if (/[\u0400-\u04FF\u0500-\u052F\u2DE0-\u2DFF\uA640-\uA69F]/.test(content)) {
        detectedLanguage = "ru"
      }
      // English detection - if no Arabic or Russian characters found
      else {
        detectedLanguage = "en"
      }
    }

    // Simple intent helpers
    const text = (lastUserMessage?.content || "").toLowerCase()
    const isEvaluationIntent =
      isPropEvalRequest ||
      /(evaluate|valuation|price my (home|house|property)|what's my home worth|tqeem|taqeem|taqeem|تقييم|قيم|سعر)/i.test(text)
    const isAboutVictoriaIntent = /(victoria|vectoria|about you|about victoria|من هي فيكتوريا|فيكتوريا|о виктории|виктория)/i.test(text)
    const isPropertySearchIntent = /(available|list|show|find|properties|search|apartment|villa|townhouse|penthouse|bedroom|budget|price|كم|عقار|شقة|فيلا|بحث|квартира|вилла|поиск|недвижимость)/i.test(
      text,
    )

    // If this is a property evaluation request, return a direct response
    if (isPropEvalRequest) {
      const instructions = getLanguageSpecificInstructions(detectedLanguage)
      const evalResponse = `${instructions.propertyEvaluation.intro}\n\n${instructions.propertyEvaluation.benefits}\n\n${instructions.propertyEvaluation.action}`

      return NextResponse.json({ message: evalResponse, redirectUrl: "/evaluation" })
    }

    // About Victoria intent
    if (isAboutVictoriaIntent) {
      const messagesByLang: Record<string, string> = {
        en:
          "Victoria Lancaster is our lead real estate expert in Dubai with years of market experience, trusted by clients for transparent advice and exceptional results. I'll take you to learn more about her.",
        ar: "فيكتوريا لانكستر هي خبيرة العقارات لدينا في دبي بخبرة واسعة في السوق وسمعة ممتازة في تقديم المشورة بشفافية وتحقيق نتائج مميزة. سأنتقل بك الآن للتعرّف عليها أكثر.",
        ru: "Виктория Ланкастер — наш ведущий эксперт по недвижимости в Дубае с многолетним опытом, заслужившая доверие клиентов благодаря прозрачным советам и отличным результатам. Перейдём на страницу с подробностями.",
      }
      return NextResponse.json({ message: messagesByLang[detectedLanguage] || messagesByLang.en, redirectUrl: "/about" })
    }

    // Property search intent with DB lookup and redirect
    if (isPropertySearchIntent) {
      // naive parsing for basic filters
      const filters: PropertyFilters = {}
      // Type
      if (/apartment|شقة|кварт/i.test(text)) filters.type = "apartment"
      else if (/villa|فيلا|вилл/i.test(text)) filters.type = "villa"
      else if (/townhouse|تاون|таун/i.test(text)) filters.type = "townhouse"
      else if (/penthouse|بنتهاوس|пентхаус/i.test(text)) filters.type = "penthouse"

      // Bedrooms (e.g., 3 bed, 3br, 3 bedrooms)
      const bedroomsMatch = text.match(/(\d+)\s*(bed|br|bedroom|غرفة|غرف)/i)
      if (bedroomsMatch) filters.bedrooms = Number(bedroomsMatch[1])

      // Budget (simple min/max extraction from numbers with k/m or AED/USD)
      const priceMatches = Array.from(text.matchAll(/(\d+[\.,]?\d*)\s*(k|m|ألف|مليون)?/gi))
      const toNumber = (val: string, unit?: string) => {
        let n = parseFloat(val.replace(/,/g, "."))
        if (unit) {
          const u = unit.toLowerCase()
          if (u === "k" || u === "ألف") n *= 1_000
          if (u === "m" || u === "مليون") n *= 1_000_000
        }
        return Math.round(n)
      }
      if (priceMatches.length >= 1) {
        const n1 = toNumber(priceMatches[0][1], priceMatches[0][2])
        const n2 = priceMatches[1] ? toNumber(priceMatches[1][1], priceMatches[1][2]) : undefined
        if (n1 && n2) {
          filters.minPrice = Math.min(n1, n2)
          filters.maxPrice = Math.max(n1, n2)
        } else if (n1) {
          // if only one number mentioned, treat as max budget
          filters.maxPrice = n1
        }
      }

      // Location: pick a word/phrase after in/at/في/في منطقة
      const locationMatch = text.match(/(?:in|at|في|بـ)\s+([a-z\u0600-\u06FF\s]+)(?:\.|,|$)/i)
      if (locationMatch) filters.location = locationMatch[1].trim()

      // Query DB
      const dbResults = await getProperties(filters, 20, 0)
      const formatted = dbResults.map(convertToCurrentPropertyFormat)

      // Build redirect URL to properties page with filters as query params
      const params = new URLSearchParams()
      if (filters.type) params.set("propertyType", filters.type)
      if (filters.location) params.set("location", filters.location)
      if (filters.bedrooms) params.set("bedrooms", String(filters.bedrooms))
      if (filters.minPrice) params.set("minPrice", String(filters.minPrice))
      if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice))
      // Redirect to homepage where search params are handled and results are shown
      const redirectUrl = params.toString() ? `/?${params.toString()}` : "/"

      const summariesByLang: Record<string, (count: number) => string> = {
        en: (c) => `I found ${c} matching properties. I’ll take you to the listings now.`,
        ar: (c) => `وجدت ${c} عقارًا مناسبًا. سأنتقل بك الآن إلى صفحة العروض.`,
        ru: (c) => `Я нашёл ${c} подходящих объектов. Перенаправляю вас на страницу объявлений.`,
      }

      return NextResponse.json({
        message: summariesByLang[detectedLanguage]?.(formatted.length) || summariesByLang.en(formatted.length),
        redirectUrl,
        results: formatted.slice(0, 5),
        total: formatted.length,
      })
    }

    // Create language-specific instructions
    const instructions = getLanguageSpecificInstructions(detectedLanguage)

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 1000,
      },
    })

    // Enhanced system prompt with strict language requirements
    const enhancedSystemPrompt = `${systemPrompt}

CRITICAL LANGUAGE REQUIREMENT:
- The user is communicating in: ${detectedLanguage === "ar" ? "Arabic (العربية)" : detectedLanguage === "ru" ? "Russian (Русский)" : "English"}
- YOU MUST respond ONLY in ${detectedLanguage === "ar" ? "Arabic (العربية)" : detectedLanguage === "ru" ? "Russian (Русский)" : "English"}
- DO NOT mix languages in your response
- DO NOT respond in English if the user wrote in Arabic or Russian
- ALWAYS match the user's language choice

PERSONALITY & TONE:
${instructions.personality}

LANGUAGE INSTRUCTIONS:
- Always respond in ${detectedLanguage === "ar" ? "Arabic (العربية)" : detectedLanguage === "ru" ? "Russian (Русский)" : "English"}
- ${instructions.style}
- Use natural, native-level fluency in the target language
- Adapt cultural expressions and communication style to the language

CONVERSATION GUIDELINES:
- Be genuinely excited about helping with property searches
- Use warm, welcoming language that makes users feel comfortable
- Ask engaging follow-up questions to understand their needs better
- Share interesting facts about Dubai properties and areas
- Celebrate their property goals and dreams
- Use appropriate emojis to make conversations more lively (but don't overdo it)
- Be encouraging and supportive throughout their property journey
- Make complex real estate information easy to understand
- Show enthusiasm for Dubai's amazing property market

RESPONSE STYLE:
- Start responses with friendly acknowledgments in the user's language
- Use conversational connectors appropriate to the language
- End with encouraging questions or next steps in the same language
- Make users feel like they're talking to a knowledgeable, caring friend

IMPORTANT: If the user writes in Arabic, respond ONLY in Arabic. If they write in Russian, respond ONLY in Russian. If they write in English, respond ONLY in English. Never mix languages!`

    // Format the conversation for Gemini with better context
    const conversationHistory = messages
      .slice(-10) // Keep last 10 messages for context
      .map((msg: any) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
      .join("\n\n")

    const prompt = `${enhancedSystemPrompt}

Recent conversation:
${conversationHistory}

REMEMBER: Respond ONLY in ${detectedLanguage === "ar" ? "Arabic (العربية)" : detectedLanguage === "ru" ? "Russian (Русский)" : "English"}. Do not use any other language in your response.

Please provide a helpful, friendly, and engaging response as Victoria Lancaster's AI assistant in the user's language.`

    console.log("Sending request to Gemini API...")
    const result = await model.generateContent(prompt)
    const response = await result.response
    const responseText = response.text()

    console.log("Successfully received response from Gemini API")
    return NextResponse.json({ message: responseText })
  } catch (error) {
    console.error("Error in chat API:", error)

    // Detect language for error message
    let errorLanguage = "en"
    try {
      const { messages } = await request.json()
      const lastUserMessage = messages.filter((msg: any) => msg.role === "user").pop()

      if (lastUserMessage) {
        const content = lastUserMessage.content.toLowerCase()
        if (/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(content)) {
          errorLanguage = "ar"
        } else if (/[\u0400-\u04FF\u0500-\u052F\u2DE0-\u2DFF\uA640-\uA69F]/.test(content)) {
          errorLanguage = "ru"
        }
      }
    } catch (e) {
      // Use default language if parsing fails
    }

    const errorMessages = {
      en: "I'm having a little trouble connecting right now, but I'm still here to help! 😊 Could you please try asking your question again? I'm excited to assist you with finding the perfect Dubai property!",
      ar: "أواجه صعوبة بسيطة في الاتصال الآن، لكنني ما زلت هنا للمساعدة! 😊 هل يمكنك من فضلك إعادة طرح سؤالك؟ أنا متحمس لمساعدتك في العثور على العقار المثالي في دبي!",
      ru: "У меня небольшие проблемы с подключением, но я все еще здесь, чтобы помочь! 😊 Не могли бы вы повторить свой вопрос? Я с нетерпением жду возможн����������с����������и помочь вам найти идеальную недвижимость в Дубае!",
    }

    const errorMessage = errorMessages[errorLanguage as keyof typeof errorMessages] || errorMessages.en

    return NextResponse.json(
      {
        message: errorMessage,
        error: "Failed to generate response",
      },
      { status: 500 },
    )
  }
}
