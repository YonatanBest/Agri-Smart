"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'am', name: 'Amharic', flag: '🇪🇹' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
  { code: 'sw', name: 'Swahili', flag: '🇹🇿' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩' }
]

interface LanguageContextType {
  selectedLanguage: string
  setSelectedLanguage: (language: string) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Comprehensive translations for the home page
const translations = {
  en: {
    // Navigation
    products: "Products",
    solutions: "Solutions", 
    aboutUs: "About-Us",
    letsContact: "Let's Contact",
    
    // Hero Section
    heroTitle: "Empowering Farmers with Intelligent AI Solutions",
    heroSubtitle: "Agrilo provides cutting-edge artificial intelligence to optimize crop yields, manage resources, and predict market trends for a more sustainable and profitable future.",
    getStarted: "Get Started",
    goToDashboard: "Go to Dashboard",
    learnMore: "Learn More",
    
    // Features Section
    keyFeatures: "Key Features",
    featuresSubtitle: "Our AI solutions are designed to address the most pressing challenges faced by modern farmers.",
    precisionFarming: "Precision Farming",
    precisionFarmingDesc: "Optimize planting, irrigation, and harvesting with data-driven insights.",
    diseaseDetection: "Disease Detection", 
    diseaseDetectionDesc: "Early identification of crop diseases and pests to minimize losses.",
    weatherPrediction: "Weather Prediction",
    weatherPredictionDesc: "Accurate localized weather forecasts to plan farming activities effectively.",
    marketAnalysis: "Market Analysis",
    marketAnalysisDesc: "Predict market prices and demand to make informed selling decisions.",
    resourceOptimization: "Resource Optimization",
    resourceOptimizationDesc: "Efficiently manage water, fertilizer, and energy consumption.",
    sustainablePractices: "Sustainable Practices",
    sustainablePracticesDesc: "Promote eco-friendly farming methods for long-term environmental health.",
    
    // Language Selection
    selectLanguage: "Select Language",
    chooseYourLanguage: "Choose your preferred language",
    continue: "Continue",
    
    // About Section
    about_Us: "What we believe",
    aboutDescription: "At Agrilo, we believe in the power of technology to transform agriculture. Our team of AI specialists, agronomists, and data scientists are dedicated to building intelligent tools that empower farmers to make smarter decisions, increase productivity, and foster sustainable growth. We are committed to supporting the global farming community with innovative and accessible solutions.",
    
    // Main Page Navigation
    home: "Home",
    monitor: "Monitor", 
    chat: "Chat",
    calendar: "Calendar",
    profile: "Profile",
    
    // Main Page Content
    farmManagement: "Farm Management",
    quickActions: "Quick Actions",
    cropDiagnosis: "Crop Diagnosis",
    askAIExpert: "Ask AI Expert",
    systemOnline: "System Online",
    pendingNotifications: "pending notifications",
    dashboard: "Dashboard",
    loading: "Loading...",
    
    // Alert Messages
    pestAlert: "🚨 AI detected potential pest activity in Field A. Schedule inspection today!",
    
    // User Info
    locationNotSet: "Location not set",
    user: "User",
    
    // Home Page
    welcomeBack: "Welcome back",
    farmer: "Farmer",
    yourVirtualFarmland: "Your virtual farmland awaits",
    yourCrops: "Your Crops",
    currentlyGrowing: "Currently Growing",
    planningToGrow: "Planning to Grow",
    noCropsYet: "No crops added yet",
    addCropsToGetStarted: "Add crops to get started",
    noCurrentCrops: "No current crops",
    addCurrentCropsToGetStarted: "Add current crops to get started",
    noPlannedCrops: "No planned crops",
    addPlannedCropsToGetStarted: "Add planned crops to get started",
    yourLocation: "Your Location",
    mapPlaceholder: "Map will be displayed here",
    aiCropRecommendations: "AI Crop Recommendations",
    getRecommendations: "Get Recommendations",
    confidence: "Confidence",
    noRecommendationsYet: "No recommendations yet",
    clickGetRecommendations: "Click 'Get Recommendations' to see AI suggestions",
    farmerInformation: "Farmer Information",
    name: "Name",
    experience: "Years of Experience",
    years: "years",
    userType: "User Type",
    mainGoal: "Main Goal",
    preferredLanguage: "Preferred Language",
    location: "Location",
    notProvided: "Not provided",
    soilInformation: "Soil Information",
    texture: "Texture",
    
    // Solution Section
    faqs: "FAQs",
    faq1q: "How does Agrilo's AI crop recommendation work?",
    faq1a: "Our AI analyzes your soil type, location, weather patterns, and farming goals to provide personalized crop recommendations that maximize yield and sustainability.",
    faq2q: "What data does Agrilo use for analysis?",
    faq2a: "We use soil composition data, weather forecasts, historical crop performance, market prices, and local agricultural practices to generate accurate recommendations.",
    faq3q: "Is Agrilo suitable for all types of farming?",
    faq3a: "Yes! Agrilo works for small-scale family farms, large commercial operations, and everything in between. Our recommendations adapt to your specific farming context.",
    feature1: "AI-Powered Crop Recommendations",
    feature2: "Real-Time Weather Integration",
    feature3: "Soil Analysis & Mapping",
    feature4: "Multi-Language Support",
    feature5: "Precision Farming Tools",
    aboutUsTitle: "About Agrilo Platform",
    aboutUsDescription: "Agrilo is a revolutionary agricultural technology platform that combines artificial intelligence, data science, and precision farming to help farmers make smarter decisions. Our platform analyzes soil conditions, weather patterns, and market trends to provide personalized crop recommendations that maximize yield while promoting sustainable farming practices.",
    aboutUsMission: "Empowering farmers worldwide with AI-driven agricultural insights for a sustainable future.",
    mission: "Mission",
    signIn: "Sign-in",
    
    // Auth Options Page
    createAccount: "Create Account",
    joinAgrilo: "Join Agrilo to start your smart farming journey",
    signInToContinue: "Sign in to continue your farming journey",
    signUp: "Sign Up",
    fullName: "Full Name",
    enterFullName: "Enter your full name",
    emailAddress: "Email Address",
    enterEmailAddress: "Enter your email address",
    password: "Password",
    enterPassword: "Enter your password",
    confirmPassword: "Confirm Password",
    confirmYourPassword: "Confirm your password",
    createAccountButton: "Create Account",
    signInButton: "Sign In",
    newUserSetup: "New User Setup",
    newUserSetupDesc: "New users will go through a quick setup process to personalize their experience.",
    backToHome: "Back to Home",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",
    emailRequired: "Email is required",
    invalidEmailFormat: "Invalid email format",
    passwordRequired: "Password is required",
    passwordMinLength: "Password must be at least 6 characters",
    nameRequired: "Name is required",
    confirmPasswordRequired: "Please confirm your password",
    passwordsDoNotMatch: "Passwords do not match"
  },
  am: {
    // Navigation
    products: "ምርቶች",
    solutions: "መፍትሄዎች",
    aboutUs: "ስለ እኛ",
    letsContact: "እንወያይ",
    
    // Hero Section
    heroTitle: "የአርሶ አደሮችን በዘመናዊ የአሰልጣኝ አይ ስልቶች እንዲያበረታቱ",
    heroSubtitle: "አግሪሎ የተሻሻለው የአሰልጣኝ አይ ቴክኖሎጂ ያቀርባል የዝርያ ምርትን ለማሳደግ፣ ሀብቶችን ለማስተዳደር እና የገበያ አዝማሚያዎችን ለመተንበይ ለተጨማሪ ዘላቂ እና ትርፋማ መስክ።",
    getStarted: "ጀምር",
    goToDashboard: "ወደ ዳሽቦርድ ይሂዱ",
    learnMore: "ተጨማሪ ይወቁ",
    
    // Features Section
    keyFeatures: "ዋና ባህሪያት",
    featuresSubtitle: "የእኛ የአይ ስልቶች የዘመናዊ አርሶ አደሮች የሚያጋጡ ችግሮችን ለመፍታት ተዘጋጅተዋል።",
    precisionFarming: "የትክክለኛ እርሻ",
    precisionFarmingDesc: "የመትከል፣ የውሃ ማጠጣት እና የመሰብሰብ ሂደትን በውሂብ ላይ የተመሰረተ ግንዛቤ ያሳድጉ።",
    diseaseDetection: "የበሽታ መለያ",
    diseaseDetectionDesc: "የዝርያ በሽታዎችን እና ጎጆዎችን በጊዜ ማወቅ ኪሳራዎችን ለመቀነስ።",
    weatherPrediction: "የአየር ሁኔታ ትንቢት",
    weatherPredictionDesc: "የእርሻ ስራዎችን ለመደራጀት ትክክለኛ የአየር ሁኔታ ትንቢት።",
    marketAnalysis: "የገበያ ትንተና",
    marketAnalysisDesc: "የገበያ ዋጋዎችን እና ፍላጎትን ትንበይ ለመረጃ ያለው የመሸጫ ውሳኔ ያድርጉ።",
    resourceOptimization: "የሀብት ማሻሻያ",
    resourceOptimizationDesc: "ውሃ፣ ማዳበሪያ እና የኢነርጂ ፍጆታን በቅልጡፍ ያስተዳድሩ።",
    sustainablePractices: "ዘላቂ ስራዎች",
    sustainablePracticesDesc: "ለረጅም ጊዜ የአካባቢ ጥበቃ የሚያገለግሉ የአካባቢ ደህንነት ያላቸው የእርሻ ዘዴዎችን ያስፋፉ።",
    
    // Language Selection
    selectLanguage: "ቋንቋ ይምረጡ",
    chooseYourLanguage: "የሚያሻዎትን ቋንቋ ይምረጡ",
    continue: "ቀጥል",
    
    // About Section
    about_Us: "ስለ እኛ",
    aboutDescription: "በአግሪሎ፣ ቴክኖሎጂ እርሻን ለመለወጥ ያለውን ኃይል እናምናለን። የእኛ የአይ ስፔሻሊስቶች፣ አግሮኖሚስቶች እና የውሂብ ሳይንቲስቶች ቡድን አርሶ አደሮች የተሻለ ውሳኔ እንዲያደርጉ፣ ምርታማነት እንዲጨምሩ እና ዘላቂ እድገት እንዲያሳድጉ የሚያስችሉ ዘመናዊ መሳሪያዎችን ለመገንባት ቁርጠኞች ናቸው። በዘመናዊ እና ተደራሽ መፍትሄዎች የዓለም አርሶ አደር ማህበረሰብን ለመደገፍ ቁርጠኞች ነን።",
    
    // Main Page Navigation
    home: "የመነሻ ገጽ",
    monitor: "መከታተል", 
    chat: "ውይይት",
    calendar: "መዝገብ",
    profile: "መገለጫ",
    
    // Main Page Content
    farmManagement: "የእርሻ አስተዳደር",
    quickActions: "ፈጣን ድርጊቶች",
    cropDiagnosis: "የዝርያ ምርመራ",
    askAIExpert: "አይ ስፔሻሊስት ይጠይቁ",
    systemOnline: "ስርዓቱ በመስመር ላይ ነው",
    pendingNotifications: "የሚጠበቁ ማስታወቂያዎች",
    dashboard: "የመከወኛ ሰሌዳ",
    loading: "በመጫን ላይ...",
    
    // Alert Messages
    pestAlert: "🚨 አይ በግቢ ኤ ውስጥ የጎጆ እንቅስቃሴ እንደሚያውቅ አስተውሏል። ዛሬ ምርመራ ያዘጋጁ!",
    
    // User Info
    locationNotSet: "አካባቢ አልተዘጋጀም",
    user: "ተጠቃሚ",
    
    // Home Page
    welcomeBack: "እንደገና እንኳን ደስ አለዎት",
    farmer: "አርሶ አደር",
    yourVirtualFarmland: "የእርስዎ ምናባዊ እርሻ ያስተጋራዎታል",
    yourCrops: "የእርስዎ ዝርያዎች",
    currentlyGrowing: "አሁን ያለው",
    planningToGrow: "የሚያድገው",
    noCropsYet: "ገና ዝርያ አልተጨመረም",
    addCropsToGetStarted: "ዝርያዎችን ያክሉ ለመጀመር",
    noCurrentCrops: "አሁን ያለው ዝርያ የለም",
    addCurrentCropsToGetStarted: "አሁን ያለው ዝርያ ያክሉ ለመጀመር",
    noPlannedCrops: "የታቀደ ዝርያ የለም",
    addPlannedCropsToGetStarted: "የታቀደ ዝርያ ያክሉ ለመጀመር",
    yourLocation: "አካባቢዎ",
    mapPlaceholder: "ካርታ እዚህ ይታያል",
    aiCropRecommendations: "የአይ ዝርያ ምክር",
    getRecommendations: "ምክሮችን ያግኙ",
    confidence: "እምነት",
    noRecommendationsYet: "ገና ምክር የለም",
    clickGetRecommendations: "የአይ ምክሮችን ለማየት 'ምክሮችን ያግኙ' ይጫኑ",
    farmerInformation: "የአርሶ አደር መረጃ",
    
    // Solution Section
    faq1q: "የአግሪሎ የአይ ዝርያ ምክር እንዴት ይሰራል?",
    faq1a: "የእኛ አይ የእርስዎን የአፈር አይነት፣ አካባቢ፣ የአየር ሁኔታ ንድፍ እና የእርሻ ግቦች ያዳምጣል የግል ዝርያ ምክሮችን ለመስጠት የምርት እና ዘላቂነትን ያሳድጋል።",
    faq2q: "አግሪሎ ለመተንተን ምን ዓይነት ውሂብ ይጠቀማል?",
    faq2a: "የአፈር ውህደት ውሂብ፣ የአየር ሁኔታ ትንቢት፣ የታሪክ ዝርያ አድማጭ፣ የገበያ ዋጋዎች እና የአካባቢ እርሻ ስራዎችን እንጠቀማለን ትክክለኛ ምክሮችን ለመፍጠር።",
    faq3q: "አግሪሎ ለሁሉም ዓይነት እርሻ ተስማሚ ነው?",
    faq3a: "አዎ! አግሪሎ ለትንሽ የቤተሰብ እርሻዎች፣ ለትልልቅ የንግድ ስራዎች እና ለሁሉም መካከለኛ እርሻዎች ይሰራል። የእኛ ምክሮች ወደ የእርስዎ የተለየ የእርሻ አውድ ይስማማሉ።",
    feature1: "የአይ የተጎለበተ ዝርያ ምክሮች",
    feature2: "የተሟላ ጊዜ የአየር ሁኔታ ውህደት",
    feature3: "የአፈር ትንተና እና ካርታ ማውጫ",
    feature4: "የብዙ ቋንቋ ድጋፍ",
    feature5: "የትክክለኛ እርሻ መሳሪያዎች",
    aboutUsTitle: "ስለ አግሪሎ መድረኳ",
    aboutUsDescription: "አግሪሎ አርሶ አደሮች የተሻለ ውሳኔ እንዲያደርጉ የሚያገለግል የአይ፣ የውሂብ ሳይንስ እና የትክክለኛ እርሻ የሚያጣምር አብዮታዊ የእርሻ ቴክኖሎጂ መድረኳ ነው። የእኛ መድረኳ የአፈር ሁኔታዎችን፣ የአየር ሁኔታ ንድፍ እና የገበያ አዝማሚያዎችን ያዳምጣል የግል ዝርያ ምክሮችን ለመስጠት የምርት እና ዘላቂ እርሻ ስራዎችን ያሳድጋል።",
    aboutUsMission: "የዓለም አርሶ አደሮችን በአይ የተጎለበተ የእርሻ ግንዛቤ ለዘላቂ መስክ እንዲያበረታቱ።",
    name: "ስም",
    
    // Auth Options Page
    createAccount: "መለያ ፍጠር",
    joinAgrilo: "የብልሽ እርሻ ጉዞዎን ለመጀመር አግሪሎ ላይ ይቀላቀሉ",
    signInToContinue: "የእርሻ ጉዞዎን ለመቀጠል ይግቡ",
    signIn: "ግባ",
    signUp: "ይመዝገቡ",
    fullName: "ሙሉ ስም",
    enterFullName: "ሙሉ ስምዎን ያስገቡ",
    emailAddress: "የኢሜይል አድራሻ",
    enterEmailAddress: "የኢሜይል አድራሻዎን ያስገቡ",
    password: "የይለፍ ቃል",
    enterPassword: "የይለፍ ቃልዎን ያስገቡ",
    confirmPassword: "የይለፍ ቃል ያረጋግጡ",
    confirmYourPassword: "የይለፍ ቃልዎን ያረጋግጡ",
    createAccountButton: "መለያ ፍጠር",
    signInButton: "ግባ",
    newUserSetup: "የአዲስ ተጠቃሚ ማዘጋጀት",
    newUserSetupDesc: "አዲስ ተጠቃሚዎች የግል ማስተማሪያ ሂደት ያለፍ ይሆናሉ።",
    backToHome: "ወደ መነሻ ገጽ ይመለሱ",
    alreadyHaveAccount: "የተመዘገቡ ነዎት?",
    dontHaveAccount: "መለያ የለዎትም?",
    emailRequired: "ኢሜይል ያስፈልጋል",
    invalidEmailFormat: "የማይሰራ የኢሜይል ቅርጸት",
    passwordRequired: "የይለፍ ቃል ያስፈልጋል",
    passwordMinLength: "የይለፍ ቃል ቢያንስ 6 ፊደላት ሊሆን ይገባል",
    nameRequired: "ስም ያስፈልጋል",
    confirmPasswordRequired: "የይለፍ ቃልዎን ያረጋግጡ",
    passwordsDoNotMatch: "የይለፍ ቃሎች አይጣጣሙም",
    experience: "የስራ ስህተት",
    years: "ዓመት",
    userType: "የተጠቃሚ አይነት",
    mainGoal: "ዋና ግብ",
    preferredLanguage: "የሚያሻው ቋንቋ",
    location: "አካባቢ",
    notProvided: "አልተሰጠም",
    soilInformation: "የአፈር መረጃ",
    texture: "የአፈር አይነት"
  },
  no: {
    // Navigation
    products: "Produkter",
    solutions: "Løsninger",
    aboutUs: "Om Oss",
    letsContact: "La Oss Kontakte",
    
    // Hero Section
    heroTitle: "Støtter Bønder med Intelligente AI-løsninger",
    heroSubtitle: "Agrilo tilbyr banebrytende kunstig intelligens for å optimalisere avling, administrere ressurser og forutsi markedsutvikling for en mer bærekraftig og lønnsom fremtid.",
    getStarted: "Kom i Gang",
    goToDashboard: "Gå til Dashbord",
    learnMore: "Lær Mer",
    
    // Features Section
    keyFeatures: "Hovedfunksjoner",
    featuresSubtitle: "Våre AI-løsninger er designet for å håndtere de mest presserende utfordringene som moderne bønder møter.",
    precisionFarming: "Presisjonslandbruk",
    precisionFarmingDesc: "Optimaliser planting, vanning og høsting med datadrevne innsikter.",
    diseaseDetection: "Sykdomsdeteksjon",
    diseaseDetectionDesc: "Tidlig identifikasjon av plantesykdommer og skadedyr for å minimere tap.",
    weatherPrediction: "Værvarsling",
    weatherPredictionDesc: "Nøyaktige lokale værmeldinger for å planlegge landbruksaktiviteter effektivt.",
    marketAnalysis: "Markedsanalyse",
    marketAnalysisDesc: "Forutsi markedspriser og etterspørsel for å ta informerte salgsbeslutninger.",
    resourceOptimization: "Ressursoptimalisering",
    resourceOptimizationDesc: "Administrer vann, gjødsel og energiforbruk effektivt.",
    sustainablePractices: "Bærekraftige Praksiser",
    sustainablePracticesDesc: "Fremme miljøvennlige landbruksmetoder for langsiktig miljøhelse.",
    
    // Language Selection
    selectLanguage: "Velg Språk",
    chooseYourLanguage: "Velg ditt foretrukne språk",
    continue: "Fortsett",
    
    // About Section
    about_Us: "Om Oss",
    aboutDescription: "Hos Agrilo tror vi på teknologiens kraft til å forvandle landbruket. Vårt team av AI-spesialister, agronomer og datavitenskapsmenn er dedikert til å bygge intelligente verktøy som styrker bønder til å ta smartere beslutninger, øke produktiviteten og fremme bærekraftig vekst. Vi er forpliktet til å støtte det globale landbrukssamfunnet med innovative og tilgjengelige løsninger.",
    
    // Main Page Navigation
    home: "Hjem",
    monitor: "Overvåk", 
    chat: "Chat",
    calendar: "Kalender",
    profile: "Profil",
    
    // Main Page Content
    farmManagement: "Gårdsstyring",
    quickActions: "Hurtighandlinger",
    cropDiagnosis: "Avlingsdiagnose",
    askAIExpert: "Spør AI-ekspert",
    systemOnline: "System Online",
    pendingNotifications: "ventende varsler",
    dashboard: "Dashbord",
    loading: "Laster...",
    
    // Alert Messages
    pestAlert: "🚨 AI oppdaget potensiell skadeaktivitet i Aker. Planlegg inspeksjon i dag!",
    
    // User Info
    locationNotSet: "Plassering ikke satt",
    user: "Bruker",
    
    // Solution Section
    faqs: "FAQ",
    faq1q: "Hvordan fungerer Agrilos AI-avlingsanbefaling?",
    faq1a: "Vår AI analyserer din jordtype, plassering, værmønstre og landbruksmål for å gi personlige avlingsanbefalinger som maksimerer avling og bærekraft.",
    faq2q: "Hvilke data bruker Agrilo til analyse?",
    faq2a: "Vi bruker jordsammensetningsdata, værmeldinger, historisk avlingsytelse, markedspriser og lokale landbrukspraksis for å generere nøyaktige anbefalinger.",
    faq3q: "Er Agrilo egnet for alle typer landbruk?",
    faq3a: "Ja! Agrilo fungerer for småskala familiebruk, store kommersielle operasjoner og alt i mellom. Våre anbefalinger tilpasser seg din spesifikke landbrukskontekst.",
    feature1: "AI-drevne avlingsanbefalinger",
    feature2: "Sanntids værintegrasjon",
    feature3: "Jordanalyse og kartlegging",
    feature4: "Flerspråklig støtte",
    feature5: "Presisjonslandbruksverktøy",
    aboutUsTitle: "Om Agrilo-plattformen",
    aboutUsDescription: "Agrilo er en revolusjonerende landbruksteknologiplattform som kombinerer kunstig intelligens, datavitenskap og presisjonslandbruk for å hjelpe bønder med å ta smartere beslutninger. Plattformen vår analyserer jordforhold, værmønstre og markeds trender for å gi personlige avlingsanbefalinger som maksimerer avling samtidig som den fremmer bærekraftig landbruk.",
    aboutUsMission: "Å styrke bønder over hele verden med AI-drevne landbruksinnsikter for en bærekraftig fremtid.",
    mission: "Oppdrag",
    
    // Auth Options Page
    createAccount: "Opprett konto",
    welcomeBack: "Velkommen tilbake",
    joinAgrilo: "Bli med Agrilo for å starte din smarte landbruksreise",
    signInToContinue: "Logg inn for å fortsette din landbruksreise",
    signIn: "Logg inn",
    signUp: "Registrer deg",
    fullName: "Fullt navn",
    enterFullName: "Skriv inn ditt fulle navn",
    emailAddress: "E-postadresse",
    enterEmailAddress: "Skriv inn din e-postadresse",
    password: "Passord",
    enterPassword: "Skriv inn ditt passord",
    confirmPassword: "Bekreft passord",
    confirmYourPassword: "Bekreft ditt passord",
    createAccountButton: "Opprett konto",
    signInButton: "Logg inn",
    newUserSetup: "Ny brukeroppsett",
    newUserSetupDesc: "Nye brukere vil gå gjennom en rask oppsettprosess for å tilpasse opplevelsen.",
    backToHome: "Tilbake til hjem",
    alreadyHaveAccount: "Har du allerede en konto?",
    dontHaveAccount: "Har du ikke en konto?",
    emailRequired: "E-post er påkrevd",
    invalidEmailFormat: "Ugyldig e-postformat",
    passwordRequired: "Passord er påkrevd",
    passwordMinLength: "Passord må være minst 6 tegn",
    nameRequired: "Navn er påkrevd",
    confirmPasswordRequired: "Vennligst bekreft passordet ditt",
    passwordsDoNotMatch: "Passordene matcher ikke"
  },
  sw: {
    // Navigation
    products: "Bidhaa",
    solutions: "Suluhisho",
    aboutUs: "Kuhusu Sisi",
    letsContact: "Tuwasiliane",
    
    // Hero Section
    heroTitle: "Kuwawezesha Wakulima na Suluhisho za AI za Busara",
    heroSubtitle: "Agrilo inatoa artificial intelligence ya kisasa kukarabati mavuno, kusimamia rasilimali, na kutabiri mwelekeo wa soko kwa mustakabali wa endelevu na wa faida.",
    getStarted: "Anza",
    goToDashboard: "Nenda kwenye Dashibodi",
    learnMore: "Jifunze Zaidi",
    
    // Features Section
    keyFeatures: "Vipengele Muhimu",
    featuresSubtitle: "Suluhisho zetu za AI zimeundwa kushughulikia changamoto muhimu zaidi zinazowakabili wakulima wa kisasa.",
    precisionFarming: "Kilimo cha Usahihi",
    precisionFarmingDesc: "Boresha kupanda, umwagiliaji, na kuvuna kwa ufahamu unaoendeshwa na data.",
    diseaseDetection: "Ugunduzi wa Magonjwa",
    diseaseDetectionDesc: "Utambulishaji wa mapema wa magonjwa ya mazao na wadudu kudumisha hasara.",
    weatherPrediction: "Utabiri wa Hali ya Hewa",
    weatherPredictionDesc: "Utabiri sahihi wa hali ya hewa ya ndani kupanga shughuli za kilimo kwa ufanisi.",
    marketAnalysis: "Uchambuzi wa Soko",
    marketAnalysisDesc: "Tahmini bei za soko na mahitaji kufanya maamuzi ya uuzaji yenye ufahamu.",
    resourceOptimization: "Boresha Rasilimali",
    resourceOptimizationDesc: "Simamia maji, mbolea, na matumizi ya nishati kwa ufanisi.",
    sustainablePractices: "Mazoea Endelevu",
    sustainablePracticesDesc: "Kuendeleza mbinu za kilimo zinazofaa mazingira kwa afya ya muda mrefu ya mazingira.",
    
    // Language Selection
    selectLanguage: "Chagua Lugha",
    chooseYourLanguage: "Chagua lugha unayopendelea",
    continue: "Endelea",
    
    // About Section
    about_Us: "Kuhusu Sisi",
    aboutDescription: "Katika Agrilo, tunamini nguvu ya teknolojia kubadilisha kilimo. Timu yetu ya wataalam wa AI, wataalam wa kilimo, na wanasayansi wa data wamejitolea kujenga zana za busara zinazowezesha wakulima kufanya maamuzi ya busara zaidi, kuongeza uzalishaji, na kukuza ukuaji endelevu. Tumejitolea kusaidia jamii ya kilimo ya ulimwengu kwa suluhisho za uvumbuzi na zinazopatikana.",
    
    // Main Page Navigation
    home: "Nyumbani",
    monitor: "Fuatilia", 
    chat: "Ongea",
    calendar: "Kalenda",
    profile: "Wasifu",
    
    // Main Page Content
    farmManagement: "Usimamizi wa Shamba",
    quickActions: "Vitendo vya Haraka",
    cropDiagnosis: "Uchambuzi wa Mazao",
    askAIExpert: "Uliza Mtaalam wa AI",
    systemOnline: "Mfumo Unaendeshwa",
    pendingNotifications: "arifa zinazosubiri",
    dashboard: "Dashibodi",
    loading: "Inapakia...",
    
    // Alert Messages
    pestAlert: "🚨 AI imegundua shughuli za wadudu katika Shamba A. Panga ukaguzi leo!",
    
    // User Info
    locationNotSet: "Mahali haijatengwa",
    user: "Mtumiaji",
    
    // Solution Section
    faqs: "Maswali Yanayoulizwa Sana",
    faq1q: "Je, ushauri wa mazao wa AI wa Agrilo unafanyaje kazi?",
    faq1a: "AI yetu inachambua aina yako ya udongo, eneo, muundo wa hali ya hewa, na malengo ya kilimo kutoa ushauri wa mazao wa kibinafsi ambao huongeza mavuno na uendelevu.",
    faq2q: "Je, Agrilo inatumia data gani kwa uchambuzi?",
    faq2a: "Tunatumia data ya muundo wa udongo, utabiri wa hali ya hewa, utendaji wa mazao wa kihistoria, bei za soko, na mazoea ya kilimo ya ndani kutoa ushauri sahihi.",
    faq3q: "Je, Agrilo inafaa kwa aina zote za kilimo?",
    faq3a: "Ndiyo! Agrilo inafanya kazi kwa mashamba ya familia ya kiwango kidogo, shughuli za kibiashara kubwa, na kila kitu katikati. Ushauri wetu unajifunza kwa mazingira yako maalum ya kilimo.",
    feature1: "Ushauri wa Mazao Unaendeshwa na AI",
    feature2: "Muunganisho wa Hali ya Hewa ya Wakati Halisi",
    feature3: "Uchambuzi wa Udongo na Ramani",
    feature4: "Msaada wa Lugha Nyingi",
    feature5: "Zana za Kilimo cha Usahihi",
    aboutUsTitle: "Kuhusu Jukwaa la Agrilo",
    aboutUsDescription: "Agrilo ni jukwaa la teknolojia ya kilimo la mapinduzi ambalo linaunganisha akili ya bandia, sayansi ya data, na kilimo cha usahihi kusaidia wakulima kufanya maamuzi ya busara zaidi. Jukwaa letu linachambua hali ya udongo, muundo wa hali ya hewa, na mwelekeo wa soko kutoa ushauri wa mazao wa kibinafsi ambao huongeza mavuno wakati wa kuendeleza mazoea ya kilimo endelevu.",
    aboutUsMission: "Kuwawezesha wakulima ulimwenguni kote na ufahamu wa kilimo unaoendeshwa na AI kwa mustakabali endelevu.",
    mission: "Dhamira",
    
    // Auth Options Page
    createAccount: "Unda Akaunti",
    welcomeBack: "Karibu Tena",
    joinAgrilo: "Jiunge na Agrilo kuanza safari yako ya kilimo cha busara",
    signInToContinue: "Ingia kuendelea na safari yako ya kilimo",
    signIn: "Ingia",
    signUp: "Jisajili",
    fullName: "Jina Kamili",
    enterFullName: "Weka jina lako kamili",
    emailAddress: "Anwani ya Barua Pepe",
    enterEmailAddress: "Weka anwani yako ya barua pepe",
    password: "Nywila",
    enterPassword: "Weka nywila yako",
    confirmPassword: "Thibitisha Nywila",
    confirmYourPassword: "Thibitisha nywila yako",
    createAccountButton: "Unda Akaunti",
    signInButton: "Ingia",
    newUserSetup: "Mpangilio wa Mtumiaji Mpya",
    newUserSetupDesc: "Watumiaji wapya watapitia mchakato wa haraka wa kujipangilia ili kufanya uzoefu wao wa kibinafsi.",
    backToHome: "Rudi Nyumbani",
    alreadyHaveAccount: "Una akaunti tayari?",
    dontHaveAccount: "Huna akaunti?",
    emailRequired: "Barua pepe inahitajika",
    invalidEmailFormat: "Muundo wa barua pepe si sahihi",
    passwordRequired: "Nywila inahitajika",
    passwordMinLength: "Nywila lazima iwe na herufi 6 angalau",
    nameRequired: "Jina linahitajika",
    confirmPasswordRequired: "Tafadhali thibitisha nywila yako",
    passwordsDoNotMatch: "Nywila hazifanani"
  },
  es: {
    // Navigation
    products: "Productos",
    solutions: "Soluciones",
    aboutUs: "Sobre Nosotros",
    letsContact: "Contáctanos",
    
    // Hero Section
    heroTitle: "Empoderando a los Agricultores con Soluciones Inteligentes de IA",
    heroSubtitle: "Agrilo proporciona inteligencia artificial de vanguardia para optimizar rendimientos de cultivos, gestionar recursos y predecir tendencias del mercado para un futuro más sostenible y rentable.",
    getStarted: "Comenzar",
    goToDashboard: "Ir al Panel de Control",
    learnMore: "Saber Más",
    
    // Features Section
    keyFeatures: "Características Clave",
    featuresSubtitle: "Nuestras soluciones de IA están diseñadas para abordar los desafíos más apremiantes que enfrentan los agricultores modernos.",
    precisionFarming: "Agricultura de Precisión",
    precisionFarmingDesc: "Optimiza la siembra, riego y cosecha con información basada en datos.",
    diseaseDetection: "Detección de Enfermedades",
    diseaseDetectionDesc: "Identificación temprana de enfermedades de cultivos y plagas para minimizar pérdidas.",
    weatherPrediction: "Predicción del Clima",
    weatherPredictionDesc: "Pronósticos meteorológicos localizados precisos para planificar actividades agrícolas efectivamente.",
    marketAnalysis: "Análisis de Mercado",
    marketAnalysisDesc: "Predice precios del mercado y demanda para tomar decisiones de venta informadas.",
    resourceOptimization: "Optimización de Recursos",
    resourceOptimizationDesc: "Gestiona eficientemente el consumo de agua, fertilizantes y energía.",
    sustainablePractices: "Prácticas Sostenibles",
    sustainablePracticesDesc: "Promueve métodos agrícolas respetuosos con el medio ambiente para la salud ambiental a largo plazo.",
    
    // Language Selection
    selectLanguage: "Seleccionar Idioma",
    chooseYourLanguage: "Elige tu idioma preferido",
    continue: "Continuar",
    
    // About Section
    about_Us: "Sobre Nosotros",
    aboutDescription: "En Agrilo, creemos en el poder de la tecnología para transformar la agricultura. Nuestro equipo de especialistas en IA, agrónomos y científicos de datos están dedicados a construir herramientas inteligentes que empoderen a los agricultores para tomar decisiones más inteligentes, aumentar la productividad y fomentar el crecimiento sostenible. Estamos comprometidos a apoyar a la comunidad agrícola global con soluciones innovadoras y accesibles.",
    
    // Main Page Navigation
    home: "Inicio",
    monitor: "Monitorear", 
    chat: "Chat",
    calendar: "Calendario",
    profile: "Perfil",
    
    // Main Page Content
    farmManagement: "Gestión de Finca",
    quickActions: "Acciones Rápidas",
    cropDiagnosis: "Diagnóstico de Cultivos",
    askAIExpert: "Preguntar al Experto IA",
    systemOnline: "Sistema En Línea",
    pendingNotifications: "notificaciones pendientes",
    dashboard: "Panel de Control",
    loading: "Cargando...",
    
    // Alert Messages
    pestAlert: "🚨 IA detectó actividad potencial de plagas en Campo A. ¡Programa inspección hoy!",
    
    // User Info
    locationNotSet: "Ubicación no establecida",
    user: "Usuario",
    
    // Auth Options Page
    createAccount: "Crear Cuenta",
    welcomeBack: "Bienvenido de Vuelta",
    joinAgrilo: "Únete a Agrilo para comenzar tu viaje de agricultura inteligente",
    signInToContinue: "Inicia sesión para continuar tu viaje agrícola",
    signIn: "Iniciar Sesión",
    signUp: "Registrarse",
    fullName: "Nombre Completo",
    enterFullName: "Ingresa tu nombre completo",
    emailAddress: "Dirección de Correo",
    enterEmailAddress: "Ingresa tu dirección de correo",
    password: "Contraseña",
    enterPassword: "Ingresa tu contraseña",
    confirmPassword: "Confirmar Contraseña",
    confirmYourPassword: "Confirma tu contraseña",
    createAccountButton: "Crear Cuenta",
    signInButton: "Iniciar Sesión",
    newUserSetup: "Configuración de Usuario Nuevo",
    newUserSetupDesc: "Los usuarios nuevos pasarán por un proceso de configuración rápida para personalizar su experiencia.",
    backToHome: "Volver al Inicio",
    alreadyHaveAccount: "¿Ya tienes una cuenta?",
    dontHaveAccount: "¿No tienes una cuenta?",
    emailRequired: "El correo es requerido",
    invalidEmailFormat: "Formato de correo inválido",
    passwordRequired: "La contraseña es requerida",
    passwordMinLength: "La contraseña debe tener al menos 6 caracteres",
    nameRequired: "El nombre es requerido",
    confirmPasswordRequired: "Por favor confirma tu contraseña",
    passwordsDoNotMatch: "Las contraseñas no coinciden"
  },
  id: {
    // Navigation
    products: "Produk",
    solutions: "Solusi",
    aboutUs: "Tentang Kami",
    letsContact: "Hubungi Kami",
    
    // Hero Section
    heroTitle: "Memberdayakan Petani dengan Solusi AI Cerdas",
    heroSubtitle: "Agrilo menyediakan artificial intelligence terkini untuk mengoptimalkan hasil panen, mengelola sumber daya, dan memprediksi tren pasar untuk masa depan yang lebih berkelanjutan dan menguntungkan.",
    getStarted: "Mulai",
    goToDashboard: "Pergi ke Dasbor",
    learnMore: "Pelajari Lebih Lanjut",
    
    // Features Section
    keyFeatures: "Fitur Utama",
    featuresSubtitle: "Solusi AI kami dirancang untuk mengatasi tantangan paling mendesak yang dihadapi petani modern.",
    precisionFarming: "Pertanian Presisi",
    precisionFarmingDesc: "Optimalkan penanaman, irigasi, dan panen dengan wawasan berbasis data.",
    diseaseDetection: "Deteksi Penyakit",
    diseaseDetectionDesc: "Identifikasi dini penyakit tanaman dan hama untuk meminimalkan kerugian.",
    weatherPrediction: "Prediksi Cuaca",
    weatherPredictionDesc: "Prakiraan cuaca lokal yang akurat untuk merencanakan aktivitas pertanian secara efektif.",
    marketAnalysis: "Analisis Pasar",
    marketAnalysisDesc: "Prediksi harga pasar dan permintaan untuk membuat keputusan penjualan yang informatif.",
    resourceOptimization: "Optimasi Sumber Daya",
    resourceOptimizationDesc: "Kelola konsumsi air, pupuk, dan energi secara efisien.",
    sustainablePractices: "Praktik Berkelanjutan",
    sustainablePracticesDesc: "Promosikan metode pertanian ramah lingkungan untuk kesehatan lingkungan jangka panjang.",
    
    // Language Selection
    selectLanguage: "Pilih Bahasa",
    chooseYourLanguage: "Pilih bahasa yang Anda sukai",
    continue: "Lanjutkan",
    
    // About Section
    about_Us: "Tentang Kami",
    aboutDescription: "Di Agrilo, kami percaya pada kekuatan teknologi untuk mengubah pertanian. Tim kami yang terdiri dari spesialis AI, agronom, dan ilmuwan data berdedikasi untuk membangun alat cerdas yang memberdayakan petani untuk membuat keputusan yang lebih cerdas, meningkatkan produktivitas, dan mendorong pertumbuhan berkelanjutan. Kami berkomitmen untuk mendukung komunitas pertanian global dengan solusi yang inovatif dan mudah diakses.",
    
    // Main Page Navigation
    home: "Beranda",
    monitor: "Monitor", 
    chat: "Chat",
    calendar: "Kalender",
    profile: "Profil",
    
    // Main Page Content
    farmManagement: "Manajemen Pertanian",
    quickActions: "Aksi Cepat",
    cropDiagnosis: "Diagnosis Tanaman",
    askAIExpert: "Tanya Pakar AI",
    systemOnline: "Sistem Online",
    pendingNotifications: "notifikasi tertunda",
    dashboard: "Dasbor",
    loading: "Memuat...",
    
    // Alert Messages
    pestAlert: "🚨 AI mendeteksi aktivitas hama potensial di Ladang A. Jadwalkan inspeksi hari ini!",
    
    // User Info
    locationNotSet: "Lokasi belum diatur",
    user: "Pengguna",
    
    // Auth Options Page
    createAccount: "Buat Akun",
    welcomeBack: "Selamat Datang Kembali",
    joinAgrilo: "Bergabung dengan Agrilo untuk memulai perjalanan pertanian cerdas Anda",
    signInToContinue: "Masuk untuk melanjutkan perjalanan pertanian Anda",
    signIn: "Masuk",
    signUp: "Daftar",
    fullName: "Nama Lengkap",
    enterFullName: "Masukkan nama lengkap Anda",
    emailAddress: "Alamat Email",
    enterEmailAddress: "Masukkan alamat email Anda",
    password: "Kata Sandi",
    enterPassword: "Masukkan kata sandi Anda",
    confirmPassword: "Konfirmasi Kata Sandi",
    confirmYourPassword: "Konfirmasi kata sandi Anda",
    createAccountButton: "Buat Akun",
    signInButton: "Masuk",
    newUserSetup: "Pengaturan Pengguna Baru",
    newUserSetupDesc: "Pengguna baru akan melalui proses pengaturan cepat untuk menyesuaikan pengalaman mereka.",
    backToHome: "Kembali ke Beranda",
    alreadyHaveAccount: "Sudah punya akun?",
    dontHaveAccount: "Belum punya akun?",
    emailRequired: "Email diperlukan",
    invalidEmailFormat: "Format email tidak valid",
    passwordRequired: "Kata sandi diperlukan",
    passwordMinLength: "Kata sandi harus minimal 6 karakter",
    nameRequired: "Nama diperlukan",
    confirmPasswordRequired: "Silakan konfirmasi kata sandi Anda",
    passwordsDoNotMatch: "Kata sandi tidak cocok"
  }
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en')

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('agrilo_preferred_language')
    if (savedLanguage && SUPPORTED_LANGUAGES.find(lang => lang.code === savedLanguage)) {
      setSelectedLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (language: string) => {
    setSelectedLanguage(language)
    localStorage.setItem('agrilo_preferred_language', language)
  }

  const t = (key: string): string => {
    const currentTranslations = translations[selectedLanguage as keyof typeof translations] || translations.en
    return currentTranslations[key as keyof typeof currentTranslations] || key
  }

  const value: LanguageContextType = {
    selectedLanguage,
    setSelectedLanguage: handleSetLanguage,
    t
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 