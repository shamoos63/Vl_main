"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"


export type Language = "en" | "ar" | "ru"

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isRTL: boolean
}

// Create a default context value to prevent the "must be used within Provider" error
const defaultContextValue: I18nContextType = {
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
  isRTL: false,
}

const I18nContext = createContext<I18nContextType>(defaultContextValue)

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    // Return default values if context is not available (during SSR)
    return defaultContextValue
  }
  return context
}

interface I18nProviderProps {
  children: React.ReactNode
}

// Import translations directly
const translations = {
  en: {

     // Timeline Section
  "timeline.title": "Professional Journey",
  "timeline.subtitle": "A timeline of dedication, growth, and excellence in Real Estate investment",
  "timeline.2005.title": "Academic Foundation",
  "timeline.2005.description": "Graduated with dual Bachelor of Science degrees from Herzen State Pedagogical University and Baltic University of Foreign Languages, establishing a strong analytical foundation.",
  "timeline.2010.title": "Real Estate Entry",
  "timeline.2010.description": "Started at Select Property Group (UK & UAE), entering Real Estate with focus on residential sales and building strong market expertise.",
  "timeline.2012.title": "Dubai Market Expansion",
  "timeline.2012.description": "Became a trusted advisor, consistently exceeding targets and aligning opportunities with client goals.",
  "timeline.2015.title": "Investment Specialization",
  "timeline.2015.description": " Awarded MVP (Most Valuable Person) at Select for outstanding performance and client service.",
  "timeline.2018.title": "Global Client Base",
  "timeline.2018.description": "Built an international client base across 30+ countries, offering tailored services in English and Russian.",
  "timeline.2020.title": "Wealth Creation",
  "timeline.2020.description": "Shifted focus to investment strategy, specializing in off-market deals and long-term wealth creation.",
  "timeline.2023.title": "Market Excellence",
  "timeline.2023.description": "Surpassed 500 successful transactions, trusted by private investors, family offices, and institutions.",
  "timeline.2025.title": "Industry Leadership",
  "timeline.2025.description": "Reached 585+ properties sold, with AED 1.7B+ in transactions. Recognized as a leading Real Estate investment strategist in Dubai & the UK.",
  "timeline.quote": "Every milestone represents not just professional growth, but a commitment to excellence and client success that defines my approach to Real Estate investment",
  "timeline.signature.name": "Victoria Lancaster",
  "timeline.signature.title": "Investment Director | Licensed Real Estate Advisor",
  "about.expertise.quote2": "Let’s start a conversation built on trust and data, tailored to your goals. Enter your details, and Victoria will personally reach out to guide your next step.",
"footer.contact.phone": "00971-4-2794-800",
"footer.contact.address": "Dubai, UAE",
// Blog Search
    "blog.search.placeholder":"Search blog posts...",
    "blog.no.posts": "No blog posts found",
    "blog.search.no.results": "No results found",
    "blog.categories.all": "All Categories",
    "blog.categories.market.analysis": "Market Analysis",
    "blog.categories.investment.guide": "Investment Guide",
    "blog.categories.investment.tips": "Investment Tips",
    "blog.categories.investment.strategy": "Investment Strategy",
    "blog.categories.area.guide": "Area Guide",
    "blog.categories.legal.guide": "Legal Guide",
    "blog.feature.1": "Market Analysis",
    "blog.feature.2": "Investment Guide",
    "blog.feature.3": "Investment Tips",
    "blog.read.more": "Read More",
    "blog.search.button": "Search",

    // Contact Form
    "contact.success.title": "Message Sent Successfully!",
    "contact.success.message": "Thank you for contacting me. I will review your message and get back to you within 24 hours.",
    "contact.success.contact.title": "Contact Information",
    "contact.success.new.evaluation": "Submit New Message",

     // Areas
     "areas.page.title": "Explore Dubai's Key Investment Areas",
     "areas.page.subtitle": "Handpicked insights to help you choose with confidence",
     "areas.description.1": "Dubai’s Real Estate market is diverse, and not every area suits every investor",
     "areas.description.2": "Here, I share the areas I trust, with an honest perspective on",
     "areas.feature.1": "Strengths & Potential",
     "areas.feature.2": "Risks to Consider", 
     "areas.feature.3": "Who the Area Fits Best",
     "areas.description.3": "Whether you're focused on yield, growth, or lifestyle, this will help you make the right move",
     
     // Area Details
     "areas.dubai.marina.name": "Dubai Marina",
     "areas.dubai.marina.description": "Waterfront living with stunning views and world-class amenities",
     "areas.downtown.dubai.name": "Downtown Dubai",
     "areas.downtown.dubai.description": "The heart of the city with iconic landmarks and luxury shopping",
     "areas.palm.jumeirah.name": "Palm Jumeirah", 
     "areas.palm.jumeirah.description": "Exclusive island living with private beaches and luxury resorts",
     "areas.business.bay.name": "Business Bay",
     "areas.business.bay.description": "Modern business district with high-rise living and canal views",
     "areas.properties.label": "Properties",
     "areas.growth.label": "YoY Growth",

    // Evaluation
  "evaluation.form.title": "Property Evaluation Tool",
  "evaluation.page.title": "Property Evaluation & Selling Support",
  "evaluation.page.subtitle":
    "Thinking of your next move? Know your property’s true value and its potential",
  "evaluation.description.1": "I offer a confidential, data-driven evaluation for property owners in Dubai and the UK",
  "evaluation.description.1+": "Whether you're planning to sell, rent, or simply want clarity",
  "evaluation.description.2": "You'll receive strategic insight, not just a number",
  "evaluation.description.3": "Backed by 15+ years of experience, your evaluation will include:",
  "evaluation.feature.1": "Accurate Market Value",
  "evaluation.feature.2": "Investment and Income Potential",
  "evaluation.feature.3": "Selling Strategy",
  "evaluation.feature.3+": "(if applicable)",
  "evaluation.description.4":
    "Submit your details below, I will personally evaluate your property",
  "evaluation.stats.1": "Properties Sold",
  "evaluation.stats.2": "Total Value",
  "evaluation.stats.3": "Years of Experience",
  "evaluation.contact.info": "Contact Information",
  "evaluation.name": "Full Name",
  "evaluation.name.placeholder": "Enter your full name",
  "evaluation.email": "Email Address",
  "evaluation.email.placeholder": "Enter your email",
  "evaluation.phone": "Phone Number",
  "evaluation.phone.placeholder": "Enter your phone number",
  "evaluation.property.type": "Property Type",
  "evaluation.select.type": "Select property type",
  "evaluation.location": "Location",
  "evaluation.select.location": "Select location",
  "evaluation.bedrooms": "Bedrooms",
  "evaluation.select.beds": "Select bedrooms",
  "evaluation.bathrooms": "Bathrooms",
  "evaluation.select.baths": "Select bathrooms",
  "evaluation.area": "Area (sq ft)",
  "evaluation.area.placeholder": "e.g., 1200",
  "evaluation.condition": "Property Condition",
  "evaluation.select.condition": "Select condition",
  "evaluation.condition.excellent": "Excellent",
  "evaluation.condition.good": "Good",
  "evaluation.condition.fair": "Fair",
  "evaluation.condition.renovation": "Needs Renovation",
  "evaluation.year.built": "Year Built",
  "evaluation.year.placeholder": "e.g., 2020",
  "evaluation.amenities": "Amenities",
  "evaluation.amenities.placeholder": "e.g., Pool, Gym, Parking",
  "evaluation.description": "Additional Description",
  "evaluation.description.placeholder": "Any additional details about your property...",
  "evaluation.button": "Get Property Evaluation",
  "evaluation.success.title": "Evaluation Submitted Successfully!",
  "evaluation.success.message":
    "Thank you for submitting your property evaluation request. Our expert team will review your property details and contact you within 24 hours with a comprehensive market analysis.",
  "evaluation.success.contact.title": "Contact Information",
  "evaluation.success.new.evaluation": "Submit New Evaluation",

    // Navigation
    "nav.home": "Home",
    "nav.properties": "Properties",
    "nav.areas": "Areas",
    "nav.evaluation": "Property Evaluation",
    "nav.blog": "Blog",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.search.placeholder": "Search properties...",
    "nav.language": "Language",
    // AI Chat Assistant
    "ai.chat.assistant.title": "AI Chat Assistant",
    "ai.chat.assistant.subtitle": "Ask me anything about property investment in Dubai",
    "ai.chat.assistant.input.placeholder": "Ask me anything about property investment in Dubai",
    "ai.chat.assistant.button": "Send",
    "ai.chat.assistant.messages": "Messages",
    "ai.chat.assistant.loading": "Loading...",
    "ai.chat.assistant.error": "Error",
    "ai.chat.title": "Ask Victoria",
    "ai.chat.placeholder": "Ask me anything about property investment in Dubai",

    // Hero Section
    "hero.title": "Dubai 2025",
    "hero.title.highlight": "The Strategy of Wealth",
    "hero.subtitle": "Understand the Market | Access Exclusives | Build Lasting Wealth",
    "hero.search.button": "Search",
    "hero.stats.properties": "Properties Sold",
    "hero.stats.value": "Total Value",
    "hero.stats.experience": "Years of Experience",
    "hero.stats.satisfaction": "Client Satisfaction",

    // Search Form
    "search.property.type": "Property Type",
    "search.location": "Location",
    "search.price.range": "Price Range",
    "search.bedrooms": "Bedrooms",
    "search.apartment": "Apartment",
    "search.villa": "Villa",
    "search.townhouse": "Townhouse",
    "search.penthouse": "Penthouse",
    "search.1.bedroom": "1 Bedroom",
    "search.2.bedrooms": "2 Bedrooms",
    "search.3.bedrooms": "3 Bedrooms",
    "search.4plus.bedrooms": "4+ Bedrooms",

    // Locations
    "location.dubai.marina": "Dubai Marina",
    "location.downtown": "Downtown Dubai",
    "location.palm.jumeirah": "Palm Jumeirah",
    "location.jvc": "Jumeirah Village Circle",
    "location.business.bay": "Business Bay",
    "location.dubai.maritime": "Dubai Maritime City",
    "location.dubai.other": "Other Areas",

"property.status.ready" : "Ready",
"property.status.OffPlan" : "Off-plan",
"property.status.ForRent" : "For rent",
"property.status.Sold" : "Sold",

    // Property Evaluation - Complete Set
    "evaluation.title": "Property Evaluation Tool",
    "evaluation.subtitle": "Get a professional property assessment from Victoria's expert team",
    "evaluation.hero.title": "Property Evaluation Tool",
    "evaluation.hero.subtitle":
      "Get an instant estimate of your property's value with Victoria's expert evaluation system",
    "evaluation.hero.properties.evaluated": "Properties Evaluated",
    "evaluation.hero.total.value": "Total Value Assessed",
    "evaluation.hero.years.experience": "Years Experience",
   
    // Filter Panel Translations - Complete Set
    "filters.title": "Filters",
    "filters.show": "Show Filters",
    "filters.hide": "Hide Filters",
    "filters.clear": "Clear All",
    "filters.apply": "Apply",
    "filters.reset": "Reset",
    "filters.search": "Search",
    "filters.search.placeholder": "Search properties...",
    "filters.property.type": "Property Type",
    "filters.price.range": "Price Range",
    "filters.bedrooms": "Bedrooms",
    "filters.bedrooms.range": "Bedrooms",
    "filters.bathrooms": "Bathrooms",
    "filters.bathrooms.range": "Bathrooms",
    "filters.area": "Area (sq ft)",
    "filters.location": "Location",
    "filters.status": "Status",
    "filters.amenities": "Amenities",
    "filters.features": "Features",
    "filters.tabs.basic": "Basic",
    "filters.tabs.advanced": "Advanced",

    // Sort Options
    "filters.sort.label": "Sort By",
    "filters.sort.default": "Default",
    "filters.sort.price-asc": "Price: Low to High",
    "filters.sort.price-desc": "Price: High to Low",
    "filters.sort.newest": "Newest First",
    "filters.sort.oldest": "Oldest First",
    "filters.sort.area.large": "Area: Large to Small",
    "filters.sort.area.small": "Area: Small to Large",

    // Filter Values
    "filters.any": "Any",
    "filters.studio": "Studio",
    "filters.1.bed": "1 Bedroom",
    "filters.2.bed": "2 Bedrooms",
    "filters.3.bed": "3 Bedrooms",
    "filters.4.bed": "4 Bedrooms",
    "filters.5plus.bed": "5+ Bedrooms",
    "filters.1.bath": "1 Bathroom",
    "filters.2.bath": "2 Bathrooms",
    "filters.3.bath": "3 Bathrooms",
    "filters.4plus.bath": "4+ Bathrooms",

    // Status Options
    "filters.status.for-sale": "For Sale",
    "filters.status.for-rent": "For Rent",
    "filters.status.offplan": "Off Plan",
    "filters.ready": "Ready",
    "filters.offplan": "Off Plan",
    "filters.featured": "Featured",
    "filters.luxury": "Luxury",

    // Property Types
    "filters.property.types.villa": "Villa",
    "filters.property.types.apartment": "Apartment",
    "filters.property.types.penthouse": "Penthouse",
    "filters.property.types.mansion": "Mansion",
    "filters.property.types.townhouse": "Townhouse",

    // Amenities
    "filters.amenities.pool": "Swimming Pool",
    "filters.amenities.garden": "Garden",
    "filters.amenities.garage": "Garage",
    "filters.amenities.balcony": "Balcony",
    "filters.amenities.gym": "Gym",
    "filters.amenities.security": "Security",

    // Property Listings
    "properties.title": "Featured Properties",
    "properties.subtitle":
      "Discover exceptional properties handpicked by Victoria Lancaster for their investment potential and luxury appeal",
    "properties.filter.all": "All Properties",
    "properties.filter.featured": "Featured",
    "properties.filter.ready": "Ready",
    "properties.filter.offplan": "Off-plan",
    "properties.view.details": "View Details",
    "properties.schedule.tour": "Schedule Tour",
    "properties.view.all": "View All Properties",
    "properties.status.ready": "Ready",
    "properties.status.offplan": "Off-plan",
    "properties.status.featured": "Featured",
    "properties.found": "properties found",
    "properties.no.results": "No Properties Found",
    "properties.try.different.filters": "Try adjusting your search filters to see more results.",
    "properties.suggestions": "Suggestions: Try expanding your price range, location, or property type filters.",
    "properties.showing": "Showing",
    "properties.of": "of",
    "properties.results": "results",
    "properties.end.of.results": "Every property here meets strict criteria to ensure a safe investment",
    "properties.page.subtitle2": "No noise, no random offers, only handpicked Real Estate opportunities",

    // Properties Page Specific
    "properties.page.title": "Personally Selected",
    "properties.page.title2": "Strategically Positioned",
    "properties.page.subtitle": "Real Estate opportunities",
    "properties.listings.title": "Property Listings",
    "properties.listings.subtitle": "Browse our curated selection of premium properties",
    "properties.results.title": "Search Results",
    "properties.our.listings": "Our Property Listings",

    // Properties View
    "properties.view.grid": "Grid View",
    "properties.view.map": "Map View",

    // Properties Detail Page
    "properties.back.to.listings": "Back to Properties",
    "properties.watch.video": "Watch Video",
    "properties.tab.overview": "Overview",
    "properties.tab.features": "Features",
    "properties.tab.amenities": "Amenities",
    "properties.overview": "Property Overview",
    "properties.bedrooms": "Bedrooms",
    "properties.bathrooms": "Bathrooms",
    "properties.area": "Area",
    "properties.location": "Location",
    "properties.features": "Property Features",
    "properties.amenities": "Building Amenities",
    "properties.contact.agent": "Contact",
    "properties.contact.now": "Contact Now",
    "properties.schedule.viewing": "Schedule Viewing",
    "properties.available.for.viewing": "Available for viewing",
    "properties.similar": "Similar Properties",

    "contact.page.title": "Contact me",
  "contact.page.subtitle": "Get in touch for personalized property consultation",
  "contact.form.title": "Send me a message",
  "contact.first.name": "First Name",
  "contact.first.name.placeholder": "Enter your first name",
  "contact.last.name": "Last Name",
  "contact.last.name.placeholder": "Enter your last name",
  "contact.email": "Email",
  "contact.email.placeholder": "Enter your email address",
  "contact.phone": "Phone",
  "contact.phone.placeholder": "Enter your phone number",
  "contact.budget": "Budget Range",
  "contact.budget.placeholder": "e.g., $1M - $2M",
  "contact.message": "Message",
  "contact.message.placeholder": "Tell us about your property requirements...",
  "contact.send": "Send Message",
  "contact.info.title": "Contact Information",
  "contact.info.phone": "Phone",
  "contact.info.email": "Email",
  "contact.info.office": "Office",
  "contact.info.office.location": "Dubai, Marina Plaza, Office 2701",
  "contact.info.hours": "Business Hours",
  "contact.info.hours.time": "Monday - Friday: 9:00 AM - 6:00 PM",
  "contact.location.title": "Our Location",
    
    // Property Card Translations
    "property.tour": "Tour",
    "property.featured": "Featured",
    "property.new": "New",
    "property.share": "Share Property",
    "property.share.success": "Shared successfully",
    "property.share.success.desc": "Property link has been shared",
    "property.link.copied": "Link copied",
    "property.link.copied.desc": "Property link has been copied to clipboard",
    "property.share.error": "Share failed",
    "property.share.error.desc": "Unable to share property. Please try again.",
    "property.remove.favorite": "Remove from Favorites",
    "property.add.favorite": "Add to Favorites",
    "property.removed.favorites": "Removed from favorites",
    "property.removed.favorites.desc": "Property removed from your favorites",
    "property.added.favorites": "Added to favorites",
    "property.added.favorites.desc": "Property added to your favorites",
    "property.favorite.error": "Error",
    "property.favorite.error.desc": "Unable to update favorites. Please try again.",
    "property.calling.agent": "Calling agent",
    "property.calling": "Calling",
    "property.email.opened": "Email opened",
    "property.email.opened.desc": "Email client opened with property details",
    "property.contact.form": "Contact form",
    "property.contact.form.desc": "Contact form will be available soon",
    "property.video.tour": "Video tour",
    "property.video.tour.desc": "Opening video tour in new tab",
    "property.gallery": "Photo Gallery",
    "property.bedrooms": "Bedrooms",
    "property.bathrooms": "Bathrooms",
    "property.sqft": "Sq Ft",
    "property.parking": "Parking Spaces",
    "property.furnished": "Furnished",
    "property.pet.friendly": "Pet Friendly",
    "property.security": "24/7 Security",
    "property.agent": "Property Agent",
    "property.call.agent": "Call Agent",
    "property.email.agent": "Email Agent",
    "property.updated": "Updated",
    "property.view.details": "View Details",
    "property.contact": "Contact",

    // Map related translations
    "properties.map.available": "Available Properties",
    "properties.map.selected": "Selected Property",
    "properties.map.properties": "Properties",

    // About
  "about.page.title": "About Victoria",
  "about.page.subtitle": "Where trust, insight, and performance come together",
  "about.quote": "To me, Real Estate is about building futures, not just",
  "about.quote+": "deals.   I treat every home or investment with the same care I'd give my own.",
  "about.name": "Victoria Lancaster",
   "about.tname":"Real Estate Investment Director",
  "about.title": "Investment Director  | Real Estate Strategist | Licensed Advisor",
  "about.section1.title": "15+ Years of Market Excellence",
  "about.section1.text1": "With over 15 years of experience across the UAE and UK markets, Victoria Lancaster is a name synonymous with trust, results, and long-term vision.",
  "about.section1.text2": "As Investment Director at Select Property, she has successfully closed over 585 Real Estate transactions, exceeding AED 1.7 billion in value.",
  "about.section1.updated": "Last updated: June 2025",
  "about.section2.title": "A Portfolio",
  "about.section2.Subtitle": "Built on Insight",
  "about.section2.text1": "Victoria's portfolio spans luxury residential, off-plan, and buy-to-let investments, all carefully curated to build secure, high-yielding portfolios for global clients.",
  "about.section2.text2": "She is known for her sharp market insight and ability to spot opportunities before they hit the mainstream.",
  "about.section2.text3": "Clients choose her for her clarity, precision, and data-driven mindset, knowing that Real Estate, in her world, is not just a transaction, but a foundation for wealth, lifestyle, and legacy.",
  "about.section3.title": "Her Clients, Her Values",
  "about.section3.text1": "Victoria works exclusively with selected developers and serious clients. Every portfolio she builds is backed by due diligence, long-term strategy, and a clear investment framework.",
  "about.section3.text2": "Whether you're investing or searching for a home, she brings the same meticulous care, honesty, and commitment to results.",
  "about.section3.text3": "Outside of work, Victoria is a proud wife, mother, and animal lover. Her grounded home life brings balance and clarity, the same values she brings to every client relationship.",
  "about.academic.title": "Academic & Professional Credibility",
  "about.academic.degree.title": "Dual Bachelor of Science degrees from:",
  "about.academic.degree.1": "Herzen State Pedagogical University (2003 - 2005)",
  "about.academic.degree.2": "Baltic University of Foreign Languages (2000-2005)",
  "about.professional.title": "Professional Credentials:",
  "about.professional.license": "Licensed by the Dubai Land Department (BRN 27147)",
  "about.academic.text1": "Victoria combines a global academic foundation with an analytical, results-driven approach, treating each investment with the same care and discernment as if it were her own.",
  "about.academic.text2": "She is known for her direct, no-fluff communication style, a quality her clients value for its transparency and efficiency.",
  "about.excellence.title": "Professional Excellence",
  "about.excellence.text": "Great investments aren't rushed, they're chosen with purpose, timing, and clarity. Victoria brings meticulous attention to detail and unwavering commitment to every client relationship.",
  "about.excellence.quote": "Great investments aren't rushed, they're chosen with purpose, timing, and clarity",
  "about.expertise.title": "Areas of Expertise",
  "about.expertise.quote": "I don't just sell property. I strategize wealth.",
  "about.expertise.description": "Here's how I support investors in building Real Estate portfolios with purpose and clarity:",
  "about.expertise.1": "Off-plan Investments (Dubai & UK)",
  "about.expertise.2": "Selected Residential Properties",
  "about.expertise.3": "Buy-to-Let Strategy",
  "about.expertise.4": "Portfolio Diversification",
  "about.expertise.5": "Investor Onboarding & Consultation",
  "about.expertise.6": "Market Forecasting & Analytics",
  "about.offices.title": "Offices",
  "about.office.dubai": "Dubai, United Arab Emirates",
  "about.office.manchester": "Manchester, United Kingdom",
  "about.cta.title": "Ready to take the next step?",
  "about.cta.text": "Let's start a conversation built on trust, guided by insight, and tailored to your goals.",
  "about.cta.text1": "Share your details below",
  "about.cta.text2": "Victoria will personally review how she can support your next move",
  "about.cta.button": "Send Message",
  "about.achievements.1.number": "585+",
  "about.achievements.1.title": "Properties Sold",
  "about.achievements.1.description": "Successfully closed transactions worth over AED 1.7 billion",
  "about.achievements.2.number": "30+",
  "about.achievements.2.title": "Countries Served",
  "about.achievements.2.description": "Global clientele from diverse international markets",
  "about.achievements.3.number": "15+",
  "about.achievements.3.title": "Years Experience",
  "about.achievements.3.description": "Proven track record in UAE and UK Real Estate markets",
  "about.achievements.4.number": "3",
  "about.achievements.4.title": "Languages",
  "about.achievements.4.description": "Fluent in English, Arabic, and Russian",


    // FAQ Section
    "faq.title": "Frequently Asked Questions",
    "faq.subtitle": "with Victoria Lancaster",
    "faq.quote":
      '"I chose these questions because they reflect what truly matters to investors."',
       "faq.quote2":
      '"I  believe transparency builds trust, and when you have clarity, your investment decisions become smarter and more secure."',
    "faq.quote.author": "Victoria Lancaster",

    // Testimonials Section
    "testimonials.title": "Client Success Stories",
    "testimonials.subtitle": "Hear from investors who trusted Victoria Lancaster with their Dubai property journey",
    "testimonials.join.title": "Join 585+ Satisfied Investors",
    "testimonials.join.subtitle":
      "Ready to start your Dubai property investment journey? Let Victoria help you achieve your goals.",
    "testimonials.total.value": "Total Transaction Value",
    "testimonials.years.experience": "Years Experience",
    "testimonials.client.satisfaction": "Client Satisfaction",

    // Contact Page
    "contact.title": "Get in Touch",
    "contact.subtitle": "Ready to start your Dubai Real Estate journey? Let's discuss your investment goals.",

    // Areas Page
    "areas.title": "Prime Areas in Dubai",
    "areas.subtitle": "Explore Dubai's most sought-after neighborhoods and investment opportunities",

    // Blog Page
    "blog.page.title": "Insights from the Market",
  "blog.page.subtitle": "Stay informed | Stay ahead",
  "blog.description.1":
    "Covering what matters most to investors:",
  "blog.description.2":
    "Whether you're exploring your first investment or managing a growing portfolio, these articles are designed to help you think clearly, act decisively, and stay ahead of the curve.",
  "blog.description.3": "You'll find:",

  "blog.description.4": "Read the latest posts, and move forward with confidence",
  "blog.title": "Latest Insights",
  "blog.subtitle": "Expert analysis and market insights from Victoria Lancaster",
  
  "blog.published": "Published",
  "blog.by": "by",
  
  // Properties
  
  "properties.status.for-rent": "For Rent",
  "properties.status.sold": "Sold",
  


    // Footer
    "footer.description":
      "Your Strategic Partner in Real Estate Investment",
    "footer.quick.links": "Quick Links",
    "footer.contact.info": "Contact Info",
    "footer.newsletter": "Stay Updated",
    "footer.newsletter.description": "Get the latest property insights and market updates directly to your inbox.",
    "footer.email.placeholder": "Your email address",
    "footer.subscribe": "Subscribe",
    "footer.copyright": "© 2025 VL Real Estate. All rights reserved.",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.sitemap": "Sitemap",
    "footer.Location": "Dubai, UAE",
    "footer.Mail": "victoria.lancaster@selectproperty.ae",

    // Properties Page & Listings
    "properties.page.title.alt": "Personally Selected. Strategically Positioned.",
    "properties.page.subtitle.alt": "No noise. No mass listings. Just curated opportunities, reviewed, refined, and investment-ready.",
    "home.properties.title": "Explore Prime Opportunities",
    "home.properties.subtitle": "Discover my handpicked selection of premium properties",
    "home.properties.loading": "Loading our handpicked selection of premium properties...",

    // Testimonials
    "testimonials.join": "Join 585+ Satisfied Investors",
    "testimonials.ready": "Ready to start your Dubai property investment journey? Let me help you achieve your goals.",
    "testimonials.property": "Property",
    "testimonials.nearby.locations": "Nearby Locations",
    "testimonials.locations.found": "locations found",
    "testimonials.no.locations": "No locations found",
    "testimonials.try.different": "Try searching for a different area",

    // Welcome Popup
    "welcome.title": "Victoria Lancaster",
    "welcome.title2": "Investment Director",
    "welcome.subtitle": " For over 15 years, I’ve been entrusted with guiding capital into",
    "welcome.subtitle2": "Real Estate, turning ambition into lasting value",
    "welcome.subtitle1": "For over 15 years, I’ve been untrusted",
    "welcome.subtitle2+": "With guiding capital into Real Estate",
    "welcome.subtitle3": "turning ambition into lasting value",
    
    "welcome.experience": "Properties Sold ",
    "welcome.experience2": "+",
    "welcome.experience.detail": "Across Dubai and the UK",
    "welcome.strategic": "Valued At",
    "welcome.strategic.detail": "recommend the best property for you",
    "welcome.get.in.touch": "Request a private consultation",
    "welcome.full.name": "Full Name",
    "welcome.full.name.placeholder": "Your full name",
    "welcome.phone.number": "Phone Number",
    "welcome.phone.placeholder": "XX XXX XXXX",
    "welcome.email.address": "Email Address",
    "welcome.email.placeholder": "your.email@example.com",
    "welcome.details": "Details",
    "welcome.details.placeholder": "Tell me about your investment goals, preferred areas, budget range, or any specific requirements...",
    "welcome.skip": "Continue browsing",
    "welcome.send": "Submit",
    "welcome.thank.you": "Thank You!",
    "welcome.thank.you.message": "Your request is in trusted hands.",
    "welcome.expect.contact": "I will contact you soon.",

    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.close": "Close",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.submit": "Submit",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.sort": "Sort",
    "common.view.more": "View More",
    "common.read.more": "Read More",
    "common.learn.more": "Learn More",
  },
  ar: {

    // Blog Search
    "blog.search.placeholder":"بحث في المقالات",
    "blog.no.posts": "لم يتم العثور على مقالات",
    "blog.search.no.results": "لم يتم العثور على نتائج",
    "blog.categories.all": "جميع الفئات",
    "blog.categories.market.analysis": "تحليل السوق",
    "blog.categories.investment.guide": "دليل الاستثمار",
    "blog.categories.investment.tips": "نصائح الاستثمار",
    "blog.categories.investment.strategy": "استراتيجية الاستثمار",
    "blog.categories.area.guide": "دليل المنطقة",
    "blog.categories.legal.guide": "دليل القانون",
    "blog.search.button": "بحث",
    // Contact Form
    "contact.success.title": "تم إرسال الرسالة بنجاح!",
    "contact.success.message": "شكرا لك على الاتصال بي. سأقرأ رسالتك وأتواصل معك في غضون 24 ساعة.",
    "contact.success.contact.title": "معلومات التواصل",
    "contact.success.new.evaluation": "إرسال رسالة جديدة",
    

    // Properties Detail Page
    "properties.back.to.listings": "العودة إلى القائمة",
    "properties.watch.video": "مشاهدة الفيديو",
    "properties.tab.overview": "نظرة عامة",
    "properties.tab.features": "الميزات",
    "properties.tab.amenities": "المرافق",
    "properties.overview": "نظرة عامة",
    "properties.bedrooms": "عدد الغرف",
    "properties.bathrooms": "الحمامات",
    "properties.area": "المساحة",
    "properties.location": "الموقع",
    "properties.features": "الميزات",
    "properties.amenities": "المرافق",
    "properties.contact.agent": "اتصل بالوكيل",
    "properties.contact.now": "اتصل الآن",
    "properties.schedule.viewing": "احجز زيارة",
    "properties.available.for.viewing": "متاح للعرض",
    "properties.similar": "العقارات المماثلة",

      // Properties
  "properties.view.details": "عرض التفاصيل",
  "properties.status.ready": "جاهز",
  "properties.status.offplan": "تحت الإنشاء",
  "properties.status.featured": "مميز",
  "properties.status.for-rent": "للإيجار",
  "properties.status.sold": "مباع",
  "properties.found": "عقار",
  "properties.showing": "النتيجة",
  "properties.of": "من",
  "properties.results": "النتائج",
  "properties.no.results": "لم يتم العثور على عقارات",
  "properties.try.different.filters": "حاول تعديل مرشحات البحث لرؤية المزيد من النتائج.",
  "properties.suggestions": "اقتراحات: حاول توسيع نطاق السعر أو الموقع أو نوع العقار.",
  "properties.end.of.results": "لقد رأيت جميع العقارات المتاحة في القائمة المميزة",
  "properties.results.title": "نتائج البحث",
  "properties.page.title": "فرص مختارة",
  "properties.page.title2": "  ومدروسة بدقة",
  "properties.page.subtitle": "بدون ضوضاء ولا عروض عشوائية",
  "properties.page.subtitle2": "كل عقار هنا اجتاز معايير محدّدة ليكون استثمارك الآمن",

  
    // Property Listings
    "properties.title": "Featured Properties",
    "properties.subtitle":
      "Discover exceptional properties handpicked by Victoria Lancaster for their investment potential and luxury appeal",
    "properties.filter.all": "All Properties",
    "properties.filter.featured": "Featured",
    "properties.filter.ready": "Ready",
    "properties.filter.offplan": "Off-plan",
      "properties.schedule.tour": "Schedule Tour",
    "properties.view.all": "View All Properties",
  
      // Areas
  "areas.page.title": " أهم مناطق الاستثمار في دبي",
  "areas.page.subtitle": "تحليلات مدروسة لمساعدتك على الاختيار بثقة",
  "areas.description.1": "سوق العقارات في دبي متنوع، وليست كل منطقة تناسب كل مستثمر",
  "areas.description.2": "في هذا القسم، أسلّط الضوء على المناطق الرئيسية التي أختار العمل فيها، مشاركة منظوري الصادق حول:",
  "areas.feature.1": "نقاط القوة والإمكانيات",
  "areas.feature.2": "المخاطر التي يجب مراعاتها",
  "areas.feature.3": "من تناسبه المنطقة ",
  "areas.description.3": "سواء كنت تركز على العائد أو النمو أو نمط الحياة، ستساعدك هذه التّقارير على اتخاذ الخطوات الصحيحة",
  
  // Area Details
  "areas.dubai.marina.name": "دبي مارينا",
  "areas.dubai.marina.description": "حياة على الواجهة البحرية مع إطلالات خلابة ووسائل راحة عالمية",
  "areas.downtown.dubai.name": "وسط مدينة دبي",
  "areas.downtown.dubai.description": "قلب المدينة مع المعالم الأيقونية والتسوق الفاخر",
  "areas.palm.jumeirah.name": "نخلة جميرا",
  "areas.palm.jumeirah.description": "حياة حصرية على الجزيرة مع شواطئ خاصة ومنتجعات فاخرة",
  "areas.business.bay.name": "الخليج التجاري",
  "areas.business.bay.description": "منطقة أعمال حديثة مع حياة في المباني الشاهقة وإطلالات على القناة",
  "areas.properties.label": "العقارات",
  "areas.growth.label": "النمو السنوي",
    // Timeline Section
  "timeline.title": "المسيرة المهنية",
  "timeline.subtitle": "رحلة من التفاني والنمو والتميّز",
  "timeline.2005.title": "الأساس الأكاديمي",
  "timeline.2005.description": "تخرجت بدرجة البكالوريوس المزدوجة في العلوم من جامعة هيرزن الحكومية التربوية وجامعة البلطيق للغات الأجنبية، مما أرسى أساساً تحليلياً قوياً.",
  "timeline.2010.title": "دخول عالم العقارات",
  "timeline.2010.description": "انطلقت في مسيرتها مع Select Property في المملكة المتحدة والإمارات، وبدأت بالتركيز على العقارات السكنية وبناء خبرة عميقة في السوق.",
  "timeline.2012.title": "التوسع في سوق دبي",
  "timeline.2012.description": "ترسّخت مكانتها كمستشارة موثوقة، متميزة بقدرتها على توفيق الفرص مع أهداف العملاء.",
  "timeline.2015.title": "التخصص في إدارة الثروات",
  "timeline.2015.description": "حصلت على جائزة MVP – الشخص الأكثر أهمية في Select Property، تقديراً لنتائجها البارزة والخدمة المميزة التي تقدّمها.",
  "timeline.2018.title": "قاعدة عملاء عالمية",
  "timeline.2018.description": " أسّست قاعدة عملاء دولية تمتد إلى أكثر من 30 دولة، مقدّمة خدمات مخصصة باللغتين الإنجليزية والروسية.",
  "timeline.2020.title": "قيادة استراتيجية",
  "timeline.2020.description": " حوّلت تركيزها نحو الاستراتيجيات الاستثمارية، متخصّصة بالصفقات الحصرية (Off-Market) وبناء الثروات طويلة الأمد.",
  "timeline.2023.title": "التميز المهني",
  "timeline.2023.description": "أصبحت مرجع لثقة المستثمرين الأفراد، والمكاتب العائلية، والمؤسسات.",
  "timeline.2025.title": "المكانة الراسخة",
  "timeline.2025.description": " حققت بيع أكثر من 585 عقاراً بقيمة إجمالية تتجاوز 1.7 مليار درهم إماراتي، لتُرسّخ مكانتها كأحد أبرز استراتيجيي الاستثمار العقاري في دبي والمملكة المتحدة.",
  "timeline.quote": "كل محطة إنجاز لا تمثّل مجرد نمو مهني، بل التزام بالتميّز ونجاح العملاء… وهو ما يحدد رؤيتي في عالم الاستثمار العقاري",
  "timeline.signature.name": "فيكتوريا لانكستر",
  "timeline.signature.title": "مدير الاستثمار | مستشار عقاري مرخص",

    // Evaluation
  "evaluation.form.title": "أداة تقييم العقار",
  "evaluation.page.title": "تقييم عقارك",
  "evaluation.page.title2": "خطوة نحو ربح أذكى",
  "evaluation.page.subtitle": "هل  تفكر بخطوتك التالية؟ ابدأ بمعرفة القيمة الحقيقية لعقارك، وما يمكن أن يحققه لك",
  "evaluation.description.1+":
    "سأقدّم لك تقييماً مستنداً إلى بيانات من السّوق وخبرة أكثر من 15عاماً، لن تحصل على رقم فقط، بل رؤية استراتيجية تشمل:",
  "evaluation.description.1": "سواء كنت تخطط للبيع أو التأجير أو ترغب فقط في وضوح الرؤية",
    "evaluation.description.2": "ستحصل على رؤية استراتيجية، وليس مجرد رقم",
  "evaluation.description.3": "مدعوماً بأكثر من 15 عاماً من الخبرة، سيشمل تقييمك:",
  "evaluation.feature.1": "القيمة الدقيقة في السوق",
  "evaluation.feature.2": "إمكانات الدخل والاستثمار",
  "evaluation.feature.3": "خطة البيع أو الإيجار الأمثل",
  "evaluation.feature.3+": "(إذا كانت قابلة للتطبيق)",
  "evaluation.description.4": "شارك معلوماتك أدناه، ودعني أقيّم عقارك شخصياً",
  "evaluation.stats.1": "صفقة عقارية",
  "evaluation.stats.2": "القيمة الإجمالية",
  "evaluation.stats.3": "عاماً من الخبرة",
  "evaluation.contact.info": "معلومات التواصل",
  "evaluation.name": "الاسم الكامل",
  "evaluation.name.placeholder": "أدخل اسمك الكامل",
  "evaluation.email": "عنوان البريد الإلكتروني",
  "evaluation.email.placeholder": "أدخل بريدك الإلكتروني",
  "evaluation.phone": "رقم الهاتف",
  "evaluation.phone.placeholder": "أدخل رقم هاتفك",
  "evaluation.property.type": "نوع العقار",
  "evaluation.select.type": "اختر نوع العقار",
  "evaluation.location": "الموقع",
  "evaluation.select.location": "اختر الموقع",
  "evaluation.bedrooms": "عدد الغرف",
  "evaluation.select.beds": "اختر عدد الغرف",
  "evaluation.bathrooms": "الحمامات",
  "evaluation.select.baths": "اختر الحمامات",
  "evaluation.area": "المساحة (قدم مربع)",
  "evaluation.area.placeholder": "مثال: 1200",
  "evaluation.condition": "حالة العقار",
  "evaluation.select.condition": "اختر الحالة",
  "evaluation.condition.excellent": "ممتاز",
  "evaluation.condition.good": "جيد",
  "evaluation.condition.fair": "مقبول",
  "evaluation.condition.renovation": "يحتاج تجديد",
  "evaluation.year.built": "سنة البناء",
  "evaluation.year.placeholder": "مثال: 2020",
  "evaluation.amenities": "المرافق",
  "evaluation.amenities.placeholder": "مثال: مسبح، صالة رياضية، موقف سيارات",
  "evaluation.description": "وصف إضافي",
  "evaluation.description.placeholder": "أي تفاصيل إضافية حول عقارك...",
  "evaluation.button": "احصل على تقييم العقار",
  "evaluation.success.title": "تم تقديم التقييم بنجاح!",
  "evaluation.success.message":
    "شكراً لك على تقديم طلب تقييم العقار. سيقوم فريق الخبراء لدينا بمراجعة تفاصيل عقارك والاتصال بك خلال 24 ساعة مع تحليل شامل للسوق.",
  "evaluation.success.contact.title": "معلومات الاتصال",
  "evaluation.success.new.evaluation": "تقديم تقييم جديد",

     // About
  "about.page.title": "عن فيكتوريا",
  "about.page.subtitle": "استراتيجية واضحة  |  ثقة راسخة  |  نتائج ملموسة",
  "about.quote": "بالنسبة لي، الاستثمار العقاري ليس مجرد صفقة… بل بناء مستقبل.",
  "about.quote+": "أتعامل مع كل عقار وكأنه استثماري الخاص، بالعناية والدقة نفسها",
  "about.name": "فيكتوريا لانكاستر",
  "about.tname":"مدير الاستثمارات العقارية",
  "about.title": "مديرة قسم الاستثمارات العقارية | خبيرة استراتيجيات عقارية | مستشارة موثوقة",
  "about.section1.title": "أكثر من 15 عاماً من التميز",
  "about.section1.text1": "بخبرة تمتد عبر أسواق الإمارات والمملكة المتحدة، أصبحت فيكتوريا لانكاستر اسماً مرادفاً للثقة، والرؤية الاستراتيجية، والنتائج الملموسة على المدى الطويل.",
  "about.section1.text2": "كمديرة للاستثمار في Select Property، أتمّت أكثر من 585 صفقة عقارية بقيمة تتجاوز 1.7 مليار درهم إماراتي، مؤكدة مكانتها كإحدى أبرز الخبراء في عالم الاستثمار العقاري.",
  "about.section1.updated": "آخر تحديث: يونيو 2025",
  "about.section2.title": "محفظة استثمارية",
  "about.section2.Subtitle": "بُنيت على التحليل والبيانات",
  "about.section2.text1": "تشمل محفظة فيكتوريا الاستثمارات السكنية الفاخرة، والمشاريع قيد الإنشاء، واستثمارات الشراء للإيجار، جميعها مختارة بعناية لبناء محافظ آمنة وعالية العائد للعملاء من مختلف أنحاء العالم.",
  "about.section2.text2": "تُعرف فيكتوريا بقدرتها على قراءة السوق واكتشاف الفرص  مبكراً قبل أن تصل إلى الواجهة.",
  "about.section2.text3": "يختارها عملاؤها لصفاء رؤيتها ودقة استراتيجياتها ونهجها المبني على البيانات، مدركين أن العقار في عالمها ليس مجرد صفقة، بل أساس للثروة وأسلوب حياة وإرث للأجيال.",
  "about.section3.title": "عملاؤها… قيمها",
  "about.section3.text1": " تختار فيكتوريا العمل حصرياً مع مطوّرين مختارين وعملاء جادّين، حيث تبني كل محفظة استثمارية بالتدقيق الواعي، والاستراتيجيات طويلة الأمد، ضمن إطار استثماري واضح.",
  "about.section3.text2": "سواء كان الهدف الاستثمار أو اقتناء منزل، فهي تقدّم نفس المستوى من العناية الدقيقة، والشفافية، والالتزام بتحقيق النتائج.",
  "about.section3.text3": "خارج عالم العمل، فيكتوريا زوجة وأم محبة وعاشقة للحيوانات. حياتها المتوازنة تمنحها صفاءً ووضوحاً، وهي القيم نفسها التي تجلبها لكل علاقة مع عملائها.",
  "about.academic.title": "المصداقية الأكاديمية والمهنية",
  "about.academic.degree.title": "درجات مزدوجة في بكالوريوس العلوم من:",
  "about.academic.degree.1": "جامعة هيرزن الحكومية التربوية (2003 - 2005)",
  "about.academic.degree.2": "جامعة البلطيق للغات الأجنبية (2000-2005)",
  "about.professional.title": "الاعتمادات المهنية:",
  "about.professional.license": "مرخصة من دائرة الأراضي والأملاك في دبي (BRN 27147)",
  "about.academic.text1": "تجمع فيكتوريا بين أساس أكاديمي عالمي ونهج تحليلي يركز على النتائج، تتعامل مع كل استثمار بنفس العناية والتمييز كما لو كان استثمارها الخاص.",
  "about.academic.text2": "تُعرف بأسلوب تواصلها المباشر وعدم التعقيد، وهي صفة يقدرها عملاؤها لشفافيتها وكفاءتها.",
  "about.excellence.title": "التميز المهني",
  "about.excellence.text": "الاستثمارات العظيمة لا تُستعجل، بل تُختار بغرض وتوقيت ووضوح. تجلب فيكتوريا اهتماماً دقيقاً بالتفاصيل والتزاماً لا يتزعزع لكل علاقة مع العملاء.",
  "about.excellence.quote": "الاستثمار العظيم لا يُستعجل… بل يُختار بوضوح وبتوقيت صحيح",
  "about.expertise.title": "نقاط أتميز بها لبناء استثماراتك",
  "about.expertise.quote": "أنا لا أبيع العقارات فقط… بل أضع استراتيجيات للثروة.",
  "about.expertise.quote2": "لنبدأ حواراً قائماً على الثقة والأرقام، موجهاً لأهدافك. سجّل بياناتك، وستتواصل معك فيكتوريا شخصياً لتوجيه خطوتك القادمة",
  "about.expertise.description": "إليك كيف أساعد المستثمرين على  بناء محافظ عقارية بهدف محدد ووضوح:",
  "about.expertise.1": "الاستثمارات على الخريطة (دبي والمملكة المتحدة)",
  "about.expertise.2": "العقارات السكنية المختارة بعناية",
  "about.expertise.3": "استراتيجيات الشراء بغرض التأجير",
  "about.expertise.4": "تنويع المحافظ الاستثمارية",
  "about.expertise.5": "إدخال المستثمرين الجدد",
  "about.expertise.6": "توقعات السوق والتحليلات",
  "about.offices.title": "المكاتب",
  "about.office.dubai": "دبي، الإمارات العربية المتحدة",
  "about.office.manchester": "مانشستر، المملكة المتحدة",
  "about.cta.title": "مستعد لاتخاذ الخطوة التالية؟",
  "about.cta.text": "لنبدأ محادثة مبنية على الثقة، موجهة بإستراتيجية ومصممة خصيصاً لأهدافك. شارك معلوماتك أدناه.",
  "about.cta.text2": "ستراجع فيكتوريا شخصياً كيف يمكنها دعم خطوتك التالية",
  "about.cta.button": "إرسال رسالة",
  "about.achievements.1.number": "585+",
  "about.achievements.1.title": "عقار مُباع",
  "about.achievements.1.description": "أتمت بنجاح معاملات تزيد قيمتها عن 1.7 مليار درهم إماراتي",
  "about.achievements.2.number": "30+",
  "about.achievements.2.title": "دولة مخدومة",
  "about.achievements.2.description": "عملاء عالميون من أسواق دولية متنوعة",
  "about.achievements.3.number": "15+",
  "about.achievements.3.title": "سنة خبرة",
  "about.achievements.3.description": "سجل حافل مثبت في أسواق العقارات في الإمارات والمملكة المتحدة",
  "about.achievements.4.number": "3",
  "about.achievements.4.title": "لغات",
  "about.achievements.4.description": "تتقن الإنجليزية والعربية والروسية",
    // Navigation Arabic
    "nav.home": "الرئيسية",
    "nav.properties": "العقارات",
    "nav.areas": "المناطق",
    "nav.evaluation": "تقييم عقارك",
    "nav.blog": "الأخبار",
    "nav.about": "عن فيكتوريا",
    "nav.contact": "تواصل معي",

    // AI Chat Assistant
    "ai.chat.assistant.title": "مساعد الدردشة الذكي",
    "ai.chat.assistant.subtitle": "اسألني عن أي شيء عن الاستثمار في العقارات في دبي",
    "ai.chat.assistant.input.placeholder": "اسألني عن أي شيء عن الاستثمار في العقارات في دبي",
    "ai.chat.assistant.button": "أرسل",
    "ai.chat.assistant.messages": "الرسائل",
    "ai.chat.assistant.loading": "جاري التحميل...",
    "ai.chat.title": "اسأل فيكتوريا",
    "ai.chat.placeholder": "اسألني عن أي شيء عن الاستثمار في العقارات في دبي",

    // Hero Section Arabic
    "hero.title": "دبي ليست خياراً",
    "hero.title.highlight": "بـل طريق استراتيجي للثروة",
    "hero.subtitle":"افهم السـوق     |      اغتنم الفـرص الحصرية     |      وابنِ مستقبلاً يـدوم",
    "hero.search.button": "أبحث",
    "hero.stats.properties": "صفقة عقارية ",
    "hero.stats.value": "القيمة الإجمالية",
    "hero.stats.experience": "عاماً من الخبرة",
    "hero.stats.satisfaction": "صفقة عقارية",

    // Locations Arabic
    "location.dubai.marina": "دبي مارينا",
    "location.downtown": "وسط مدينة دبي",
    "location.palm.jumeirah": "نخلة جميرا",
    "location.jvc": "قرية جميرا الدائرية",
    "location.business.bay": "الخليج التجاري",
    "location.dubai.maritime": "مدينة دبي البحرية",
    "location.dubai.other": "مناطق أخرى",

    // Properties Page Arabic
    
    "properties.listings.title": "قوائم العقارات",
    "properties.listings.subtitle": "تصفح مجموعتنا المختارة من العقارات المميزة",
    "properties.our.listings": "قوائم عقاراتنا",
    "property.status.ready" : "جاهز",
"property.status.OffPlan" : "تحت الإنشاء",
"property.status.ForRent" : "للإيجار",
"property.status.Sold" : "مباع",


  

    // Properties View Arabic
    "properties.view.grid": "عرض الشبكة",
    "properties.view.map": "عرض الخريطة",

    
   

    // Property Card Arabic
    "property.tour": "جولة",
    "property.featured": "مميز",
    "property.new": "جديد",
    "property.share": "مشاركة العقار",
    "property.remove.favorite": "إزالة من المفضلة",
    "property.add.favorite": "إضافة للمفضلة",
    "property.bedrooms": "عدد الغرف",
    "property.bathrooms": "الحمامات",
    "property.sqft": "قدم مربع",
    "property.view.details": "عرض التفاصيل",
    "property.contact": "سجل اهتمامك",

    // Map Arabic
    "properties.map.available": "العقارات المتاحة",
    "properties.map.selected": "العقار المحدد",
    "properties.map.properties": "العقارات",

    // Search Form Arabic
    "search.property.type": "نوع العقار",
    "search.location": "الموقع",
    "search.price.range": "نطاق السعر",
    "search.bedrooms": "عدد الغرف",
    "search.apartment": "شقة",
    "search.villa": "فيلا",
    "search.townhouse": "تاون هاوس",
    "search.penthouse": "بنتهاوس",
    "search.1.bedroom": "غرفة نوم واحدة",
    "search.2.bedrooms": "غرفتان نوم",
    "search.3.bedrooms": "ثلاث غرف نوم",
    "search.4plus.bedrooms": "4+ غرف نوم",

    // Filter Panel Arabic
    "filters.title": "خيارات التصفية",
    "filters.status.ready":"جاهز",
    "filters.status.sold":"مباع",
    "filters.sort.bedrooms-asc":"حسب غرف النوم تصاعدياً",
    "filters.sort.bedrooms-desc":"حساب غرف النوم تنازلياً",
    "filters.show": "إظهار المرشحات",
    "filters.hide": "إخفاء المرشحات",
    "filters.clear": "مسح الكل",
    "filters.apply": "تطبيق",
    "filters.reset": "إعادة تعيين",
    "filters.search": "بحث",
    "filters.search.placeholder": "البحث في العقارات...",
    "filters.property.type": "نوع العقار",
    "filters.price.range": "نطاق السعر",
    "filters.bedrooms": "عدد الغرف",
    "filters.bedrooms.range": "عدد الغرف",
    "filters.bathrooms": "الحمامات",
    "filters.rooms":"الغرف",
    "filters.bathrooms.range": "الحمامات",
    "filters.location": "الموقع",
    "filters.status": "الحالة",
    "filters.amenities": "المرافق",
    "filters.amenities.elevator":"مصعد",
    "filters.amenities.parking":"كراج",
    "filters.tabs.basic": "أساسي",
    "filters.tabs.advanced": "متقدم",

    // Property Types Arabic
    "filters.property.types.villa": "فيلا",
    "filters.property.types.apartment": "شقة",
    "filters.property.types.penthouse": "بنتهاوس",
    "filters.property.types.mansion": "قصر",
    "filters.property.types.townhouse": "تاون هاوس",

    // Sort Options Arabic
    "filters.sort.label": "ترتيب حسب",
    "filters.sort.default": "افتراضي",
    "filters.sort.price-asc": "السعر: من الأقل إلى الأعلى",
    "filters.sort.price-desc": "السعر: من الأعلى إلى الأقل",
    "filters.sort.newest": "الأحدث أولاً",
    "filters.sort.oldest": "الأقدم أولاً",

    // Status Options Arabic
    "filters.status.for-sale": "للبيع",
    "filters.status.for-rent": "للإيجار",
    "filters.status.offplan": "على الخريطة",
    "filters.ready": "جاهز",
    "filters.offplan": "على الخريطة",
    "filters.featured": "مميز",

    // Amenities Arabic
    "filters.amenities.pool": "مسبح",
    "filters.amenities.garden": "حديقة",
    "filters.amenities.garage": "مرآب",
    "filters.amenities.balcony": "شرفة",
    "filters.amenities.gym": "صالة رياضية",
    "filters.amenities.security": "أمن",

    // Blog
  "blog.page.title": "اتجاهات السوق",
  "blog.page.subtitle": "تحليلات دقيقة تبقيك متقدّماً بخطوة",
  "blog.description.1": "تحليلات مستندة إلى بيانات ومصادر موثوقة تُحوّل الأرقام إلى قرارات واثقة، مرتكزة على خبرة تتجاوز 15 عاماً في أسواق دبي والمملكة المتحدة",
  "blog.description.2": "من اتجاهات السوق إلى استراتيجيات الاستثمار، احصل على المعرفة التي تحتاجها لاتخاذ قرارات مدروسة.",
  "blog.description.3": "إرشاد خبير مدعوم بأكثر من 15 عاماً من الخبرة في أسواق دبي والمملكة المتحدة.",
  "blog.feature.1": "تحليلات واتجاهات السوق",
  "blog.feature.2": "استراتيجيات استثمار عملية",
  "blog.feature.3": "استشارات عقارية متخصصة",
  "blog.description.4": "اطّلع على أحدث الرؤى والاستراتيجيات لتعزيز العائد",
  "blog.read.more": "اقرأ المزيد",

    // FAQ Section
    "faq.title": "الأسئلة الأكثر تكرراً",
    "faq.subtitle": "إجابات فيكتوريا على أكثر الأسئلة شيوعاً في عالم الاستثمار العقاري.",
    "faq.quote":
      '"اخترت هذه الأسئلة لأنها تمثّل ما يشغل بال المستثمرين حقاً، ليس فقط عن شراء العقار في دبي، بل عن منهجي في التفكير، وأسلوب عملي.أؤمن أن الشفافية تبني الثقة، وحين يكون أمامك وضوح كامل، تصبح قراراتك الاستثمارية أكثر ذكاءً وأماناً."',
    "faq.quote.author": "فيكتوريا لانكستر",

    // Testimonials Section
    "testimonials.title": "قصص نجاح العملاء",
    "testimonials.subtitle": "استمع إلى المستثمرين الذين وثقوا بفيكتوريا لانكستر في رحلة عقارات دبي",
    "testimonials.join.title": "انضم إلى 585+ مستثمر راضٍ",
    "testimonials.join.subtitle": "مستعد لبدء رحلة الاستثمار العقاري في دبي؟ دع فيكتوريا تساعدك في تحقيق أهدافك.",
    "testimonials.total.value": "إجمالي قيمة المعاملات",
    "testimonials.years.experience": "سنوات الخبرة",
    "testimonials.client.satisfaction": "رضا العملاء",

  
    "contact.title": "تواصل معنا",
    "areas.title": "المناطق الرئيسية في دبي",
    "blog.title": "رؤى العقارات",



    // Contact Page Arabic
    "contact.page.title": "تواصل معي",
    "contact.page.subtitle": "احصل على استشارة عقارية شخصية ومباشرة",
    "contact.form.title": "أرسل لي رسالة",
    "contact.first.name": "الاسم الأول",
    "contact.first.name.placeholder": "أدخل اسمك الأول",
    "contact.last.name": "اسم العائلة",
    "contact.last.name.placeholder": "أدخل اسم عائلتك",
    "contact.email": "البريد الإلكتروني",
    "contact.email.placeholder": "أدخل عنوان بريدك الإلكتروني",
    "contact.phone": "الهاتف",
    "contact.phone.placeholder": "أدخل رقم هاتفك",
    "contact.budget": "نطاق الميزانية",
    "contact.budget.placeholder": "مثلاً، $1M - $2M",
    "contact.message": "الرسالة",
    "contact.message.placeholder": "أخبرنا عن متطلباتك العقارية...",
    "contact.send": "إرسال",
    "contact.info.title": "معلومات التواصل",
    "contact.info.phone": "الهاتف",
    "contact.info.email": "البريد الإلكتروني",
    "contact.info.office": "المكتب",
    "contact.info.office.location": "دبي، الإمارات العربية المتحدة، مارينا بلازا، المكتب 2701",
    "contact.info.hours": "ساعات العمل",
    "contact.info.hours.time": "الاثنين - الجمعة: 9:00 صباحاً - 6:00 مساءً",
    "contact.location.title": "موقعنا",

    // Properties Page & Listings Arabic
    "properties.page.title.alt": "مختارة شخصياً. موضوعة استراتيجياً.",
    "properties.page.subtitle.alt": "لا ضوضاء. لا قوائم جماعية. فقط فرص منتقاة، مراجعة، مصقولة، وجاهزة للاستثمار.",
    "home.properties.title": "اكتشــف أهــم الفــرص",
    "home.properties.subtitle": "عقارات مميزة مختارة بعناية ",
    "home.properties.loading": "جاري تحميل مجموعتنا المختارة من العقارات المميزة...",

    // Footer Arabic
    "footer.description": "شريكك الموثوق في عالم الاستثمار العقاري",
    "footer.quick.links": "روابط سريعة",
    "footer.contact.info": "معلومات التواصل",
    "footer.newsletter": "النشرة الإخبارية",
    "footer.newsletter.description": "اشترك الآن لتصلك أهم الأخبار والأرقام الموثوقة ",
    "footer.email.placeholder": "عنوان بريدك الإلكتروني",
    "footer.subscribe": "اشتراك",
    "footer.copyright": "© 2025 في إل العقارية. جميع الحقوق محفوظة.",
    "footer.social.follow": "تابعنا",
    "footer.contact.address": "دبي، الإمارات العربية المتحدة",
    "footer.contact.phone": "00971-4-2794-800",
    "footer.contact.email": "victoria.lancaster@selectproperty.ae",
     "footer.Location": "دبي، الإمارات العربية المتحدة ",
    "footer.Mail": "victoria.lancaster@selectproperty.ae",

    // Testimonials Arabic
    "testimonials.title.alt": "موثوقة من نخبة المستثمرين العالميّين",
    "testimonials.subtitle.alt": "شهادات لعملاء اختاروا الاستراتيجية والنتائج",
    "testimonials.join.alt": "انضم إلى 585+ مستثمر ناجح",
    "testimonials.ready.alt": "مستعد لبدء رحلة الاستثمار العقاري في دبي؟ دعني أساعدك في تحقيق أهدافك.",
    "testimonials.total.value.alt": "صفقة عقارية",
    "testimonials.years.experience.alt": "سنوات الخبرة",
    "testimonials.property": "العقار",
    "testimonials.nearby.locations": "المواقع القريبة",
    "testimonials.locations.found": "موقع موجود",
    "testimonials.no.locations": "لم يتم العثور على مواقع",
    "testimonials.try.different": "حاول البحث عن منطقة مختلفة",

    // Welcome Popup Arabic
    "welcome.title": "فيكتوريا لانكستر",
    "welcome.title2": "مدير الاستثمارات و الثروات العقارية",
    "welcome.subtitle": "على مدى أكثر من خمسة عشر عاماً، قُدت رؤوس الأموال لمستثمرين من مختلف أنحاء العالم، وقمت بتحويل طموحاتهم إلى أصول عقارية ذات قيمة مستدامة وعوائد ملموسة",
    "welcome.subtitle2": " ",
    "welcome.experience": "عدد الصفقات",
    "welcome.experience2": " عاماً من الخبرة",
    "welcome.experience.detail": "في دبي والمملكة المتحدة",
    "welcome.strategic": "بإجمالي",
    "welcome.strategic.detail": "بأفضل عقار لك",
    "welcome.get.in.touch": "احجز استشارتك الآن",
    "welcome.full.name": "الاسم الكامل",
    "welcome.full.name.placeholder": "اسمك الكامل",
    "welcome.phone.number": "رقم الهاتف",
    "welcome.phone.placeholder": "xxx xxx xxxx",
    "welcome.email.address": "عنوان البريد الإلكتروني",
    "welcome.email.placeholder": "your.email@example.com",
    "welcome.details": "التفاصيل",
    "welcome.details.placeholder": "أخبرني عن أهدافك الاستثمارية، المناطق المفضلة، نطاق الميزانية، أو أي متطلبات محددة...",
    "welcome.skip": "متابعة التصفح ",
    "welcome.send": "إرسال الطلب",
    "welcome.thank.you": "شكراً لك!",
    "welcome.thank.you.message": "طلبك في أيدي أمينة.",
    "welcome.expect.contact": "سأتواصل معك قريباً.",

    // Common Arabic
    "common.loading": "جاري التحميل...",
    "common.description": "التفاصيل",

  },
  
  ru: {
// Blog Search
"blog.search.placeholder": "Поиск по записям блога...",
"blog.no.posts": "Записи в блоге не найдены",
"blog.search.no.results": "Результатов не найдено",
"blog.categories.all": "Все категории",
"blog.categories.market.analysis": "Анализ рынка",
"blog.categories.investment.guide": "Руководство по инвестициям",
"blog.categories.investment.tips": "Советы по инвестициям",
"blog.categories.investment.strategy": "Инвестиционная стратегия",
"blog.categories.area.guide": "Путеводитель по районам",
"blog.categories.legal.guide": "Юридические новости",
"blog.feature.1": "Аналитика и рыночные тренды",
"blog.feature.2": "Практические инвестиционные стратегии",
"blog.feature.3": "Профессиональные консультации по недвижимости",
"blog.read.more": "Подробнее",
"blog.search.button": "Поиск",

   
    // Contact Form
"contact.success.title": "Сообщение успешно отправлено!",
"contact.success.message": "Спасибо за обращение. Я ознакомлюсь с вашим сообщением и свяжусь с вами в течение 24 часов.",
"contact.success.contact.title": "Контактные данные",
"contact.success.new.evaluation": "Отправить новое сообщение",

      // Areas
  "areas.page.title": "Лучшие районы для инвестиций в Дубае",
  "areas.page.subtitle": "Продуманная аналитика для уверенного выбора",
  "areas.description.1": "Рынок недвижимости Дубая разнообразен, не каждый район подойдёт каждому инвестору",
  "areas.description.2": "В этом разделе я выделяю ключевые районы, с которыми работаю, и делюсь своим честным взглядом на:",
  "areas.feature.1": "Сильные стороны и потенциал",
  "areas.feature.2": "Риски, которые стоит учитывать",
  "areas.feature.3": "Каким инвесторам подходит данный район",
  "areas.description.3": "Будь то доход, рост или образ жизни, эти обзоры помогут выбрать правильно",
  
  // Area Details
  "areas.dubai.marina.name": "Дубай Марина",
  "areas.dubai.marina.description": "Жизнь на набережной с потрясающими видами и удобствами мирового класса",
  "areas.downtown.dubai.name": "Центр Дубая",
  "areas.downtown.dubai.description": "Сердце города с знаковыми достопримечательностями и роскошными магазинами",
  "areas.palm.jumeirah.name": "Палм Джумейра",
  "areas.palm.jumeirah.description": "Эксклюзивная островная жизнь с частными пляжами и роскошными курортами",
  "areas.business.bay.name": "Бизнес Бей",
  "areas.business.bay.description": "Современный деловой район с высотной жизнью и видами на канал",
  "areas.properties.label": "Недвижимость",
  "areas.growth.label": "Рост г/г",

    // Timeline Section
  "timeline.title": "Профессиональный путь",
  "timeline.subtitle": "Путь преданности, роста и успеха",
  "timeline.2005.title": "Академическая основа",
  "timeline.2005.description": "Виктория получила двойной диплом бакалавра наук в Российском государственном педагогическом университете им. Герцена и Балтийском университете иностранных языков, что заложило прочную аналитическую базу",
  "timeline.2010.title": "Вход в недвижимость",
  "timeline.2010.description": "Виктория начала свою карьеру в компании Select Property в Великобритании и ОАЭ, сосредоточившись на жилой недвижимости и формируя глубокую экспертизу рынка",
  "timeline.2012.title": "Расширение на рынок Дубая",
  "timeline.2012.description": "Виктория закрепила свою позицию как надёжный советник, отличаясь умением точно сочетать инвестиционные возможности с целями клиентов",
  "timeline.2015.title": "Специализация в управлении капиталом",
  "timeline.2015.description": "Виктория была удостоена награды MVP (Самый ценный сотрудник) в компании Select Property в знак признания её выдающихся результатов и исключительного уровня сервиса",
  "timeline.2018.title": "Глобальная клиентская база",
  "timeline.2018.description": "Виктория сформировала международный круг клиентов более чем из 30 стран, предлагая персонализированные услуги на английском и русском языках.",
  "timeline.2020.title": "Стратегическое лидерство",
  "timeline.2020.description": "Виктория сместила фокус на инвестиционные стратегии, специализируясь на эксклюзивных сделках вне рынка и создании долгосрочного капитала",
  "timeline.2023.title": "Профессиональное превосходство",
  "timeline.2023.description": "Виктория стала надёжным ориентиром для доверия со стороны частных инвесторов, семейных офисов и институциональных клиентов",
  "timeline.2025.title": "Прочная репутация",
  "timeline.2025.description": "Виктория лично завершила более 585 сделок с недвижимостью на общую сумму свыше 1,7 млрд дирхамов ОАЭ, укрепив свою позицию как одного из ведущих стратегов в сфере инвестиций в недвижимость в Дубае и Великобритании",
  "timeline.quote": "Каждый этап карьеры для меня, это не просто профессиональный рост, а подтверждение приверженности к совершенству и успеху клиентов. Именно это определяет моё видение в мире инвестиций в недвижимость",
  "timeline.signature.name": "Виктория Ланкастер",
  "timeline.signature.title": "Директор по инвестициям | Лицензированный консультант по недвижимости",
    // Blog
  "blog.page.title": "Рыночные тренды",
  "blog.page.subtitle": "Аналитика на шаг впереди",
  "blog.description.1": "Аналитика на основе данных и проверенных источников, превращающая цифры в уверенные решения. Опыт более 15 лет на рынках Дубая и Великобритании.",
  "blog.description.2": "От тенденций рынка до инвестиционных стратегий - получите знания, необходимые для принятия обоснованных решений.",
  "blog.description.3": "Экспертное руководство, подкрепленное более чем 15-летним опытом на рынках Дубая и Великобритании.",
  "blog.description.4": "Ознакомьтесь с новейшими идеями и стратегиями для повышения доходности",
  
   // About
   "about.page.title": "О Виктории",
   "about.page.subtitle": "Чёткая стратегия | Надёжное доверие | Реальные результаты",
   "about.quote": "Для меня инвестиции в недвижимость, это не просто сделка… это создание будущего",
   "about.quote+": "Я отношусь к каждому объекту так, словно инвестирую сама: с той же тщательностью и вниманием к деталям",
   "about.name": "Виктория Ланкастер",
   "about.tname":"Директор по инвестициям в недвижимость",
   "about.title": "Директор инвестиционного отдела | Эксперт по стратегиям в недвижимости | Надёжный советник",
   "about.section1.title": "Более 15 лет профессионального успеха",
   "about.section1.text1": "Обладая опытом работы на рынках ОАЭ и Великобритании, Виктория Ланкастер стала синонимом доверия, стратегического видения и устойчивых долгосрочных результатов",
   "about.section1.text2": "Как директор по инвестициям в Select Property, она заключила более 585 сделок на сумму свыше 1,7 млрд дирхамов ОАЭ, что закрепило её репутацию одного из ведущих экспертов в сфере инвестиций в недвижимость",
   "about.section1.updated": "Последнее обновление: июнь 2025",
   "about.section2.title": "Инвестиционный портфель",
  "about.section2.Subtitle": " основанный на анализе и данных",
   "about.section2.text1": "Портфель Виктории охватывает элитную жилую недвижимость, проекты на стадии строительства и объекты «buy-to-let» (покупка для сдачи в аренду), всё тщательно отобрано для формирования надёжных и высокодоходных активов для клиентов со всего мира",
   "about.section2.text2": "Виктория известна своей способностью читать рынок и выявлять перспективные возможности ещё до того, как они становятся очевидными для других",
   "about.section2.text3": "Клиенты выбирают её за ясность видения, точность стратегий и подход, основанный на данных, понимая, что недвижимость в её философии, это не просто сделка, а фундамент капитала, стиль жизни и наследие для будущих поколений",
   "about.section3.title": "Её клиенты… Её ценности",
   "about.section3.text1": "Виктория работает исключительно с надёжными девелоперами и серьёзными инвесторами, формируя каждый инвестиционный портфель с особой тщательностью и на основе долгосрочных стратегий в рамках прозрачной инвестиционной модели",
   "about.section3.text2": "Вне работы Виктория, любящая жена, заботливая мама и большой друг животных. Её сбалансированный образ жизни придаёт ясность и гармонию,",
   "about.section3.text3": " именно эти ценности она привносит в каждое взаимодействие с клиентами",
   "about.academic.title": "Академическая и профессиональная репутация",
   "about.academic.degree.title": "Двойные степени бакалавра наук от:",
   "about.academic.degree.1": "Государственный педагогический университет им. Герцена (2003 - 2005)",
   "about.academic.degree.2": "Балтийский университет иностранных языков (2000-2005)",
   "about.professional.title": "Профессиональные аккредитации:",
   "about.professional.license": "Лицензировано Департаментом земли Дубая (BRN 27147)",
   "about.academic.text1": "Виктория сочетает глобальную академическую основу с аналитическим, ориентированным на результат подходом, относясь к каждой инвестиции с той же заботой и проницательностью, как если бы это была её собственная.",
   "about.academic.text2": "Она известна своим прямым стилем общения без лишних слов - качество, которое её клиенты ценят за прозрачность и эффективность.",
   "about.excellence.title": "Профессиональное совершенство",
   "about.excellence.text": "Великие инвестиции не спешат, они выбираются с целью, временем и ясностью. Виктория привносит скрупулёзное внимание к деталям и непоколебимую приверженность каждым отношениям с клиентом.",
   "about.excellence.quote": "Великие инвестиции не делаются в спешке… они выбираются осознанно и в правильное время.",
   "about.expertise.title": "Мои сильные стороны для построения ваших инвестиций",
   "about.expertise.quote": "Я не просто продаю недвижимость… я создаю стратегии для капитала",
   "about.expertise.description": "Вот как я помогаю инвесторам формировать портфели недвижимости с чёткой целью и ясной стратегией:",
   "about.expertise.1": "Инвестиции на этапе строительства (Дубай и Великобритания)",
   "about.expertise.2": "Жилая недвижимость премиум-класса",
   "about.expertise.3": "Стратегии buy-to-let",
   "about.expertise.4": "Диверсификация портфеля",
   "about.expertise.5": "Поддержка новых инвесторов",
   "about.expertise.6": "Рыночные прогнозы и аналитика",
   "about.offices.title": "Офисы",
   "about.office.dubai": "Дубай, Объединённые Арабские Эмираты",
   "about.office.manchester": "Манчестер, Великобритания",
   "about.cta.title": "Готов сделать следующий шаг?",
   "about.cta.text": " Давай начнём разговор на доверии и стратегии, созданной под твои цели",
   "about.cta.text2": "Виктория лично оценит, как поддержать твой успех",
   "about.cta.button": "Написать",
   "about.achievements.1.number": "585+",
   "about.achievements.1.title": "Продано объектов",
   "about.achievements.1.description": "Успешно закрыты сделки на сумму более 1.7 миллиарда дирхамов ОАЭ",
   "about.achievements.2.number": "30+",
   "about.achievements.2.title": "Стран обслужено",
   "about.achievements.2.description": "Глобальная клиентура из различных международных рынков",
   "about.achievements.3.number": "15+",
   "about.achievements.3.title": "Лет опыта",
   "about.achievements.3.description": "Проверенный послужной список на рынках недвижимости ОАЭ и Великобритании",
   "about.achievements.4.number": "3",
   "about.achievements.4.title": "Языка",
   "about.achievements.4.description": "Свободно владеет английским, арабским и русским языками",
 "evaluation.stats.3": "Каждая недвижимость здесь прошла определённые критерии",

    // Navigation Russian
    "nav.home": "Главная",
    "nav.properties": "Недвижимость",
    "nav.areas": "Районы",
    "nav.evaluation": "Оценка недвижимости",
    "nav.blog": "Блог",
    "nav.about": "О Виктории",
    "nav.contact": "Связаться со мной",
    "about.expertise.quote2": "Давайте начнём диалог, основанный на доверии и фактах, с учётом ваших целей. Введите свои данные, и Виктория лично свяжется с вами, чтобы помочь с следующим шагом.",

    //ai chat assistant
    "ai.chat.title": "Спросить Викторию",
    "ai.chat.subtitle": "Спроси меня о чем угодно о недвижимости в Дубае",
    "ai.chat.input.placeholder": "Спроси меня о чем угодно о недвижимости в Дубае",
    "ai.chat.button": "Отправить",
    "ai.chat.messages": "Сообщения",
    "ai.chat.loading": "Загрузка...",
    "ai.chat.error": "Ошибка",
    "ai.chat.placeholder": "Спроси меня о чем угодно о недвижимости в Дубае",

     // Properties Detail Page
    "properties.back.to.listings": "Вернуться к списку",
     "properties.watch.video": "Смотреть видео",
  "properties.tab.overview": "Обзор",
  "properties.tab.features": "Особенности",
  "properties.tab.amenities": "Удобства",
  "properties.overview": "Обзор проекта",
  "properties.bedrooms": "Количество комнат",
  "properties.bathrooms": "Ванные комнаты",
  "properties.area": "Площадь",
  "properties.location": "Локация",
  "properties.features": "Особенности недвижимости",
  "properties.amenities": "Удобства здания",
  "properties.contact.agent": "Связаться с агентом",
  "properties.contact.now": "Позвоните сейчас",
  "properties.schedule.viewing": "Запланировать просмотр",
  "properties.available.for.viewing": "Доступно для просмотра",
  "properties.similar": "Похожие объекты"
,

    // Hero Section Russian
    "hero.title": "Дубай это не просто выбор",
    "hero.title.highlight": " а стратегический путь к капиталу",
    "hero.subtitle":"Понимай рынок | Используй эксклюзивные возможности | Создавай будущее которое останется надолго",
    "hero.search.button": "Поиск",
    "hero.stats.properties": "сделок с недвижимостью",
    "hero.stats.value": "совокупный объём",
    "hero.stats.experience": "лет опыта",
    "hero.stats.satisfaction": "Удовлетворенность клиентов",

    // Locations Russian
    "location.dubai.marina": "Дубай Марина",
    "location.downtown": "Центр Дубая",
    "location.palm.jumeirah": "Палм Джумейра",
    "location.jvc": "Джумейра Виллидж Серкл",
    "location.business.bay": "Бизнес Бей",
    "location.dubai.maritime": "Дубай Маритайм Сити",

    // Properties Page Russian
    "properties.page.title": "Отобранные и тщательно",
    "properties.page.title2": "проверенные возможности",
    "properties.page.subtitle": "Каждый объект здесь прошёл строгие критерии отбора, чтобы стать вашей безопасной инвестицией",
    "properties.listings.title": "Списки недвижимости",
    "properties.listings.subtitle": "Просмотрите нашу отобранную коллекцию премиальной недвижимости",
    "properties.results.title": "Результаты поиска",
    "properties.our.listings": "Наши списки недвижимости",
    "property.status.ready": "Готово",
    "property.status.OffPlan": "На этапе планирования",
    "property.status.ForRent": "Сдаётся в аренду",
    "property.status.Sold": "Продано",

    // Properties View Russian
    "properties.view.grid": "Сетка",
    "properties.view.map": "Карта",

    // Properties Russian
    "properties.title": "Рекомендуемая недвижимость",
    "properties.filter.all": "Вся недвижимость",
    "properties.filter.featured": "Рекомендуемое",
    "properties.filter.ready": "Готово",
    "properties.filter.offplan": "В планах",
    "properties.found": "недвижимость найдена",
    "properties.no.results": "Недвижимость не найдена",
    "properties.try.different.filters": "Попробуйте изменить фильтры поиска, чтобы увидеть больше результатов.",
    "properties.suggestions":
      "Предложения: Попробуйте расширить ценовой диапазон, местоположение или тип недвижимости.",
    "properties.showing": "Показано",
    "properties.of": "из",
    "properties.results": "результатов",
    "properties.end.of.results": "ы просмотрели все объекты в подборке",

    // Property Card Russian
    "property.tour": "Тур",
    "property.featured": "Рекомендуемое",
    "property.new": "Новое",
    "property.share": "Поделиться недвижимостью",
    "property.remove.favorite": "Удалить из избранного",
    "property.add.favorite": "Добавить в избранное",
    "property.bedrooms": "Спальни",
    "property.bathrooms": "Ванные комнаты",
    "property.sqft": "Кв. футы",
    "property.view.details": "Посмотреть детали",
    "property.contact": "Обратиться",

    // Map Russian
    "properties.map.available": "Доступная недвижимость",
    "properties.map.selected": "Выбранная ндвижимость",
    "properties.map.properties": "Недвижимость",

    // Search Form Russian
    "search.property.type": "Тип недвижимости",
    "search.location": "Локация",
    "search.price.range": "Диапазон цен",
    "search.bedrooms": "Количество комнат",
    "search.apartment": "Квартира",
    "search.villa": "Вилла",
    "search.townhouse": "Таунхаус",
    "search.penthouse": "Пентхаус",
    "search.1.bedroom": "1 спальня",
    "search.2.bedrooms": "2 спальни",
    "search.3.bedrooms": "3 спальни",
    "search.4plus.bedrooms": "4+ спальни",

    // Filter Panel Russian
    "filters.title": "Параметры фильтрации",
    "filters.show": "Показать фильтры",
    "filters.hide": "Скрыть фильтры",
    "filters.clear": "Очистить все",
    "filters.apply": "Применить",
    "filters.reset": "Сбросить",
    "filters.search": "Поиск",
    "filters.search.placeholder": "Поиск недвижимости...",
    "filters.property.type": "Тип недвижимости",
    "filters.price.range": "Ценовой диапазон",
    "filters.bedrooms": "Спальни",
    "filters.bedrooms.range": "Спальни",
    "filters.bathrooms": "Ванные комнаты",
    "filters.bathrooms.range": "Ванные комнаты",
    "filters.location": "Местополжение",
    "filters.status": "Статус",
    "filters.amenities": "Удобства",
    "filters.tabs.basic": "Основные",
    "filters.tabs.advanced": "Расширенные",

    // Property Types Russian
    "filters.property.types.villa": "Вилла",
    "filters.property.types.apartment": "Квартира",
    "filters.property.types.penthouse": "Пентхаус",
    "filters.property.types.mansion": "Особняк",
    "filters.property.types.townhouse": "Таунхаус",

    // Sort Options Russian
    "filters.sort.label": "Сортировать по",
    "filters.sort.default": "По умолчанию",
    "filters.sort.price-asc": "Цена: по возрастанию",
    "filters.sort.price-desc": "Цена: по убыванию",
    "filters.sort.newest": "Сначала новые",
    "filters.sort.oldest": "Сначала старые",

    // Status Options Russian
    "filters.status.for-sale": "Продажа",
    "filters.status.for-rent": "Аренда",
    "filters.status.offplan": "В планах",
    "filters.ready": "Готово",
    "filters.offplan": "В планах",
    "filters.featured": "Рекомендуемое",

    // Amenities Russian
    "filters.amenities.pool": "Бассейн",
    "filters.amenities.garden": "Сад",
    "filters.amenities.garage": "Гараж",
    "filters.amenities.balcony": "Балкон",
    "filters.amenities.gym": "Спортзал",
    "filters.amenities.security": "Охрана",

    // FAQ Section
    "faq.title": "Часто задаваемые вопросы",
    "faq.subtitle": "с Викторией Ланкастер",
    "faq.quote":
      '"Я выбрала эти вопросы, потому что они отражают то, что люди действительно спрашивают меня - не только о покупке в Дубае, но о том, как я думаю, как работаю и что ценю. Я верю, что ясность строит доверие. Когда вы знаете, чего ожидать, вы можете принимать лучшие решения."',
    "faq.quote.author": "— Виктория Ланкастер",

    // Testimonials Section
    "testimonials.title": "Истории успеха клиентов",
    "testimonials.subtitle":
      "Послушайте инвесторов, которые доверили Виктории Ланкастер свое путешествие в недвижимость Дубая",
    "testimonials.join.title": "Присоединяйтесь к 585+ довольным инвесторам",
    "testimonials.join.subtitle":
      "о овы начать свое инвестиционное путешествие в недвижимость Дубая? Позвольте Виктории помочь вам достичь ваших целей.",
    "testimonials.total.value": "Общая стоимость сделок",
    "testimonials.years.experience": "Лет опыта",
    "testimonials.client.satisfaction": "Удовлетворенность клиентов",

    
    "contact.title": "Свяжитесь со мной",
    "contact.subtitle": "Получите персональную консультацию по недвижимости",
    "areas.title": "Престижные районы Дубая",
    "blog.title": "Аналитика недвижимости",

      // Evaluation
  "evaluation.form.title": "Инструмент оценки недвижимости",
  "evaluation.page.title": "Оценка объекта",
  "evaluation.page.subtitle":
    "Думаете о следующем шаге? Узнайте реальную стоимость вашей недвижимости и её потенциал дохода",
  "evaluation.description.1":
    "Виктория предлагает конфиденциальную, основанную на данных оценку для владельцев недвижимости в Дубае и Великобритании. Планируете ли вы продавать, сдавать в аренду или просто хотите ясности,",
  "evaluation.description.2": "вы получите стратегическое понимание, а не просто цифру.",
  "evaluation.description.3": "Подкрепленная 15+ годами опыта, ваша оценка будет включать:",
  "evaluation.feature.1": "Точную рыночную стоимость",
  "evaluation.feature.2": "Инвестиционный и доходный потенциал",
  "evaluation.feature.3": "Стратегию продажи (если применимо)",
  "evaluation.description.4":
    "Отправьте свои данные ниже, Виктория лично оценит вашу недвижимость и посоветует лучший следующий шаг.",
  "evaluation.stats.1": "сделок с недвижимостью",
  "evaluation.stats.2": "совокупный объём",
  "evaluation.stats.3": "лет опыта",
  "evaluation.contact.info": "Контактные данные",
  "evaluation.name": "Полное имя",
  "evaluation.name.placeholder": "Введите ваше полное имя",
  "evaluation.email": "Адрес электронной почты",
  "evaluation.email.placeholder": "Введите ваш email",
  "evaluation.phone": "Номер телефона",
  "evaluation.phone.placeholder": "Введите ваш номер телефона",
  "evaluation.property.type": "Тип недвижимости",
  "evaluation.select.type": "Выберите тип недвижимости",
  "evaluation.location": "Местоположение",
  "evaluation.select.location": "Выберите местоположение",
  "evaluation.bedrooms": "Спальни",
  "evaluation.select.beds": "Выберите количество спален",
  "evaluation.bathrooms": "Ванные комнаты",
  "evaluation.select.baths": "Выберите количество ванных",
  "evaluation.area": "Площадь (кв. фут)",
  "evaluation.area.placeholder": "например, 1200",
  "evaluation.condition": "Состояние недвижимости",
  "evaluation.select.condition": "Выберите состояние",
  "evaluation.condition.excellent": "Отличное",
  "evaluation.condition.good": "Хорошее",
  "evaluation.condition.fair": "Удовлетворительное",
  "evaluation.condition.renovation": "Требует ремонта",
  "evaluation.year.built": "Год постройки",
  "evaluation.year.placeholder": "например, 2020",
  "evaluation.amenities": "Удобства",
  "evaluation.amenities.placeholder": "например, Бассейн, Спортзал, Парковка",
  "evaluation.description": "Дополнительное описание",
  "evaluation.description.placeholder": "Любые дополнительные детали о вашей недвижимости...",
  "evaluation.button": "Получить оценку недвижимости",
  "evaluation.success.title": "Оценка успешно отправлена!",
  "evaluation.success.message":
    "Спасибо за отправку запроса на оценку недвижимости. Наша команда экспертов рассмотрит детали вашей недвижимости и свяжется с вами в течение 24 часов с комплексным анализом рынка.",
  "evaluation.success.contact.title": "Контактная информация",
  "evaluation.success.new.evaluation": "Отправить новую оценку",


    // Contact Page Russian
    "contact.page.title": "Свяжитесь со мной",
    "contact.page.subtitle": "Получите персональную консультацию по недвижимости",
    "contact.form.title": "Напишите мне",
    "contact.first.name": "Имя",
    "contact.first.name.placeholder": "Введите ваше имя",
    "contact.last.name": "Фамилия",
    "contact.last.name.placeholder": "Введите вашу фамилию",
    "contact.email": "Электронная почта",
    "contact.email.placeholder": "Введите ваш адрес электронной почты",
    "contact.phone": "Телефон",
    "contact.phone.placeholder": "Введите ваш номер телефона",
    "contact.budget": "Бюджет",
    "contact.budget.placeholder": "например, $1M - $2M",
    "contact.message": "Сообщение",
    "contact.message.placeholder": "Расскажите нам о ваших требованиях к недвижимости...",
    "contact.send": "Отправить",
    "contact.info.title": "Контактные данные",
    "contact.info.phone": "Телефон",
    "contact.info.email": "Электронная почта",
    "contact.info.office": "Офис",
    "contact.info.office.location": "Дубай, Объединенные Арабские Эмираты",
    "contact.info.hours": "Часы работы",
    "contact.info.hours.time": "Воскресенье - Четверг: 9:00 - 18:00",
    "contact.location.title": "Наш адрес",

    // Properties Page & Listings Russian
    "properties.page.title.alt": "Лично отобранные. Стратегически расположенные.",
    "properties.page.subtitle.alt": "Никакого шума. Никаких массовых списков. Только отобранные возможности, проверенные, усовершенствованные и готовые к инвестициям.",
    "home.properties.title": "Откройте ключевые возможности",
    "home.properties.subtitle": "Эксклюзивная недвижимость, отобранная с особой тщательностью",
    "home.properties.loading": "Загружаем нашу тщательно отобранную коллекцию премиальной недвижимости...",

    // Footer Russian
    "footer.description": "Ваш надёжный партнёр в мире инвестиций в недвижимость",
    "footer.quick.links": "Быстрые ссылки",
    "footer.contact.info": "Контактная информация",
    "footer.Location": "Дубай, Объединённые Арабские Эмираты",
    "footer.newsletter": "Новостная рассылка",
    "footer.newsletter.description": "Подпишитесь сейчас, чтобы получать ключевые новости и проверенные данные",
    "footer.email.placeholder": "Ваш адрес электронной почты",
    "footer.subscribe": "Подпишитесь",
    "footer.copyright": "© 2025 VL Недвижимость. Все права защищены.",
    "footer.social.follow": "Следите за нами",
    "footer.contact.address": "Дубай, Объединённые Арабские Эмираты",
    "footer.contact.phone": "+971 4 2794 800",
    "footer.contact.email": "victoria.lancaster@selectproperty.ae",

    // Testimonials Russian
    "testimonials.title.alt": "Виктории доверяют инвесторы со всего мира",
    "testimonials.subtitle.alt": "Отзывы клиентов, которые выбрали стратегию и результат",
    "testimonials.join.alt": "Присоединяйтесь к 500+ успешным инвесторам",
    "testimonials.ready.alt": "Готовы начать свое инвестиционное путешествие в недвижимость Дубая? Позвольте Виктории помочь вам достичь ваших целей.",
    "testimonials.total.value.alt": "Общая стоимость сделок",
    "testimonials.years.experience.alt": "Лет опыта",
    "testimonials.property": "Недвижимость",
    "testimonials.nearby.locations": "Близлежащие локации",
    "testimonials.locations.found": "локаций найдено",
    "testimonials.no.locations": "Локации не найдены",
    "testimonials.try.different": "Попробуйте поискать в другой области",

    // Welcome Popup Russian
    "welcome.title": "Виктория Ланкастер",
     "welcome.title2": "Директор по инвестициям и управлению недвижимостью",
    "welcome.subtitle": "Более пятнадцати лет я сопровождаю инвесторов со всего мира, направляя их капитал в премиальные объекты недвижимости.",
    "welcome.subtitle2": "Моя миссия превращать амбиции в реальные активы с устойчивой стоимостью и ощутимой доходностью.",
    "welcome.subtitle1": "Более пятнадцати лет я сопровождаю инвесторов со всего мира,",
    "welcome.subtitle2+": "направляя их капитал в премиальные объекты недвижимости",
    "welcome.subtitle3": "Моя миссия — превращать амбиции в реальные активы с устойчивой стоимостью и ощутимой доходностью",
    "welcome.experience": "Продано объектов",
    "welcome.experience2": " лет опыта",
    "welcome.experience.detail": "В Дубае и Великобритании",
    "welcome.strategic": "млрд дирхамов ОАЭ",
    "welcome.strategic.detail": "рекомендую лучшую недвижимость для вас",
    "welcome.get.in.touch": "Свяжитесь со мной",
    "welcome.full.name": "Полное имя",
    "welcome.full.name.placeholder": "Ваше полное имя",
    "welcome.phone.number": "Номер телефона",
    "welcome.phone.placeholder": "xxx xx xxxx ",
    "welcome.email.address": "Адрес электронной почты",
    "welcome.email.placeholder": "your.email@example.com",
    "welcome.details": "Детали",
    "welcome.details.placeholder": "Расскажите мне о ваших инвестиционных целях, предпочитаемых районах, бюджетном диапазоне или любых конкретных требованиях...",
    "welcome.skip": "Пропустить пока",
    "welcome.send": "Отправить мне!",
    "welcome.thank.you": "Спасибо!",
    "welcome.thank.you.message": "Ваш запрос в руках.",
    "welcome.expect.contact": "Я скоро свяжусь с вами.",

    // Common Russian
    "common.loading": "Загрузка...",
  },
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguage] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)

  const isRTL = language === "ar"

  useEffect(() => {
    setMounted(true)
    // Load saved language from localStorage
    try {
      const savedLanguage = localStorage.getItem("vl-language") as Language
      if (savedLanguage && ["en", "ar", "ru"].includes(savedLanguage)) {
        setLanguage(savedLanguage)
      }
    } catch (error) {
      console.error("Failed to access localStorage:", error)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      // Save language to localStorage
      try {
        localStorage.setItem("vl-language", language)
      } catch (error) {
        console.error("Failed to write to localStorage:", error)
      }

      // Update document direction for RTL
      if (typeof document !== "undefined") {
        document.documentElement.dir = isRTL ? "rtl" : "ltr"
        document.documentElement.lang = language
      }
    }
  }, [language, isRTL, mounted])

  const t = (key: string): string => {
    const currentTranslations = translations[language] || translations.en
    const translation = currentTranslations[key as keyof typeof currentTranslations]

    // Return the translation if found, otherwise return a fallback
    if (translation) {
      return translation
    }

    // Try to get from English as fallback
    const englishTranslation = translations.en[key as keyof typeof translations.en]
    if (englishTranslation) {
      return englishTranslation
    }

    // If no translation found, return a user-friendly version of the key
    return (
      key
        .split(".")
        .pop()
        ?.replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase()) || key
    )
  }

  const contextValue = {
    language,
    setLanguage,
    t,
    isRTL,
  }

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
}

