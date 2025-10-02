"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import Image from "next/image"

const UAEFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <path d="M5,4h6V28H5c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z" fill="#ea3323"></path>
    <path d="M10,20v8H27c2.209,0,4-1.791,4-4v-4H10Z"></path>
    <path fill="#fff" d="M10 11H31V21H10z"></path>
    <path d="M27,4H10V12H31v-4c0-2.209-1.791-4-4-4Z" fill="#317234"></path>
    <path
      d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
      opacity=".15"
    ></path>
    <path
      d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
      fill="#fff"
      opacity=".2"
    ></path>
  </svg>
)

const RussiaFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <path fill="#1435a1" d="M1 11H31V21H1z"></path>
    <path d="M5,4H27c2.208,0,4,1.792,4,4v4H1v-4c0-2.208,1.792-4,4-4Z" fill="#fff"></path>
    <path
      d="M5,20H27c2.208,0,4,1.792,4,4v4H1v-4c0-2.208,1.792-4,4-4Z"
      transform="rotate(180 16 24)"
      fill="#c53a28"
    ></path>
    <path
      d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
      opacity=".15"
    ></path>
    <path
      d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
      fill="#fff"
      opacity=".2"
    ></path>
  </svg>
)

const SingaporeFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <path d="M1,24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V15H1v9Z" fill="#fff"></path>
    <path d="M27,4H5c-2.209,0-4,1.791-4,4v8H31V8c0-2.209-1.791-4-4-4Z" fill="#db3c3f"></path>
    <path
      d="M5,28H27c2.209,0,4-1.791-4-4V8c0-2.209-1.791-4-4-4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4ZM2,8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8Z"
      opacity=".15"
    ></path>
    <path
      d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
      fill="#fff"
      opacity=".2"
    ></path>
    <path
      d="M6.811,10.5c0-1.898,1.321-3.487,3.094-3.897-.291-.067-.594-.103-.906-.103-2.209,0-4,1.791-4,4s1.791,4,4,4c.311,0,.615-.036,.906-.103-1.773-.41-3.094-1.999-3.094-3.897Z"
      fill="#fff"
    ></path>
    <path
      fill="#fff"
      d="M10.81 8.329L10.576 9.048 11.189 8.603 11.801 9.048 11.567 8.329 12.179 7.884 11.423 7.884 11.189 7.164 10.955 7.884 10.198 7.884 10.81 8.329z"
    ></path>
    <path
      fill="#fff"
      d="M14.361 9.469L13.605 9.469 13.371 8.749 13.137 9.469 12.38 9.469 12.992 9.914 12.759 10.634 13.371 10.189 13.983 10.634 13.749 9.914 14.361 9.469z"
    ></path>
    <path
      fill="#fff"
      d="M10.074 12.034L9.84 11.315 9.606 12.034 8.85 12.034 9.462 12.479 9.228 13.199 9.84 12.754 10.452 13.199 10.218 12.479 10.831 12.034 10.074 12.034z"
    ></path>
    <path
      fill="#fff"
      d="M12.771 12.034L12.537 11.315 12.303 12.034 11.547 12.034 12.159 12.479 11.925 13.199 12.537 12.754 13.149 13.199 12.916 12.479 13.528 12.034 12.771 12.034z"
    ></path>
    <path
      fill="#fff"
      d="M9.24 9.469L9.007 8.75 8.773 9.469 8.016 9.469 8.628 9.914 8.394 10.634 9.007 10.189 9.619 10.634 9.385 9.914 9.997 9.469 9.24 9.469z"
    ></path>
  </svg>
)

const SpainFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <path fill="#f1c142" d="M1 10H31V22H1z"></path>
    <path d="M5,4H27c2.208,0,4,1.792,4,4v3H1v-3c0-2.208,1.792-4,4-4Z" fill="#a0251e"></path>
    <path
      d="M5,21H27c2.208,0,4,1.792,4,4v3H1v-3c0-2.208,1.792-4,4-4Z"
      transform="rotate(180 16 24.5)"
      fill="#a0251e"
    ></path>
    <path
      d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
      opacity=".15"
    ></path>
    <path
      d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
      fill="#fff"
      opacity=".2"
    ></path>
    <path
      d="M12.614,13.091c.066-.031,.055-.14-.016-.157,.057-.047,.02-.15-.055-.148,.04-.057-.012-.144-.082-.13,.021-.062-.042-.127-.104-.105,.01-.068-.071-.119-.127-.081,.004-.068-.081-.112-.134-.069-.01-.071-.11-.095-.15-.035-.014-.068-.111-.087-.149-.028-.027-.055-.114-.057-.144-.004-.03-.047-.107-.045-.136,.002-.018-.028-.057-.044-.09-.034,.009-.065-.066-.115-.122-.082,.002-.07-.087-.111-.138-.064-.013-.064-.103-.087-.144-.036-.02-.063-.114-.075-.148-.017-.036-.056-.129-.042-.147,.022-.041-.055-.135-.031-.146,.036-.011-.008-.023-.014-.037-.016,.006-.008,.01-.016,.015-.025h.002c.058-.107,.004-.256-.106-.298v-.098h.099v-.154h-.099v-.101h-.151v.101h-.099v.154h.099v.096c-.113,.04-.169,.191-.11,.299h.002c.004,.008,.009,.017,.014,.024-.015,.002-.029,.008-.04,.017-.011-.067-.106-.091-.146-.036-.018-.064-.111-.078-.147-.022-.034-.057-.128-.046-.148,.017-.041-.052-.131-.028-.144,.036-.051-.047-.139-.006-.138,.064-.056-.033-.131,.017-.122,.082-.034-.01-.072,.006-.091,.034-.029-.047-.106-.049-.136-.002-.03-.054-.117-.051-.143,.004-.037-.059-.135-.04-.149,.028-.039-.06-.14-.037-.15,.035-.053-.043-.138,0-.134,.069-.056-.038-.137,.013-.127,.081-.062-.021-.125,.044-.104,.105-.05-.009-.096,.033-.096,.084h0c0,.017,.005,.033,.014,.047-.075-.002-.111,.101-.055,.148-.071,.017-.082,.125-.016,.157-.061,.035-.047,.138,.022,.154-.013,.015-.021,.034-.021,.055h0c0,.042,.03,.077,.069,.084-.023,.048,.009,.11,.06,.118-.013,.03-.012,.073-.012,.106,.09-.019,.2,.006,.239,.11-.015,.068,.065,.156,.138,.146,.06,.085,.133,.165,.251,.197-.021,.093,.064,.093,.123,.118-.013,.016-.043,.063-.055,.081,.024,.013,.087,.041,.113,.051,.005,.019,.004,.028,.004,.031,.091,.501,2.534,.502,2.616-.001v-.002s.004,.003,.004,.004c0-.003-.001-.011,.004-.031l.118-.042-.062-.09c.056-.028,.145-.025,.123-.119,.119-.032,.193-.112,.253-.198,.073,.01,.153-.078,.138-.146,.039-.104,.15-.129,.239-.11,0-.035,.002-.078-.013-.109,.044-.014,.07-.071,.049-.115,.062-.009,.091-.093,.048-.139,.069-.016,.083-.12,.022-.154Zm-.296-.114c0,.049-.012,.098-.034,.141-.198-.137-.477-.238-.694-.214-.002-.009-.006-.017-.011-.024,0,0,0-.001,0-.002,.064-.021,.074-.12,.015-.153,0,0,0,0,0,0,.048-.032,.045-.113-.005-.141,.328-.039,.728,.09,.728,.393Zm-.956-.275c0,.063-.02,.124-.054,.175-.274-.059-.412-.169-.717-.185-.007-.082-.005-.171-.011-.254,.246-.19,.81-.062,.783,.264Zm-1.191-.164c-.002,.05-.003,.102-.007,.151-.302,.013-.449,.122-.719,.185-.26-.406,.415-.676,.73-.436-.002,.033-.005,.067-.004,.101Zm-1.046,.117c0,.028,.014,.053,.034,.069,0,0,0,0,0,0-.058,.033-.049,.132,.015,.152,0,0,0,.001,0,.002-.005,.007-.008,.015-.011,.024-.219-.024-.495,.067-.698,.206-.155-.377,.323-.576,.698-.525-.023,.015-.039,.041-.039,.072Zm3.065-.115s0,0,0,0c0,0,0,0,0,0,0,0,0,0,0,0Zm-3.113,1.798v.002s-.002,0-.003,.002c0-.001,.002-.003,.003-.003Z"
      fill="#9b8028"
    ></path>
    <path
      d="M14.133,16.856c.275-.65,.201-.508-.319-.787v-.873c.149-.099-.094-.121,.05-.235h.072v-.339h-.99v.339h.075c.136,.102-.091,.146,.05,.235v.76c-.524-.007-.771,.066-.679,.576h.039s0,0,0,0l.016,.036c.14-.063,.372-.107,.624-.119v.224c-.384,.029-.42,.608,0,.8v1.291c-.053,.017-.069,.089-.024,.123,.007,.065-.058,.092-.113,.083,0,.026,0,.237,0,.269-.044,.024-.113,.03-.17,.028v.108s0,0,0,0v.107s0,0,0,0v.107s0,0,0,0v.108s0,0,0,0v.186c.459-.068,.895-.068,1.353,0v-.616c-.057,.002-.124-.004-.17-.028,0-.033,0-.241,0-.268-.054,.008-.118-.017-.113-.081,.048-.033,.034-.108-.021-.126v-.932c.038,.017,.073,.035,.105,.053-.105,.119-.092,.326,.031,.429l.057-.053c.222-.329,.396-.743-.193-.896v-.35c.177-.019,.289-.074,.319-.158Z"
      fill="#9b8028"
    ></path>
    <path
      d="M8.36,16.058c-.153-.062-.39-.098-.653-.102v-.76c.094-.041,.034-.115-.013-.159,.02-.038,.092-.057,.056-.115h.043v-.261h-.912v.261h.039c-.037,.059,.039,.078,.057,.115-.047,.042-.108,.118-.014,.159v.873c-.644,.133-.611,.748,0,.945v.35c-.59,.154-.415,.567-.193,.896l.057,.053c.123-.103,.136-.31,.031-.429,.032-.018,.067-.036,.105-.053v.932c-.055,.018-.069,.093-.021,.126,.005,.064-.059,.089-.113,.081,0,.026,0,.236,0,.268-.045,.024-.113,.031-.17,.028v.401h0v.215c.459-.068,.895-.068,1.352,0v-.186s0,0,0,0v-.108s0,0,0,0v-.107s0,0,0,0v-.107s0,0,0,0v-.108c-.056,.002-.124-.004-.169-.028,0-.033,0-.241,0-.269-.055,.008-.119-.018-.113-.083,.045-.034,.03-.107-.024-.124v-1.29c.421-.192,.383-.772,0-.8v-.224c.575,.035,.796,.314,.653-.392Z"
      fill="#a0251e"
    ></path>
  </svg>
)

const UKFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#071b65"></rect>
    <path
      d="M5.101,4h-.101c-1.981,0-3.615,1.444-3.933,3.334L26.899,28h.101c1.981,0,3.615-1.444,3.933-3.334L5.101,4Z"
      fill="#fff"
    ></path>
    <path d="M22.25,19h-2.5l9.934,7.947c.387-.353,.704-.777,.929-1.257l-8.363-6.691Z" fill="#b92932"></path>
    <path d="M1.387,6.309l8.363,6.691h2.5L2.316,5.053c-.387,.353-.704,.777-.929,1.257Z" fill="#b92932"></path>
    <path
      d="M5,28h.101L30.933,7.334c-.318-1.891-1.952-3.334-3.933-3.334h-.101L1.067,24.666c.318,1.891,1.952,3.334,3.933,3.334Z"
      fill="#fff"
    ></path>
    <rect x="13" y="4" width="6" height="24" fill="#fff"></rect>
    <rect x="1" y="13" width="30" height="6" fill="#fff"></rect>
    <rect x="14" y="4" width="4" height="24" fill="#b92932"></rect>
    <rect x="14" y="1" width="4" height="30" transform="translate(32) rotate(90)" fill="#b92932"></rect>
    <path d="M28.222,4.21l-9.222,7.376v1.414h.75l9.943-7.94c-.419-.384-.918-.671-1.471-.85Z" fill="#b92932"></path>
    <path d="M2.328,26.957c.414,.374,.904,.656,1.447,.832l9.225-7.38v-1.408h-.75L2.328,26.957Z" fill="#b92932"></path>
    <path
      d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
      opacity=".15"
    ></path>
    <path
      d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
      fill="#fff"
      opacity=".2"
    ></path>
  </svg>
)

const testimonials = [
  {
    name: "Ahmed",
    location: "UAE",
    flag: <UAEFlag />,
    property: "Downtown Dubai Apartment",
    rating: 5,
    text: "Victoria's expertise in the Dubai market is unmatched. She helped me secure a prime property in Downtown Dubai with excellent ROI potential. Her strategic approach and market insights made all the difference.",
  },
  {
    name: "Sarah",
    location: "UK",
    flag: <UKFlag />,
    property: "Palm Jumeirah Villa",
    rating: 5,
    text: "Working with Victoria was exceptional. She understood my investment goals perfectly and found me a stunning villa on Palm Jumeirah. The entire process was smooth, professional, and transparent.",
  },
  {
    name: "Dmitri",
    location: "Russia",
    flag: <RussiaFlag />,
    property: "Business Bay Penthouse",
    rating: 5,
    text: "Victoria's multilingual service and deep market knowledge made my property investment journey seamless. She secured an off-plan penthouse with incredible growth potential. Highly recommended!",
  },
  {
    name: "Fatima",
    location: "UAE",
    flag: <UAEFlag />,
    property: "Dubai Marina Apartment",
    rating: 5,
    text: "Victoria doesn't just sell properties - she builds relationships. Her honest advice and strategic thinking helped me make the right investment decision. The returns have exceeded my expectations.",
  },
  {
    name: "Michael",
    location: "Singapore",
    flag: <SingaporeFlag />,
    property: "JVC Townhouse",
    rating: 5,
    text: "As a first-time investor in Dubai, Victoria guided me through every step. Her expertise in emerging areas like JVC proved invaluable. The property has already appreciated significantly.",
  },
  {
    name: "Elena",
    location: "Spain",
    flag: <SpainFlag />,
    property: "Dubai Maritime City",
    rating: 5,
    text: "Victoria's ability to identify high-potential properties is remarkable. She recommended Dubai Maritime City when it was still emerging. Now it's one of the hottest investment areas.",
  },
]

export default function TestimonialsSection() {
  const { t, isRTL, language } = useI18n()

  return (
    <section className="py-2 bg-transparent" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-vl-yellow mb-6 font-heading">
            {language === "en"
              ? "Trusted by Global Investors"
              : language === "ar"
                ? "موثوقة من قبل عملاء عالميين"
                : "Доверие мировых Виктории доверяют инвесторы со всего мира"}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {language === "en"
              ? "Hear from clients who chose strategy, discretion, and results."
              : language === "ar"
                ? "استمع إلى العملاء الذين اختاروا الاستراتيجية والنتائج"
                : "Отзывы клиентов, которые выбрали стратегию и результат"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-transparent relative overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer group border-2 hover:border-vl-yellow/30"
            >
              <CardContent className="p-6">
               <div
  className={`absolute top-4 ${
language === "ar" ? "left-4 scale-x-[-1]" : "right-4"
  } text-vl-yellow opacity-20 group-hover:opacity-100 transition-opacity duration-300`}
>
                  <Image src="/comma_sign.svg" alt="Quote" width={32} height={32} />
                </div>

                <div className="flex items-center mb-4">
                  <div
  className={`w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-4xl hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:from-vl-yellow/10 group-hover:to-vl-blue/10 border-2 border-transparent group-hover:border-vl-yellow/20 ${
    language === "ar" ? "ml-4" : "mr-5"
  }`}
>
                    <span>{testimonial.flag}</span>
                  </div>
                  <div className="group-hover:translate-x-1 transition-transform duration-300">
                    <h4 className="font-semibold text-vl-yellow text-lg group-hover:text-vl-yellow/80 transition-colors duration-300">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600 group-hover:text-white transition-colors duration-300">
                      {testimonial.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-vl-yellow text-vl-yellow group-hover:scale-110 transition-transform duration-300 hover:animate-pulse"
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>

                <p className="text-gray-600 mb-4 leading-relaxed group-hover:text-white-700 transition-colors duration-300">
                  "{testimonial.text}"
                </p>

                <div className="bg-vl-yellow/10 p-3 rounded-lg group-hover:bg-vl-yellow/20 transition-all duration-300 border border-transparent group-hover:border-vl-yellow/30">
                  <p className="text-sm font-medium text-vl-yellow group-hover:text-vl-yellow/90 transition-colors duration-300">
                    {t("testimonials.property")}: {testimonial.property}
                  </p>
                </div>

                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-vl-yellow/5 to-vl-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-4">
          <div className="bg-vl-blue rounded-2xl p-8 max-w-4xl mx-auto hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <h3 className="text-2xl font-bold text-white mb-4">
              {language === "en"
                ? "Join 500+ Satisfied Investors"
                : language === "ar"
                  ? "انضم إلى 500+ مستثمر ناجح"
                  : "Присоединяйтесь к 500+ успешным инвесторам"}
            </h3>
            <p className="text-white/90 mb-6">
              {language === "en"
                ? "Ready to start your Dubai property investment journey? Let me help you achieve your goals."
                : language === "ar"
                  ? <>مستعد لتدخل عالم الاستثمار العقاري الذكي؟ سأرشدك بخبرة تتجاوز 15 عاماً لتجنب المخاطر، وتوفير الوقت، وتضاعف عوائدك.
</>
                  : <>Готовы войти в мир умных инвестиций в недвижимость?<br/>
Я проведу вас с опытом более 15 лет, помогу избежать рисков, сэкономить время и увеличить доходность.
</>}
            </p>
            <div className="flex flex-col sm:flex-row gap-12 justify-center">
              <div className="text-center hover:scale-110 transition-transform duration-300">
            
              <div className="text-center hover:scale-110 transition-transform duration-300">
                 <div className="text-white/80">
                  {language === "en" ? "More than" : language === "ar" ? "أكثر من " : "Более"}
                </div>
                <div className="text-3xl font-bold text-vl-yellow">
                    {language === "en" ? "585 Proprties Sold" : language === "ar" ? "585 صفقة عقارية " : "585 сделок с недвижимостью"}
                </div>
               <div className="text-white/80 pt-4">
                  {language === "en"
                    ? "Total Value"
                    : language === "ar"
                      ? "بقيمة"
                      : "Общей стоимостью"}
                </div>
                <div className="text-3xl font-bold text-vl-yellow"> {language === "en"
                    ? "AED 1.7B+"
                    : language === "ar"
                      ? "1.7 مليار درهم إماراتي"
                      : "1,7 млрд дирхамов ОАЭ"}</div>
                
              </div>
              
              </div>
              
            </div>
            
          </div>
          
        </div>
      </div>
    </section>
  )
}
