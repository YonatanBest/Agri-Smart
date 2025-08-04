"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { User, Mail, MapPin, Brain, Target, Calendar, ArrowRight, ArrowLeft, Plus, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

// Multi-language content
const content = {
  en: {
    title: "Tell Us About Your Farming",
    subtitle: "Help us personalize your experience",
    userType: "Farming Experience",
    userTypeOptions: {
      aspiring: "Aspiring Farmer",
      beginner: "Beginner (1-2 years)",
      experienced: "Experienced (3-5 years)",
      explorer: "Explorer (5+ years)"
    },
    yearsExperience: "Years of Experience",
    yearsPlaceholder: "Select years of experience",
    mainGoal: "Main Goal",
    mainGoalOptions: {
      increase_yield: "Increase Crop Yield",
      reduce_costs: "Reduce Farming Costs",
      sustainable_farming: "Sustainable Farming",
      organic_farming: "Organic Farming",
      market_access: "Better Market Access"
    },
    currentlyGrowing: "Currently Growing",
    planningToGrow: "Planning to Grow",
    addCrop: "Add Crop",
    cropPlaceholder: "Enter crop name",
    noCropsSelected: "No crops selected",
    selectedCrops: "Selected crops",
    cropName: "Crop Name",
    continue: "Continue to App",
    back: "Back"
  },
  am: {
    title: "የግብርናዎ ስለ እንደሆነ ይንገሩን",
    subtitle: "የእርስዎ ልምድ እንዲስተካከል ያግዙን",
    userType: "የግብርና ልምድ",
    userTypeOptions: {
      aspiring: "የሚፈልግ ገበሬ",
      beginner: "ጀማሪ (1-2 ዓመት)",
      experienced: "የተሞካረቀ (3-5 ዓመት)",
      explorer: "የተሞካረቀ (5+ ዓመት)"
    },
    yearsExperience: "የልምድ ዓመት",
    yearsPlaceholder: "የልምድ ዓመት ይምረጡ",
    mainGoal: "ዋና ግብ",
    mainGoalOptions: {
      increase_yield: "የዕፅ ምርት ማሳደጊያ",
      reduce_costs: "የግብርና ወጪ መቀነስ",
      sustainable_farming: "ዘላቂ ግብርና",
      organic_farming: "የተፈጥሮ ግብርና",
      market_access: "የተሻለ ገበያ መድረሻ"
    },
    currentlyGrowing: "አሁን ያደጉ ዕፆች",
    planningToGrow: "ለመድረስ ያቀዱ ዕፆች",
    addCrop: "ዕፅ አክል",
    cropPlaceholder: "የዕፅ ስም ያስገቡ",
    noCropsSelected: "ምንም ዕፅ አልተመረጠም",
    selectedCrops: "የተመረጡ ዕፆች",
    cropName: "የዕፅ ስም",
    continue: "ወደ መተግበሪያ ቀጥል",
    back: "ተመለስ"
  },
  no: {
    title: "Fortell oss om jordbruket ditt",
    subtitle: "Hjelp oss å tilpasse din opplevelse",
    userType: "Jordbrukserfaring",
    userTypeOptions: {
      aspiring: "Aspirerende bonde",
      beginner: "Nybegynner (1-2 år)",
      experienced: "Erfaren (3-5 år)",
      explorer: "Utforsker (5+ år)"
    },
    yearsExperience: "Års erfaring",
    yearsPlaceholder: "Velg års erfaring",
    mainGoal: "Hovedmål",
    mainGoalOptions: {
      increase_yield: "Øke avling",
      reduce_costs: "Redusere jordbrukskostnader",
      sustainable_farming: "Bærekraftig jordbruk",
      organic_farming: "Økologisk jordbruk",
      market_access: "Bedre markedsadgang"
    },
    currentlyGrowing: "Dyrker nå",
    planningToGrow: "Planlegger å dyrke",
    addCrop: "Legg til avling",
    cropPlaceholder: "Skriv inn avlingsnavn",
    noCropsSelected: "Ingen avlinger valgt",
    selectedCrops: "Valgte avlinger",
    cropName: "Avlingsnavn",
    continue: "Fortsett til app",
    back: "Tilbake"
  },
  sw: {
    title: "Tuambie Kuhusu Kilimo Chako",
    subtitle: "Tusaidie kuiboresha uzoefu wako",
    userType: "Uzoefu wa Kilimo",
    userTypeOptions: {
      aspiring: "Mkulima wa Kujitahidi",
      beginner: "Mwanzo (miaka 1-2)",
      experienced: "Mwenye Uzoefu (miaka 3-5)",
      explorer: "Mtafiti (miaka 5+)"
    },
    yearsExperience: "Miaka ya Uzoefu",
    yearsPlaceholder: "Chagua miaka ya uzoefu",
    mainGoal: "Lengo Kuu",
    mainGoalOptions: {
      increase_yield: "Kuongeza Mavuno",
      reduce_costs: "Kupunguza Gharama za Kilimo",
      sustainable_farming: "Kilimo Endelevu",
      organic_farming: "Kilimo cha Asili",
      market_access: "Ufikiaji Bora wa Soko"
    },
    currentlyGrowing: "Unayokulima Sasa",
    planningToGrow: "Unayopanga Kukulima",
    addCrop: "Ongeza Zao",
    cropPlaceholder: "Weka jina la zao",
    noCropsSelected: "Hakuna mazao yaliyochaguliwa",
    selectedCrops: "Mazao yaliyochaguliwa",
    cropName: "Jina la Zao",
    continue: "Endelea kwenye Programu",
    back: "Rudi Nyuma"
  },
  es: {
    title: "Cuéntanos sobre tu agricultura",
    subtitle: "Ayúdanos a personalizar tu experiencia",
    userType: "Experiencia agrícola",
    userTypeOptions: {
      aspiring: "Agricultor aspirante",
      beginner: "Principiante (1-2 años)",
      experienced: "Experimentado (3-5 años)",
      explorer: "Explorador (5+ años)"
    },
    yearsExperience: "Años de experiencia",
    yearsPlaceholder: "Selecciona años de experiencia",
    mainGoal: "Objetivo principal",
    mainGoalOptions: {
      increase_yield: "Aumentar rendimiento",
      reduce_costs: "Reducir costos agrícolas",
      sustainable_farming: "Agricultura sostenible",
      organic_farming: "Agricultura orgánica",
      market_access: "Mejor acceso al mercado"
    },
    currentlyGrowing: "Cultivando Actualmente",
    planningToGrow: "Planeando Cultivar",
    addCrop: "Agregar Cultivo",
    cropPlaceholder: "Ingresa nombre del cultivo",
    noCropsSelected: "No hay cultivos seleccionados",
    selectedCrops: "Cultivos seleccionados",
    cropName: "Nombre del Cultivo",
    continue: "Continuar a la app",
    back: "Atrás"
  },
  id: {
    title: "Ceritakan Tentang Pertanian Anda",
    subtitle: "Bantu kami menyesuaikan pengalaman Anda",
    userType: "Pengalaman Bertani",
    userTypeOptions: {
      aspiring: "Petani Beraspirasi",
      beginner: "Pemula (1-2 tahun)",
      experienced: "Berpengalaman (3-5 tahun)",
      explorer: "Penjelajah (5+ tahun)"
    },
    yearsExperience: "Tahun Pengalaman",
    yearsPlaceholder: "Pilih tahun pengalaman",
    mainGoal: "Tujuan Utama",
    mainGoalOptions: {
      increase_yield: "Meningkatkan hasil panen",
      reduce_costs: "Mengurangi biaya pertanian",
      sustainable_farming: "Pertanian berkelanjutan",
      organic_farming: "Pertanian organik",
      market_access: "Akses pasar yang lebih baik"
    },
    currentlyGrowing: "Sedang Menanam",
    planningToGrow: "Berencana Menanam",
    addCrop: "Tambah Tanaman",
    cropPlaceholder: "Masukkan nama tanaman",
    noCropsSelected: "Tidak ada tanaman yang dipilih",
    selectedCrops: "Tanaman yang dipilih",
    cropName: "Nama Tanaman",
    continue: "Lanjutkan ke Aplikasi",
    back: "Kembali"
  }
}

interface Crop {
  name: string
  icon: string
}

export default function UserRegistrationPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [formData, setFormData] = useState({
    user_type: "",
    years_experience: "",
    main_goal: ""
  })
  const [currentlyGrowingCrops, setCurrentlyGrowingCrops] = useState<Crop[]>([])
  const [planningToGrowCrops, setPlanningToGrowCrops] = useState<Crop[]>([])
  const [newCropName, setNewCropName] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [activeSection, setActiveSection] = useState<"current" | "planned">("current")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()
  const { completeRegistration, isAuthenticated, isLoading } = useAuth()

  // Redirect authenticated users to main page (only for existing users, not new registrations)
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Check if this is a new registration by looking for onboarding data
      const authData = sessionStorage.getItem('auth_data')
      
      // If we have onboarding data, continue with onboarding flow
      if (authData) {
        // New user with onboarding data - let them continue the flow
        return
      }
      
      // Existing user - redirect to main page
      router.push("/main-page")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    // Get selected language from session storage
    const savedLanguage = sessionStorage.getItem('agrilo_preferred_language')
    if (savedLanguage && ['en', 'am', 'no', 'sw', 'es', 'id'].includes(savedLanguage)) {
      setSelectedLanguage(savedLanguage)
    }
  }, [])

  // Debug: Monitor crops state changes
  useEffect(() => {
    console.log('🔄 Currently Growing Crops State Changed:', currentlyGrowingCrops)
  }, [currentlyGrowingCrops])

  useEffect(() => {
    console.log('🔄 Planning to Grow Crops State Changed:', planningToGrowCrops)
  }, [planningToGrowCrops])

  const t = content[selectedLanguage as keyof typeof content] || content.en

  const handleAddCrop = () => {
    if (newCropName.trim()) {
      const newCrop: Crop = {
        name: newCropName.trim(),
        icon: "🌱"
      }
      
      console.log('🌱 Adding crop:', newCrop, 'to section:', activeSection)
      
      if (activeSection === "current") {
        const updatedCrops = [...currentlyGrowingCrops, newCrop]
        console.log('🌾 Updated currently growing crops:', updatedCrops)
        setCurrentlyGrowingCrops(updatedCrops)
      } else {
        const updatedCrops = [...planningToGrowCrops, newCrop]
        console.log('🌾 Updated planning to grow crops:', updatedCrops)
        setPlanningToGrowCrops(updatedCrops)
      }
      
      setNewCropName("")
      setShowAddForm(false)
    }
  }

  const handleRemoveCrop = (cropName: string, section: "current" | "planned") => {
    if (section === "current") {
      setCurrentlyGrowingCrops(currentlyGrowingCrops.filter(crop => crop.name !== cropName))
    } else {
      setPlanningToGrowCrops(planningToGrowCrops.filter(crop => crop.name !== cropName))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.user_type) {
      newErrors.user_type = "Please select your farming experience"
    }
    
    if (!formData.years_experience) {
      newErrors.years_experience = "Please select years of experience"
    }
    
    if (!formData.main_goal) {
      newErrors.main_goal = "Please select your main goal"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        // Get all stored data from session storage
        const authData = JSON.parse(sessionStorage.getItem('auth_data') || '{}')
        const locationData = JSON.parse(sessionStorage.getItem('farmer_location') || '{}')
        
        // Debug: Log crops data
        console.log('🌾 Currently Growing Crops:', currentlyGrowingCrops)
        console.log('🌾 Planning to Grow Crops:', planningToGrowCrops)
        
        // Prepare user data for backend
        const userData = {
          email: authData.email,
          password: authData.password,
          name: authData.name,
          location: locationData.latitude && locationData.longitude 
            ? `${locationData.latitude}, ${locationData.longitude}`
            : "Unknown",
          preferred_language: selectedLanguage,
          user_type: formData.user_type,
          years_experience: parseInt(formData.years_experience) || 1,
          main_goal: formData.main_goal,
          crops_grown: [
            ...currentlyGrowingCrops.map(crop => `${crop.name}:current`),
            ...planningToGrowCrops.map(crop => `${crop.name}:planned`)
          ]
        }
        
        console.log('📤 Sending userData to backend:', userData)
        
        // Send data to backend using AuthContext
        await completeRegistration(userData)
        
        // Store user data in session storage
        sessionStorage.setItem('user_registration_data', JSON.stringify({
          ...formData,
          preferred_language: selectedLanguage,
          crops_grown: [
            ...currentlyGrowingCrops.map(crop => `${crop.name}:current`),
            ...planningToGrowCrops.map(crop => `${crop.name}:planned`)
          ]
        }))
        
        // Clear onboarding data since user has completed the full flow
        sessionStorage.removeItem('auth_data')
        sessionStorage.removeItem('farmer_location')
        
        // Navigate to main app
        router.push("/main-page")
      } catch (error: any) {
        console.error('Registration error:', error)
        
        // Handle specific error cases
        if (error.message && error.message.includes('Email already registered')) {
          alert('This email is already registered. Please sign in instead or use a different email address.')
          router.push("/auth-options")
        } else {
          alert('Registration failed. Please try again.')
        }
      }
    }
  }

  const handleBack = () => {
    router.push("/language-selection")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">{t.title}</h1>
          <p className="text-green-600 text-lg">{t.subtitle}</p>
        </div>

        {/* Registration Form */}
        <Card className="rounded-2xl border-2 border-green-100 shadow-lg">
          <CardContent className="p-6 space-y-6">
            {/* User Type */}
            <div className="space-y-2">
              <Label htmlFor="user_type" className="text-green-700 font-medium">
                {t.userType}
              </Label>
              <Select
                value={formData.user_type}
                onValueChange={(value) => setFormData({...formData, user_type: value})}
              >
                <SelectTrigger className="rounded-xl border-green-200 focus:border-green-500">
                  <SelectValue placeholder={t.userType} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(t.userTypeOptions).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.user_type && (
                <p className="text-red-600 text-sm">{errors.user_type}</p>
              )}
            </div>

            {/* Years Experience */}
            <div className="space-y-2">
              <Label htmlFor="years_experience" className="text-green-700 font-medium">
                {t.yearsExperience}
              </Label>
              <Select
                value={formData.years_experience}
                onValueChange={(value) => setFormData({...formData, years_experience: value})}
              >
                <SelectTrigger className="rounded-xl border-green-200 focus:border-green-500">
                  <SelectValue placeholder={t.yearsPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30].map((years) => (
                    <SelectItem key={years} value={years.toString()}>
                      {years} {years === 1 ? 'year' : 'years'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.years_experience && (
                <p className="text-red-600 text-sm">{errors.years_experience}</p>
              )}
            </div>

            {/* Main Goal */}
            <div className="space-y-2">
              <Label htmlFor="main_goal" className="text-green-700 font-medium">
                {t.mainGoal}
              </Label>
              <Select
                value={formData.main_goal}
                onValueChange={(value) => setFormData({...formData, main_goal: value})}
              >
                <SelectTrigger className="rounded-xl border-green-200 focus:border-green-500">
                  <SelectValue placeholder={t.mainGoal} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(t.mainGoalOptions).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.main_goal && (
                <p className="text-red-600 text-sm">{errors.main_goal}</p>
              )}
            </div>

            {/* Crop Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-800">Your Crops</h3>
              
              {/* Currently Growing Crops */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-green-700 font-medium">{t.currentlyGrowing}</Label>
                  <Button
                    onClick={() => {
                      setActiveSection("current")
                      setShowAddForm(true)
                    }}
                    size="sm"
                    variant="outline"
                    className="border-green-200 text-green-600 hover:bg-green-50"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {t.addCrop}
                  </Button>
                </div>

                {/* Add Crop Form */}
                {showAddForm && activeSection === "current" && (
                  <div className="space-y-3 p-4 bg-green-50 rounded-xl border border-green-200">
                    <Label className="text-sm font-medium text-green-700">{t.cropName}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={newCropName}
                        onChange={(e) => setNewCropName(e.target.value)}
                        placeholder={t.cropPlaceholder}
                        className="flex-1"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCrop()}
                      />
                      <Button
                        onClick={handleAddCrop}
                        size="sm"
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Selected Currently Growing Crops */}
                {currentlyGrowingCrops.length > 0 && (
                  <div className="space-y-2">
                    {currentlyGrowingCrops.map((crop, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{crop.icon}</span>
                          <span className="font-medium">{crop.name}</span>
                        </div>
                        <Button
                          onClick={() => handleRemoveCrop(crop.name, "current")}
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {currentlyGrowingCrops.length === 0 && (
                  <div className="text-center py-4 text-green-600">
                    <p className="text-sm">{t.noCropsSelected}</p>
                  </div>
                )}
              </div>

              {/* Planning to Grow Crops */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-blue-700 font-medium">{t.planningToGrow}</Label>
                  <Button
                    onClick={() => {
                      setActiveSection("planned")
                      setShowAddForm(true)
                    }}
                    size="sm"
                    variant="outline"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {t.addCrop}
                  </Button>
                </div>

                {/* Add Crop Form */}
                {showAddForm && activeSection === "planned" && (
                  <div className="space-y-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <Label className="text-sm font-medium text-blue-700">{t.cropName}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={newCropName}
                        onChange={(e) => setNewCropName(e.target.value)}
                        placeholder={t.cropPlaceholder}
                        className="flex-1"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCrop()}
                      />
                      <Button
                        onClick={handleAddCrop}
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Selected Planning to Grow Crops */}
                {planningToGrowCrops.length > 0 && (
                  <div className="space-y-2">
                    {planningToGrowCrops.map((crop, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{crop.icon}</span>
                          <span className="font-medium">{crop.name}</span>
                        </div>
                        <Button
                          onClick={() => handleRemoveCrop(crop.name, "planned")}
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {planningToGrowCrops.length === 0 && (
                  <div className="text-center py-4 text-blue-600">
                    <p className="text-sm">{t.noCropsSelected}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="mt-8 flex gap-4">
          <Button
            onClick={handleBack}
            variant="outline"
            className="flex-1 border-green-200 text-green-600 hover:bg-green-50 py-3 rounded-xl"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.back}
          </Button>
          
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl"
          >
            {t.continue}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-green-600">
          <p>Your information helps us provide personalized farming advice</p>
        </div>
      </div>
    </div>
  )
} 