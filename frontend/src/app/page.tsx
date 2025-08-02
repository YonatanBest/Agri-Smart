import HomePage from "@/components/Home_page"
import About_Section from "@/components/Page_Components/About_Section"
import HeroSectionTwo from "@/components/Page_Components/Hero_Section_Two"
import Other_Sections from "@/components/Page_Components/Other_Sections"
import ScrollAnimation from "@/components/Page_Components/Solution_Section"
import SolutionSection from "@/components/Page_Components/Solution_Section"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

function page() {
  return (
    <div>
      {/* <HomePage/> */}
      <HeroSectionTwo />
      <ScrollAnimation />
      <About_Section />
      <Other_Sections />

      {/* Quick Access to Land Mapping */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button asChild className="bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg">
          <Link href="/land-mapping">
            <MapPin className="h-5 w-5 mr-2" />
            Map Farm
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default page