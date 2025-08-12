"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useI18n } from "@/lib/i18n"

const faqData = {
  en: [
    {
      question: "Can foreigners buy property in Dubai?",
      answer:
        "Absolutely. Non-residents can fully own property in designated freehold areas across Dubai. It's a streamlined process that welcomes global investors without requiring residency.",
    },
    {
      question: "I'm new to property investment, where should I start?",
      answer:
        "Start with clarity. Understand your investment goals , are you looking for long-term rental income, short-term gains, or a future home? Once your priorities are clear, I will help you build a strategy around them, guiding you through the best areas, property types, and developers that match your vision. It's not about rushing , it's about smart, purpose-driven choices.",
    },
    {
      question: "What kind of returns can I expect from property investment in Dubai?",
      answer:
        "Dubai offers some of the highest rental yields globally , typically ranging from 5% to 8.4%, and in some cases even up to 15%.",
    },
    {
      question: "Do I need to be in Dubai to buy property?",
      answer:
        "Not at all. With power of attorney and digital signing, you can purchase remotely from anywhere in the world.",
    },
    {
      question: "Can international buyers get a mortgage in Dubai?",
      answer:
        "Yes. Select banks offer financing options to non-residents, depending on your financial profile and the property type.",
    },
    {
      question: "Are there taxes involved in buying property?",
      answer:
        "Dubai has no property income tax or capital gains tax. The main fee is a 4% registration charge with the Dubai Land Department, plus minor administrative and legal fees.",
    },
    {
      question: "Will property ownership get me a residency visa?",
      answer:
        "Yes. If you invest AED 750,000 or more in a residential property, you're eligible to apply for a 2-year renewable residency visa through the Dubai Land Department. For mortgaged properties, at least 50% of the property's value must be paid, and a No Objection Certificate (NOC) from the bank is required.",
    },
    {
      question: "What's better: ready property or off-plan?",
      answer:
        "It depends on your goals and what's available on the market. Ready properties can start generating income right away, while off-plan projects often offer lower entry points, attractive payment plans, and capital growth potential. Each option has its own advantages , and I will help you decide based on your unique situation.",
    },
    {
      question: "Which areas in Dubai offer the best investment opportunities?",
      answer:
        "It depends on your goals and what’s available in the market. Every case is unique, but top-performing areas like Dubai Marina, Downtown, Palm Jumeirah, JVC, Business Bay, and Dubai Maritime City offer strong rental demand, premium lifestyle appeal, and solid long-term returns.",
    },
    {
      question: "What makes working with you different from others?",
      answer:
        "I don't just sell , I strategize. With over 15 years of experience, deep market knowledge, and strong connections with top-tier developers, I secure high-value deals for my clients. I build long-term relationships , not one-off sales , and treat every portfolio as if it were my own. My impressive track record includes 585+ successful deals worth over AED 1.7 billion, all registered with the Dubai Land Department.",
    },
    {
      question: "How do you choose which properties to recommend?",
      answer:
        "If I wouldn't invest in it myself, I won't recommend it. I personally vet each opportunity based on developer credibility, ROI projections, long-term value, and gut instinct. I believe a smart investment must make sense on paper , and feel right in your hands.",
    },
    {
      question: "What’s it like to work with you one-on-one?",
      answer:
        "Expect transparency, calm confidence, and complete honesty. I listen deeply, think strategically, and tell you what you need to hear , not just what you want. I become your thinking partner, not a salesperson. Whether it's a quick deal or a year-long search, I stay fully invested in your goals.",
    },
    {
      question: "Why do you only work with selected clients and developers?",
      answer:
        "Because quality over quantity leads to better outcomes. By focusing only on trusted developers and serious buyers, I preserve my time, energy, and focus for deals that matter, where I can make a real impact. This allows me to deliver exceptional results, not just transactions.",
    },
  ],
  ar: [
    {
      question: "هل يمكن للأجانب شراء عقارات في دبي؟",
      answer:
        "بالطبع. يمكن لغير المقيمين امتلاك العقارات بالكامل في المناطق المخصصة للملكية الحرة في جميع أنحاء دبي. إنها عملية مبسطة ترحب بالمستثمرين العالميين دون الحاجة إلى الإقامة.",
    },
    {
      question: "أنا جديد في الاستثمار العقاري - من أين أبدأ؟",
      answer:
        "ابدأ بالوضوح. افهم أهدافك الاستثمارية - هل تبحث عن دخل إيجار طويل المدى، أم مكاسب قصيرة المدى، أم منزل مستقبلي؟ بمجرد أن تصبح أولوياتك واضحة، سأساعدك في بناء استراتيجية حولها، وتوجيهك عبر أفضل المناطق وأنواع العقارات والمطورين التي تتناسب مع رؤيتك.",
    },
    {
      question: "ما نوع العائدات التي يمكنني توقعها من الاستثمار العقاري في دبي؟",
      answer: "تقدم دبي بعض أعلى عائدات الإيجار عالميًا - تتراوح عادة من 5% إلى 8.4%، وفي بعض الحالات حتى 15%.",
    },
    {
      question: "هل أحتاج إلى أن أكون في دبي لشراء عقار؟",
      answer: "ليس على الإطلاق. مع التوكيل والتوقيع الرقمي، يمكنك الشراء عن بُعد من أي مكان في العالم.",
    },
    {
      question: "هل يمكن للمشترين الدوليين الحصول على رهن عقاري في دبي؟",
      answer: "نعم. تقدم البنوك المختارة خيارات التمويل لغير المقيمين، اعتمادًا على ملفك المالي ونوع العقار.",
    },
    {
      question: "هل هناك ضرائب متضمنة في شراء العقار؟",
      answer:
        "دبي ليس لديها ضريبة دخل عقاري أو ضريبة أرباح رأس المال. الرسم الرئيسي هو رسم تسجيل 4% مع دائرة الأراضي والأملاك في دبي، بالإضافة إلى رسوم إدارية وقانونية طفيفة.",
    },
    {
      question: "هل ملكية العقار ستمنحني تأشيرة إقامة؟",
      answer:
        "نعم. إذا استثمرت 750,000 درهم إماراتي أو أكثر في عقار سكني، فأنت مؤهل للتقدم للحصول على تأشيرة إقامة قابلة للتجديد لمدة عامين من خلال دائرة الأراضي والأملاك في دبي.",
    },
    {
      question: "ما الأفضل: العقار الجاهز أم على الخريطة؟",
      answer:
        "يعتمد على أهدافك وما هو متاح في السوق. العقارات الجاهزة يمكن أن تبدأ في توليد الدخل على الفور، بينما المشاريع على الخريطة غالبًا ما تقدم نقاط دخول أقل وخطط دفع جذابة وإمكانية نمو رأس المال.",
    },
    {
      question: "ما هي المناطق في دبي التي تقدم أفضل الفرص الاستثمارية؟",
      answer:
        "تشمل المناطق الأفضل أداءً: دبي مارينا، وسط مدينة دبي، نخلة جميرا، قرية جميرا الدائرية، الخليج التجاري، ومدينة دبي البحرية. هذه المناطق تقدم مزيجًا من الطلب القوي على الإيجار والجاذبية الفاخرة والعائدات الصلبة طويلة الأجل.",
    },
    {
      question: "ما الذي يجعل العمل مع فيكتوريا مختلفًا عن الآخرين؟",
      answer:
        "فيكتوريا لا تبيع فقط - بل تضع استراتيجيات. مع أكثر من 15 عامًا من الخبرة ومعرفة عميقة بالسوق وعلاقات قوية مع المطورين من الدرجة الأولى، تؤمن صفقات عالية القيمة لعملائها.",
    },
    {
      question: "كيف تختار فيكتوريا العقارات التي توصي بها؟",
      answer:
        "إذا لم تكن ستستثمر فيه بنفسها، فلن توصي به. فيكتوريا تفحص شخصيًا كل فرصة بناءً على مصداقية المطور وتوقعات العائد على الاستثمار والقيمة طويلة المدى والحدس.",
    },
    {
      question: "كيف يكون العمل مع فيكتوريا وجهًا لوجه؟",
      answer:
        "توقع الشفافية والثقة الهادئة والصدق الكامل. فيكتوريا تستمع بعمق وتفكر استراتيجيًا وتخبرك بما تحتاج إلى سماعه - وليس فقط ما تريد سماعه.",
    },
    {
      question: "لماذا تعمل فيكتوريا فقط مع عملاء ومطورين مختارين؟",
      answer:
        "لأن الجودة على الكمية تؤدي إلى نتائج أفضل. من خلال التركيز فقط على المطورين الموثوقين والمشترين الجديين، تحافظ فيكتوريا على وقتها وطاقتها وتركيزها للصفقات المهمة.",
    },
  ],
  ru: [
    {
      question: "Могут ли иностранцы покупать недвижимость в Дубае?",
      answer:
        "Абсолютно. Нерезиденты могут полностью владеть недвижимостью в специально отведенных зонах свободного владения по всему Дубаю. Это упрощенный процесс, который приветствует глобальных инвесторов без требования резидентства.",
    },
    {
      question: "Я новичок в инвестициях в недвижимость - с чего начать?",
      answer:
        "Начните с ясности. Поймите свои инвестиционные цели - ищете ли вы долгосрочный доход от аренды, краткосрочную прибыль или будущий дом? Как только ваши приоритеты станут ясными, Виктория поможет вам построить стратегию вокруг них.",
    },
    {
      question: "Какую доходность можно ожидать от инвестиций в недвижимость в Дубае?",
      answer:
        "Дубай предлагает одни из самых высоких доходностей от аренды в мире - обычно от 5% до 8,4%, а в некоторых случаях даже до 15%.",
    },
    {
      question: "Нужно ли мне быть в Дубае, чтобы купить недвижимость?",
      answer: "Совсем нет. С доверенностью и цифровой подписью вы можете покупать удаленно из любой точки мира.",
    },
    {
      question: "Могут ли международные покупатели получить ипотеку в Дубае?",
      answer:
        "Да. Отдельные банки предлагают варианты финансирования для нерезидентов, в зависимости от вашего финансового профиля и типа недвижимости.",
    },
    {
      question: "Есть ли налоги при покупке недвижимости?",
      answer:
        "В Дубае нет подоходного налога на недвижимость или налога на прирост капитала. Основная плата - это 4% регистрационный сбор в Департаменте земли и недвижимости Дубая, плюс незначительные административные и юридические сборы.",
    },
    {
      question: "Даст ли мне владение недвижимостью визу на жительство?",
      answer:
        "Да. Если вы инвестируете 750,000 дирхамов ОАЭ или более в жилую недвижимость, вы имеете право подать заявление на получение 2-летней возобновляемой визы на жительство через Департамент земли и недвижимости Дубая.",
    },
    {
      question: "Что лучше: готовая недвижимость или на стадии строительства?",
      answer:
        "Это зависит от ваших целей и того, что доступно на рынке. Готовая недвижимость может сразу начать приносить доход, в то время как проекты на стадии строительства часто предлагают более низкие точки входа, привлекательные планы платежей и потенциал роста капитала.",
    },
    {
      question: "Какие районы в Дубае предлагают лучшие инвестиционные возможности?",
      answer:
        "Лучшие районы включают: Дубай Марина, Центр Дубая, Палм Джумейра, Джумейра Виллидж Се��кл (JVC), Бизнес Бей и Дубай Маритайм Сити. Эти районы предлагают сочетание сильного спроса на аренду, премиальной привлекательности образа жизни и солидной долгосрочной доходности.",
    },
    {
      question: "Что дела��т работу с Викторией отличной от других?",
      answer:
        "Виктория не просто продает - она разрабатывает стратегии. Имея более 15 лет опыта, глубокие знания рынка и прочные связи с ведущими застройщиками, она обеспечивает высокоценные сделки для своих клиентов.",
    },
    {
      question: "Как Виктория выбирает недвижимость для рекомендации?",
      answer:
        "Если она сама не стала бы в это инвестировать, она не будет это рекомендовать. Виктория лично проверяет каждую возможность на основе надежности застройщика, прогнозов ROI, долгосрочной стоимости и интуиции.",
    },
    {
      question: "Каково это - работать с Викторией один на один?",
      answer:
        "Ожидайте прозрачности, с��окойной уверенности и полной честности. Виктория глубоко слушает, стратегически думает и говорит вам то, что вам нужно услышать - не только то, что вы хотите услышать.",
    },
    {
      question: "Почему Виктория работает только с избранными клиентами и застройщиками?",
      answer:
        "Потому что качест��о важнее количества и приводит к лучшим результатам. Сосредотачиваясь только на надежных застройщиках и серьезных покупателях, Виктория сохраняет свое время, энергию и фокус для сделок, которые имеют значение.",
    },
  ],
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const { t, isRTL, language } = useI18n()

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const currentFaqs = faqData[language] || faqData.en

  return (
    <section className="py-20 bg-transaparent" dir={isRTL ? "rtl" : "ltr"}>
      <div className="px-6 pb-6">
       
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-vl-yellow mb-6 font-heading">
            {language === "en"
              ? "Frequently Asked Questions"
              : language === "ar"
                ? "الأسئلة الشائعة"
                : "Часто задаваемые вопросы"}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            {language === "en"
              ? "with Victoria Lancaster"
              : language === "ar"
                ? "مع فيكتوريا لانكستر"
                : "с Викторией Ланкастер"}
          </p>
          <div className="w-40 h-1 bg-vl-yellow mx-auto"></div>
        </div>

 <div className="text-center mt-12">
          <div className="glass p-8 rounded-2xl max-w-2xl mx-auto">
            <p className="text-white font-medium italic">
              {language === "en"
                ? '"I chose these questions because they reflect what people really ask me, not just about buying in Dubai, but about how I think, how I work, and what I value. I believe clarity builds trust.When you know what to expect, you can make better decisions."'
                : language === "ar"
                  ? '"اخترت هذه الأسئلة لأنها تعكس ما يسألني الناس حقًا - ليس فقط عن الشراء في دبي، ولكن عن كيف أفكر وكيف أعمل وما أقدره. أؤمن أن الوضوح يبني الثقة. عندما تعرف ما تتوقعه، يمكنك اتخاذ قرارات أفضل."'
                  : '"Я выбрала эти вопросы, потому что они отражают то, что люди действительно спрашивают меня, не только о покупке в Дубае, но о том, как я думаю, как работаю и что ценю. Я верю, что ясность строит доверие. Когда вы знаете, чего ожидать, вы можете принимать лучшие решения."'}
            </p>
            <p className="!important font-semibold mt-4 text-vl-yellow">
              {language === "en"
                ? "Victoria Lancaster"
                : language === "ar"
                  ? "فيكتوريا لانكستر"
                  : "Виктория Ланкастер"}
            </p>
          </div>
        </div>
        <div className="max-w-4xl py-5 mx-auto space-y-4 bg-transparent">
          {currentFaqs.map((faq, index) => (
            <Card key={index} className="glass overflow-hidden rounded-xl">
  <div>
    <button
      onClick={() => toggleFaq(index)}
      className="w-full p-5 sm:p-6 text-left flex items-center justify-between bg-transparent hover:bg-white/5 transition-colors duration-300"
    >
      <h3 className="text-lg sm:text-xl font-semibold text-vl-yellow tracking-wide pr-4 shadow-none !important">{faq.question}</h3>
      {openIndex === index ? (
        <ChevronUp className="h-5 w-5 text-vl-yellow flex-shrink-0 transition-transform duration-200" />
      ) : (
        <ChevronDown className="h-5 w-5 text-vl-yellow flex-shrink-0 transition-transform duration-200" />
      )}
    </button>
  </div>

  {openIndex === index && (
    <div className="px-5 sm:px-6 pb-6 pt-4 bg-white/5 text-gray-200 rounded-b-xl border-t border-slate-500/40 transition-all duration-300 ease-in-out">
      <p className="leading-relaxed text-sm sm:text-base">{faq.answer}</p>
    </div>
  )}
</Card>
          ))}
        </div>

      
      </div>
    </section>
  )
}
