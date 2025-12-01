import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { TravelApp } from "@/components/travel-app"

export default async function AppPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return <TravelApp user={data.user} />
}
