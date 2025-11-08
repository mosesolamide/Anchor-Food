import { supabase } from "./supabase-confg.js"
import { showNotification } from "./index.js"



// ✅ Session check - redirect to login if not authenticated
document.addEventListener("DOMContentLoaded", async () => {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    window.location.href = "./rider-login.html"
    return
  }

  getUserDetails()
})

// ✅ Logout button
const logoutBtn = document.getElementById("logoutBtn") as HTMLButtonElement | null
logoutBtn?.addEventListener("click", async () => {
    logoutBtn.disabled = true
    await supabase.auth.signOut()
    window.location.href = "./rider-login.html"
})

const getUserDetails = async () => {
    try{
        const { data, error } = await supabase
        .from('riderDetails')
        .select("*")
        .single()
        if(error){
            throw error
        }
        return data
    }catch(err:any){
        showNotification(`${err?.message}`, false)
        console.error("Error:", err)
    }
}
const { fullname } = await getUserDetails()
const userName = document.querySelectorAll(".userName")

// dipslay userName in dashboard
if (userName){
    userName.forEach(element => {
        element.textContent = `Welcome back,${fullname}`
    })
}