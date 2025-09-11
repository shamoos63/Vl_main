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
      question: "هل يحق للأجانب تملّك العقارات في دبي؟",
      answer:
        "نعم، في دبي مناطق مخصّصة للتملّك الحر تتيح للأجانب امتلاك العقار بشكل كامل، بآلية واضحة وبسيطة تجعل الاستثمار متاحاً وجاذباً لرأس المال العالمي… دون الحاجة إلى إقامة مسبقة.",
    },
    {
      question: "أنا جديد في الاستثمار العقاري، من أين أبدأ؟",
      answer:
        "ابدأ من تحديد أهدافك الاستثمارية: دخل إيجاري مستقر، عائد سريع، أو منزل مستقبلي. عند توضيح أولوياتك، أستطيع أن أبني لك استراتيجية دقيقة وأوجّهك نحو أفضل المناطق والعقارات التي تناسب طموحاتك.",
    },
    {
      question: "ما نوع العائدات التي يمكنني توقعها من الاستثمار العقاري في دبي؟",
      answer: "دبي تقدّم واحد من أعلى عوائد الإيجار عالميًا، بمتوسط يتراوح بين 5% و 8.4%، وقد يصل في بعض الفرص الاستثنائية إلى 15%.",
    },
    {
      question: "هل يجب أن أكون في دبي لشراء عقار؟",
      answer: " إطلاقاً. بفضل التوكيل والتوقيع الرقمي، يمكنك إتمام عملية الشراء من أي مكان في العالم بكل سهولة وأمان.",
    },
    {
      question: "هل يستطيع المشترون الدوليون الحصول على رهن عقاري في دبي؟",
      answer: "نعم. بعض البنوك تقدّم تمويلاً لغير المقيمين وفق ملفك المالي ونوع العقار، ما يجعل دبي سوقاً مفتوحاً ومرناً أمام المستثمرين العالميين.",
    },
    {
      question: "هل هناك ضرائب على  شراء العقار في دبي؟",
      answer:
        "دبي لا تفرض ضريبة دخل عقاري أو أرباح رأسمالية. الرسوم الوحيدة المهمة هي 4% رسوم تسجيل لدى دائرة الأراضي والأملاك، إضافة إلى بعض الرسوم الإدارية والقانونية البسيطة.",
    },
    {
      question: "هل يتيح تملّك العقار الحصول على إقامة في دبي؟",
      answer:
        "نعم. عند الاستثمار بـ 750,000 درهم أو أكثر في عقار سكني، تصبح مؤهلاً للحصول على إقامة قابلة للتجديد لمدة عامين عبر دائرة الأراضي والأملاك في دبي.",
    },
    {
      question: "ما الأفضل: العقار الجاهز أم على الخريطة؟",
      answer: (
  <>
    الأمر يعتمد على أهدافك الاستثمارية.<br />
          <li>العقار الجاهز:  يوفّر دخلاً فورياً من الإيجار.<br /></li>
  <li> العقار على الخريطة: عادةً يكون أقل كلفة، بخطط دفع مرنة، مع إمكانية نمو أعلى لرأس المال.</li> 
  </>
)
    },
    {
      question: "ما هي أبرز المناطق للاستثمار العقاري في دبي؟",
    answer: (
  <>
    يحسب وجهة نظري، المناطق الأهم هي: <br/>مرسى دبي، وسط المدينة، نخلة جميرا، قرية جميرا الدائرية، الخليج التجاري، ومدينة دبي الملاحية.
<br/>  تجمع هذه المواقع بين الطلب الإيجاري المرتفع، البنية الفاخرة، والعوائد طويلة الأجل والمستقرة.
  </>
)
    },
    {
      question: "ما الذي يميز العمل معك عن غيرك؟",
      answer: (
  <>
    أنا لا أبيع العقارات فقط، بل أصنع استراتيجيات استثمارية.
<br/>  بخبرة تتجاوز <b> 15 عاماً</b>، ومعرفة دقيقة بالسوق، وعلاقات متينة مع كبار المطورين، أضمن لعملائي <b> فرصاً عالية القيمة وعوائد أكثر استقراراً.</b>
</>
)
    },
    {
      question: "كيف تختارين العقارات التي توصي بها؟",
      answer: (
  <>
أعتمد قاعدة واضحة: <b> ما لا أستثمر فيه شخصياً، لا أوصي به. </b>
<br /> أقيّم كل فرصة بدقة وفق معايير <b> تشمل مصداقية المطوّر، توقعات العائد على الاستثمار، القيمة طويلة المدى، ورؤية استراتيجية مبنية على خبرتي. </b>
</>
)
    },
    {
      question: "كيف تكون تجربة العمل معك؟",
      answer: (
  <>
تجربة تقوم على <b> الشفافية، الصدق، والثقة الهادئة. </b>
<br/>أستمع بعمق، أفكّر ببُعد استراتيجي، وأقدّم لك ما تحتاج أن تعرفه لاتخاذ قرارات صحيحة… لا ما ترغب فقط في سماعه.
</>
)
    },
    {
      question: "لماذا تختارين العمل مع عملاء ومطوّرين محدّدين؟",
    answer: (
  <>
لأن <b> الجودة أهم من الكمية. </b> بالتركيز على المطوّرين الموثوقين والمستثمرين الجادّين، أضمنا أن يُوجَّه وقتي وخبرتي نحو <b> الصفقات الأهم والأكثر قيمة. </b>
</>
)
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
                ? "الأسئلة الأكثر تكرراً"
                : "Часто задаваемые вопросы"}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            {language === "en"
              ? "with Victoria Lancaster"
              : language === "ar"
                ? "إجابات فيكتوريا على أكثر الأسئلة شيوعاً في عالم الاستثمار العقاري"
                : "с Викторией Ланкастер"}
          </p>
          <div className="w-40 h-1 bg-vl-yellow mx-auto"></div>
        </div>

 <div className="text-center mt-6 mb-6">
          <div className="glass p-8 rounded-2xl max-w-2xl mx-auto">
            <p className="text-white font-medium italic">
              {language === "en"
                ? '"I chose these questions because they reflect what people really ask me, not just about buying in Dubai, but about how I think, how I work, and what I value. I believe clarity builds trust.When you know what to expect, you can make better decisions."'
                : language === "ar"
                  ? '"اخترت هذه الأسئلة لأنها تمثّل ما يشغل بال المستثمرين حقاً، ليس فقط عن شراء العقار في دبي، بل عن منهجي في التفكير، وأسلوب عملي. أؤمن أن الشفافية تبني الثقة، وحين يكون لديك وضوح كامل، تصبح قراراتك الاستثمارية أكثر ذكاءً وأماناً."'
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
      <h3 className={`text-lg sm:text-xl font-semibold text-vl-yellow tracking-wide pr-4 shadow-none !important ${ language === "ar" ? "text-right " : "text-left" }`}>{faq.question}</h3>
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
