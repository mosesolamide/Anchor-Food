const harmburgerMenu = document.getElementById("harmburger")
const navList = document.getElementById("mobile-nav-list")
const foodCategories = document.getElementById("food-categories")
const productContainer = document.getElementById("product")
const cartModal = document.getElementById("cartModal")
const cartItems = document.getElementById("cartItem")

const foodCategoriesArr = ["All", "Proteins", "Swallows & Soup", "Drinks"]

type Food = {
  img: string
  price: number
  category?: string
  name: string
  id?: number
  des?: string
  quantity: number
}

type Pack = {
  id: number
  packNo: number
  items: Food[]
}

const foodTempData = [
  {
    img: "./assets/Delivery.jpg",
    price: 3500,
    category: "Food",
    name: "Jollof Rice",
    id: 1,
    des: "200₦ pack cost inclusive"
  },
  {
    img: "./assets/Delivery.jpg",
    price: 3500,
    category: "Swallows & Soup",
    name: "Eba",
    id: 2,
    des: "200₦ pack cost inclusive"
  },
  {
    img: "./assets/Delivery.jpg",
    price: 3500,
    category: "Proteins",
    name: "Fish",
    id: 3,
    des: "200₦ pack cost inclusive"
  },
  {
    img: "./assets/Delivery.jpg",
    price: 3500,
    category: "Drinks",
    name: "Pepsi",
    id: 4,
    des: "200₦ pack cost inclusive"
  }
]

let filteredFood = [...foodTempData]
let currentPackId = 1 // Track which pack is currently selected

// ================= Get or Initialize Packs =================
const getPacks = (): Pack[] => {
  const packs = localStorage.getItem("packs")
  if (!packs || JSON.parse(packs).length === 0) {
    const initialPack: Pack = { id: 1, packNo: 1, items: [] }
    localStorage.setItem("packs", JSON.stringify([initialPack]))
    return [initialPack]
  }
  return JSON.parse(packs)
}

// ================= Save Packs =================
const savePacks = (packs: Pack[]) => {
  localStorage.setItem("packs", JSON.stringify(packs))
}

// ================= Create New Pack =================
const createNewPack = () => {
  const packs = getPacks()
  const newPackNo = packs.length + 1
  const newPack: Pack = {
    id: newPackNo,
    packNo: newPackNo,
    items: []
  }
  
  packs.push(newPack)
  savePacks(packs)
  currentPackId = newPack.id
  
  displayCart()
  alert(`Pack ${newPackNo} created! Now adding items to Pack ${newPackNo}`)
}

// ================= Select Pack =================
const selectPack = (packId: number) => {
  currentPackId = packId
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
    currentPackId = filteredPacks[0].id
  }
  
  displayCart()
}

// ================= Hamburger Menu =================
harmburgerMenu?.addEventListener("click", () => {
  navList?.classList.toggle("hidden")
})

// ================= Display Food =================
const displayFood = (isLoading = false) => {
  if (!productContainer) return

  if (isLoading) {
    productContainer.innerHTML = `
      <div class="flex justify-center items-center py-20">
        <div class="w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    `
    return
  }

  if (filteredFood.length <= 0) {
    productContainer.innerHTML = `
      <div class="text-center text-gray-600 font-semibold py-20">
        No food items found 😢
      </div>
    `
    return
  }

  const foodHTML = filteredFood
    .map(
      ({ img, price, name, des }) => `
        <div class="food-card flex flex-col md:flex-row space-x-4 md:space-x-6 md:items-start border-b border-green-600 py-10 max-w-[700px] md:h-[220px]">
          <div class="w-[150px] h-[130px] mx-auto md:m-4">
            <img src="${img}" alt="${name}" class="w-full h-full object-cover rounded">
          </div>

          <div class="space-y-2.5 order-3 md:order-0 md:space-y-6 mt-4">
            <h2 class="text-sm md:text-[18px] font-bold">${name}</h2>
            <p class="text-sm">${des}</p>
            <button 
              class="bg-btn text-navbar font-semibold px-4 py-2 rounded-lg hover:bg-btn-hover add-to-cart
              transition shadow-lg hover:shadow-xl hover:scale-105 transform duration-300 text-lg cursor-pointer add-cart-btn"
            >
              Add to Pack ${getPacks().find(p => p.id === currentPackId)?.packNo || 1}
            </button>
          </div>

          <div class="flex md:flex-col justify-between h-full mt-4 md:mt-0">
            <label class="flex gap-2 font-medium">
              Quantity:
              <input 
                type="number" 
                class="border w-20 rounded indent-2" 
                value="1"
                min="1"
              >
            </label>
            <span class="font-bold block">₦${price}</span>
          </div>
        </div>
      `
    )
    .join("")

  productContainer.innerHTML = foodHTML
}

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

  setTimeout(() => {
    if (selectedCategory === "All") {
      filteredFood = foodTempData
    } else {
      filteredFood = foodTempData.filter(
        (item) => item.category?.toUpperCase() === selectedCategory.toUpperCase()
      )
    }

    displayFood()
  }, 700)
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

// ================= Calculate Pack Total =================
const calculatePackTotal = (pack: Pack): number => {
  return pack.items.reduce((total, item) => total + (item.price * item.quantity), 0)
}

// ================= Display Cart =================
const displayCart = () => {
  if (!cartItems) return
  
  const packs = getPacks()

  if (packs.length === 0 || packs.every(pack => pack.items.length === 0)) {
    cartItems.innerHTML = `
      <div class="p-6 flex flex-col justify-center items-center text-gray-500">
        <p class="font-bold">Your cart is empty</p>
        <a
          href="order-now.html"
          class="bg-btn text-navbar font-semibold px-4 py-2 rounded-lg hover:bg-btn-hover transition shadow-lg hover:shadow-xl hover:scale-105 transform duration-300 text-lg cursor-pointer mt-4"
        >
          Continue to shop
        </a>
      </div>
    `
    return
  }

  const packsHTML = packs.map(pack => {
    const isActive = pack.id === currentPackId
    const packTotal = calculatePackTotal(pack)
    
    const itemsHTML = pack.items.length === 0 
      ? '<p class="text-gray-400 text-sm py-4">No items in this pack yet</p>'
      : pack.items.map(({ img, price, name, quantity, id }) => `
          <div class="flex justify-between items-center border-b border-gray-200 py-4">
            <div class="flex items-center gap-4">
              <img src="${img}" alt="${name}" class="w-12 h-12 rounded-md object-cover shadow-sm" />
              <div>
                <h3 class="font-semibold text-gray-800">${name}</h3>
                <p class="text-green-600 font-medium">₦${price.toLocaleString()}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="cart-item flex items-center border border-gray-300 rounded-md overflow-hidden">
                <button 
                  data-pack-id="${pack.id}"
                  data-item-id="${id}" 
                  data-action="decrement"
                  class="quantity-btn px-2 py-1 text-gray-700 hover:bg-gray-100 font-bold">
                  −
                </button>

                <span class="w-10 text-center border-none outline-none appearance-none">${quantity}</span>

                <button 
                  data-pack-id="${pack.id}"
                  data-item-id="${id}" 
                  data-action="increment"
                  class="quantity-btn px-2 py-1 text-gray-700 hover:bg-gray-100 font-bold">
                  +
                </button>
              </div>

              <button 
                class="delete-btn text-red-600 hover:text-red-700 cursor-pointer"
                data-pack-id="${pack.id}"
                data-item-id="${id}"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                </svg>
              </button>
            </div>
          </div>
        `).join('')

    return `
      <div class="pack-container mb-6 border-2 rounded-lg ${isActive ? 'border-green-600 bg-green-50' : 'border-gray-200'}">
        <div class="flex justify-between items-center p-4 bg-navbar text-white rounded-t-lg">
          <div class="flex items-center gap-3">
            <h2 class="font-bold text-lg">Pack ${pack.packNo}</h2>
            ${isActive ? '<span class="text-xs bg-green-500 px-2 py-1 rounded">Active</span>' : ''}
          </div>
          
          <div class="flex items-center gap-2">
            ${!isActive ? `
              <button 
                class="select-pack-btn text-sm bg-btn text-navbar px-3 py-1 rounded hover:bg-btn-hover transition"
                data-pack-id="${pack.id}"
              >
                Select
              </button>
            ` : ''}
            
            ${packs.length > 1 ? `
              <button 
                class="delete-pack-btn text-sm bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
                data-pack-id="${pack.id}"
              >
                Delete Pack
              </button>
            ` : ''}
          </div>
        </div>

        <div class="p-4">
          ${itemsHTML}
          
          ${pack.items.length > 0 ? `
            <div class="flex justify-between items-center pt-4 mt-4 border-t-2 border-gray-300">
              <span class="font-bold text-lg">Pack Total:</span>
              <span class="font-bold text-xl text-green-600">₦${packTotal.toLocaleString()}</span>
            </div>
          ` : ''}
        </div>
      </div>
    `
  }).join('')

  const grandTotal = packs.reduce((total, pack) => total + calculatePackTotal(pack), 0)

  cartItems.innerHTML = `
    <div class="overflow-y-auto h-[90%]">
      ${packsHTML}
    <div class="sticky bottom-0 bg-white border-t-2 border-gray-300 p-4">
      
      <button 
        id="create-new-pack-btn"
        class="cursor-pointer w-full bg-accent text-white font-semibold py-2 rounded-lg hover:opacity-90 transition mb-3"
      >
        + Create New Pack
      </button>

      <div class="flex justify-between items-center text-xl font-bold">
        <span>Grand Total:</span>
        <span class="text-green-600">₦${grandTotal.toLocaleString()}</span>
      </div>
      
      <button 
        class="cursor-pointer w-full bg-navbar text-white font-semibold py-2 rounded-lg hover:opacity-90 transition mt-4"
        id="checkout"
      >
        Proceed to Checkout
      </button>
    </div>
  </div>
  `

  // Add event listener for create new pack button
  document.getElementById("create-new-pack-btn")?.addEventListener("click", createNewPack)
  const locationModal = document.getElementById("location")
  // =========checkout================
  document.getElementById("checkout")?.addEventListener("click", () => {
    if(locationModal){
      locationModal.innerHTML =`
        <div class="flex flex-col items-center p-6 gap-4 md:gap-8 font-[600] text-md bg-white rounded w-[330px] sm:w-[350px] md:w-[550px] shadow-lg animate-fadeIn">
          
          <div class="flex w-full">
            <span>Select Location</span>
            <button id="close-location-modal" class="ml-auto cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-x w-6 h-6 md:w-8 md:h-8"
                viewBox="0 0 16 16"
              >
                <path
                  d="M4.646 4.646a.5.5 0 0 1 
                  .708 0L8 7.293l2.646-2.647a.5.5 
                  0 0 1 .708.708L8.707 8l2.647 
                  2.646a.5.5 0 0 1-.708.708L8 
                  8.707l-2.646 2.647a.5.5 0 0 
                  1-.708-.708L7.293 8 4.646 
                  5.354a.5.5 0 0 1 0-.708"
                />
              </svg>
            </button>
          </div>

          <!-- Hall Selection -->
          <select class="border border-navbar focus:border-btn focus:ring-2 focus:ring-btn/30 p-2 rounded-md w-full outline-none">
            <option value="">Select a Hall</option>
            <option value="peace">Peace Hall</option>
            <option value="patient">Patient Hall</option>
            <option value="purity">Purity Hall</option>
          </select>

          <input 
            type="text"
            class="border border-navbar focus:border-btn focus:ring-2 focus:ring-btn/30 p-2 rounded-md indent-2 w-full outline-none"
            placeholder="Enter Room No."
            required
          >

          <!-- Divider -->
          <div class="flex items-center text-gray-500 font-medium">
            <span class="mx-2 text-sm">Or</span>
          </div>

          <!-- Custom Location -->
          <input 
            type="text" 
            class="border border-navbar focus:border-btn focus:ring-2 focus:ring-btn/30 p-2 rounded-md indent-2 w-full outline-none"
            placeholder="Enter custom location"
            required
          >

          <!-- Message -->
          <div class="flex flex-col items-start w-full">
            <label class="text-gray-400 text-sm mb-1">Additional Message (Optional)</label>
            <textarea 
              class="border border-navbar focus:border-btn focus:ring-2 focus:ring-btn/30 p-2 rounded-md w-full outline-none"
              placeholder="Message"
            ></textarea>
          </div>

          <button
            class="cursor-pointer w-full bg-navbar text-white font-semibold py-2 rounded-lg hover:opacity-90 transition mt-4"
          >
            Proceed to Payment
          </button>
        </div>
      `
      locationModal?.classList.remove("hidden")
      document.getElementById("close-location-modal")?.addEventListener("click", () =>{
        locationModal?.classList.add("hidden")
      })
    }
  })
}

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