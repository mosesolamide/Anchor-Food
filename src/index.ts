const harmburgerMenu = document.getElementById("harmburger")
const navList = document.getElementById("mobile-nav-list")

harmburgerMenu?.addEventListener("click", () => {
    navList?.classList.toggle("hidden")
})