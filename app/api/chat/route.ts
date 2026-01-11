import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"
import { getProperties, convertToCurrentPropertyFormat, type PropertyFilters } from "@/lib/db/utils"

// Initialize Gemini AI
const genAI: GoogleGenerativeAI | null = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null

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
          "I'd be thrilled to help you evaluate your property! 🏠✨ Our Property Evaluation Tool is perfect for this! Property Evaluation Tool",
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
          "يسعدني مساعدتك في تقييم عقارك! 🏠✨ أداة تقييم العقارات لدينا مثالية لهذا الغرض! أداة تقييم العقارات",
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
      // English: evaluation, valuation, appraisal, price my home/house/property, how much is my home worth, property value, market value
      /(evaluate|evaluation|valuation|apprais(e|al)|price\s+(my|of)\s+(home|house|property|apartment|flat)|how\s+much\s+is\s+(my\s+)?(home|house|property|apartment|flat)|home\s+worth|property\s+value|market\s+value)/i.test(text) ||
      // Arabic: تقييم، قيم، سعر، قيمة، كم سعر/تساوي/قيمة، تسعير، تقييم عقار/منزل/بيت/شقة
      /(تقييم|قيم|سعر|قيمة|كم|اديش|بيسوى\s+(سعر|تساوي|قيمة)|تسعير|تقييم\s+(عقار|منزل|بيت|شقة))/i.test(text) ||
      // Russian: оценка, оценить, стоимость, сколько стоит, цена, оценить квартиру/дом/недвижимость
      /(оцен(ка|ить)|стоимост(ь|и)|сколько\s+стоит|цена|оценить\s+(квартиру|дом|недвижимость)|сколько\s+стоит\s+(моя\s+)?(квартира|дом|недвижимость))/i.test(text)
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

    // If user asks about pricing/evaluation in any supported language, guide to evaluation tool and redirect
    if (isEvaluationIntent) {
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
      const priceMatches = Array.from(text.matchAll(/(\d+[\.,]?\d*)\s*(k|m|ألف|مليون)?/gi)) as RegExpMatchArray[]
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
        const n1 = toNumber(priceMatches[0][1] as string, priceMatches[0][2] as string | undefined)
        const n2 = priceMatches[1] ? toNumber(priceMatches[1][1] as string, priceMatches[1][2] as string | undefined) : undefined
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

    // If no API key, provide a graceful fallback without failing the whole chat.
    if (!genAI) {
      const fallbackByLang: Record<string, string> = {
        en: "I'm here to help! While my AI brain is warming up, I can still search our live database for properties. Ask me for areas, budgets, bedrooms, or property types and I'll find options for you.",
        ar: "أنا هنا لمساعدتك! بينما يتم تفعيل نظام الذكاء الاصطناعي، ما زلت أستطيع البحث في قاعدة البيانات المباشرة لدينا عن العقارات. أخبرني بالمناطق أو الميزانية أو عدد الغرف أو نوع العقار وسأعرض لك النتائج.",
        ru: "Я здесь, чтобы помочь! Пока мой ИИ недоступен, я могу искать объекты в нашей живой базе. Скажите район, бюджет, комнаты или тип недвижимости — подберу варианты.",
      }
      return NextResponse.json({ message: fallbackByLang[detectedLanguage] || fallbackByLang.en })
    }

    // Helper: timeout wrapper
    const withTimeout = <T,>(p: Promise<T>, ms: number, label: string) =>
      new Promise<T>((resolve, reject) => {
        const id = setTimeout(() => reject(new Error(`TIMEOUT: ${label}`)), ms)
        p.then((v) => {
          clearTimeout(id)
          resolve(v)
        }).catch((e) => {
          clearTimeout(id)
          reject(e)
        })
      })

    // We'll try multiple model IDs to avoid 404s for unsupported versions
    const candidateModels = [
      "gemini-3-flash-preview"
    ]

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

    console.log("Trying Gemini models:", candidateModels.join(", "))
    let responseText = ""
    let lastError: unknown = null

    for (const modelId of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelId,
          generationConfig: {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 1000,
          },
        })

        console.log(`Sending request to Gemini API using model: ${modelId}`)
        const result = await withTimeout(model.generateContent(prompt), 15000, `generateContent(${modelId})`)
        const response = await (result as any).response
        responseText = response.text()
        console.log(`Received response from Gemini model: ${modelId}`)
        break
      } catch (err) {
        lastError = err
        console.error(`Model ${modelId} failed:`, err)
        // Try next candidate
      }
    }

    if (!responseText) {
      // All attempts failed — provide graceful fallback response
      const fallbackByLang: Record<string, string> = {
        en: "I'm having trouble connecting to my AI service right now, but I can still help search our live database for properties. Tell me an area, budget, bedrooms, or type and I’ll find options for you.",
        ar: "أواجه مشكلة مؤقتة في الاتصال بخدمة الذكاء الاصطناعي، لكن ما زلت أستطيع مساعدتك بالبحث في قاعدة بياناتنا المباشرة. أخبرني بالمنطقة أو الميزانية أو عدد الغرف أو نوع العقار وسأعرض لك الخيارات.",
        ru: "У меня временные проблемы с подключением к ИИ, но я могу искать объекты в нашей базе. Назовите район, бюджет, комнаты или тип недвижимости — подберу варианты.",
      }
      return NextResponse.json({
        message: fallbackByLang[detectedLanguage] || fallbackByLang.en,
        error: (lastError as Error)?.message || "All model attempts failed",
      })
    }

    // Language correction fallback: if target is Arabic/Russian but response isn't in that script, translate it.
    const containsArabic = (s: string) => /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(s)
    const containsCyrillic = (s: string) => /[\u0400-\u04FF\u0500-\u052F\u2DE0-\u2DFF\uA640-\uA69F]/.test(s)

    async function translateIfNeeded(text: string, targetLang: "ar" | "ru"): Promise<string> {
      try {
        if (!genAI) return text
        // Reuse first candidate model id for translation
        const modelId = candidateModels[0]
        const model = genAI.getGenerativeModel({
          model: modelId,
          generationConfig: {
            temperature: 0.2,
            topK: 1,
            topP: 1,
            maxOutputTokens: 800,
          },
        })
        const instruction =
          targetLang === "ar"
            ? "Translate the following into Arabic. Output only the translation with no extra text:"
            : "Translate the following into Russian. Output only the translation with no extra text:"
        const tRes = await withTimeout(model.generateContent(`${instruction}\n\n${text}`), 12000, `translate(${targetLang})`)
        const tOut = await (tRes as any).response
        const tText = tOut.text()
        return tText || text
      } catch {
        return text
      }
    }

    if (detectedLanguage === "ar" && !containsArabic(responseText)) {
      responseText = await translateIfNeeded(responseText, "ar")
    } else if (detectedLanguage === "ru" && !containsCyrillic(responseText)) {
      responseText = await translateIfNeeded(responseText, "ru")
    }

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
