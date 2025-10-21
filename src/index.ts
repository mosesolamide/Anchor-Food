import { foodTempData } from "./foodData.js"
import { getPacks, savePacks } from "./storage.js"
import { displayFood, productContainer, currentPackId, setCurrentPackId, setFilteredFood, displayCart, cartItems } from "./ui.js"

// DOM Element
const harmburgerMenu = document.getElementById("harmburger")
const navList = document.getElementById("mobile-nav-list")
const foodCategories = document.getElementById("food-categories")
const cartModal = document.getElementById("cartModal")

// CATEGORIES
const foodCategoriesArr = ["All", "Proteins", "Swallows & Soup", "Drinks"] 

// ================= Select Pack =================
const selectPack = (packId: number) => {
  setCurrentPackId(packId)
  displayCart()
}

// ================= Delete Pack =================
const deletePack = (packId: number) => {
  const packs = getPacks()
  
  if (packs.length === 1) {
    alert("You must have at least one pack!")
    return
  }
  
  const filteredPacks = packs.filter(pack => pack.id !== packId)
  
  // Reassign pack numbers
  filteredPacks.forEach((pack, index) => {
    pack.packNo = index + 1
  })
  
  savePacks(filteredPacks)
  
  // If deleted pack was selected, switch to first pack
  if (currentPackId === packId) {
    setCurrentPackId(filteredPacks[0].id)
  }
  
  displayCart()
}

// ================= Hamburger Menu =================
harmburgerMenu?.addEventListener("click", () => {
  navList?.classList.toggle("hidden")
})


// ================= Category Selection =================
const selectCategory = (selectedCategory: string) => {
  const allCategories = foodCategories?.querySelectorAll("li")
  allCategories?.forEach((item) => {
    item.classList.remove("border-b-[4px]", "border-navbar")
  })

  const activeCategory = foodCategories?.querySelector(
    `li[data-category="${selectedCategory}"]`
  )
  activeCategory?.classList.add("border-b-[4px]", "border-navbar")

  displayFood(true)

    if (selectedCategory === "All") {
      setFilteredFood(foodTempData)
    } else {
      setFilteredFood(foodTempData.filter(
        (item) => item.category?.toUpperCase() === selectedCategory.toUpperCase()
      ))
    }

    displayFood()
}

// ================= Create Category Tabs =================
if (foodCategories) {
  foodCategoriesArr.forEach((category, index) => {
    const li = document.createElement("li")
    li.className =
      "relative px-2 md:px-4 rounded cursor-pointer transition-all duration-300 " +
      "before:absolute before:left-0 before:bottom-0 before:h-[2px] before:w-0 before:bg-navbar " +
      "hover:before:w-full before:transition-all before:duration-300"
    li.textContent = category.toUpperCase()
    li.dataset.category = category
    li.onclick = () => selectCategory(category)

    if (index === 0) li.classList.add("border-b-[4px]", "border-navbar")

    foodCategories.appendChild(li)
  })
}

// ================= Add to Cart =================
productContainer?.addEventListener("click", (e) => {

  const button = (e.target as HTMLElement).closest(".add-to-cart")
  if (!button) return

  const card = button.closest(".food-card")
  const itemName = card?.querySelector("h2")?.textContent?.trim()
  const quantityInput = card?.querySelector("input[type='number']") as HTMLInputElement | null
  const quantity = quantityInput ? parseInt(quantityInput.value) : 1

  if (quantity < 1) {
    alert("Quantity must be at least 1")
    return
  }

  const currentItem = foodTempData.find((item) => item.name === itemName)
  if (!currentItem) return

  const packs = getPacks()
  const currentPack = packs.find(pack => pack.id === currentPackId)
  
  if (!currentPack) return

  // Check if item already exists in current pack
  const existingItem = currentPack.items.find((item) => item.id === currentItem.id)

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    currentPack.items.push({ ...currentItem, quantity })
  }

  savePacks(packs)
  displayCart()

  alert(`${currentItem.name} (x${quantity}) added to Pack ${currentPack.packNo}!`)
  
  // Reset quantity input
  if (quantityInput) quantityInput.value = "1"
})


// ================= Cart Quantity Update =================
cartItems?.addEventListener("click", (e) => {
  const updateQuantity = (e.target as HTMLElement).closest(".quantity-btn") as HTMLElement | null
  if (!updateQuantity) return

  const action = updateQuantity.dataset.action
  const packId = Number(updateQuantity.dataset.packId)
  const itemId = Number(updateQuantity.dataset.itemId)
  
  if (!action || !packId || !itemId) return

  const packs = getPacks()
  const pack = packs.find(p => p.id === packId)
  if (!pack) return

  const foundItem = pack.items.find((item) => item.id === itemId)
  if (!foundItem) return

  if (action === "increment") {
    foundItem.quantity += 1
  } else if (action === "decrement" && foundItem.quantity > 1) {
    foundItem.quantity -= 1
  }

  savePacks(packs)
  displayCart()
})

// ================= Delete Cart Item =================
cartItems?.addEventListener("click", (e) => {
  const deleteBtn = (e.target as HTMLElement).closest(".delete-btn") as HTMLElement | null
  if (!deleteBtn) return

  const packId = Number(deleteBtn.dataset.packId)
  const itemId = Number(deleteBtn.dataset.itemId)
  
  if (!packId || !itemId) return

  const packs = getPacks()
  const pack = packs.find(p => p.id === packId)
  if (!pack) return

  pack.items = pack.items.filter((item) => item.id !== itemId)

  savePacks(packs)
  displayCart()
  alert("Item removed successfully")
})

// ================= Select Pack =================
cartItems?.addEventListener("click", (e) => {
  const selectBtn = (e.target as HTMLElement).closest(".select-pack-btn") as HTMLElement | null
  if (!selectBtn) return

  const packId = Number(selectBtn.dataset.packId)
  if (!packId) return

  selectPack(packId)
  displayFood() // Refresh to update button text
})

// ================= Delete Pack =================
cartItems?.addEventListener("click", (e) => {
  const deletePackBtn = (e.target as HTMLElement).closest(".delete-pack-btn") as HTMLElement | null
  if (!deletePackBtn) return

  const packId = Number(deletePackBtn.dataset.packId)
  if (!packId) return

  if (confirm("Are you sure you want to delete this pack?")) {
    deletePack(packId)
  }
})

// ================= Cart Modal Controls =================
document.getElementById("open-cart")?.addEventListener("click", () => {
  cartModal?.classList.toggle("hidden")
  navList?.classList.add("hidden")
  displayCart()
})

document.getElementById("close-cart")?.addEventListener("click", () => {
  cartModal?.classList.toggle("hidden")
})

// ================= Initial Load =================
window.onload = () => {
  getPacks() // Initialize packs if none exist
  selectCategory("All")
  displayCart()
}

// ================= Year Auto Update =================
const yearEl = document.getElementById("year") as HTMLElement
if (yearEl) yearEl.textContent = new Date().getFullYear().toString()