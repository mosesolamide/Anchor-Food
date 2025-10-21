import type { Pack } from "./type"
import { foodTempData } from "./foodData.js"
import { pay } from "./paystack.js"

const harmburgerMenu = document.getElementById("harmburger")
const navList = document.getElementById("mobile-nav-list")
const foodCategories = document.getElementById("food-categories")
const productContainer = document.getElementById("product")
const cartModal = document.getElementById("cartModal")
const cartItems = document.getElementById("cartItem")
const locationModal = document.getElementById("location")

const foodCategoriesArr = ["All", "Proteins", "Swallows & Soup", "Drinks"]
let filteredFood = [...foodTempData]
let currentPackId = 1 // Track which pack is currently selected
const deliveryFee = 200

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
  displayFood()
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

    if (selectedCategory === "All") {
      filteredFood = foodTempData
    } else {
      filteredFood = foodTempData.filter(
        (item) => item.category?.toUpperCase() === selectedCategory.toUpperCase()
      )
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

// ================= Calculate Pack Total =================
const calculatePackTotal = (pack: Pack): number => {
  return pack.items.reduce((total, item) => total + (item.price * item.quantity), 0)
}
const grandTotal = () => {
  const packs = getPacks()
  return packs.reduce((total, pack) => total + calculatePackTotal(pack), 0)
}
const grandTotals = grandTotal()

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
        <span class="text-green-600">₦${grandTotals.toLocaleString()}</span>
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
  
  // ========= Show checkout location form ================
  showCheckoutLocationForm()

}

// ======== Show checkout location form function =========
const showCheckoutLocationForm = () => {
  document.getElementById("checkout")?.addEventListener("click", () => {
  if(locationModal){
      locationModal.innerHTML =`
      <!-- Location Modal -->
      <div class="flex flex-col bg-white rounded-2xl w-full max-w-md shadow-2xl animate-fadeIn max-h-[90vh] overflow-hidden">
        
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h2 class="text-xl font-bold text-gray-800">Delivery Location</h2>
          </div>
          
          <button id="close-location-modal" class="text-gray-400 hover:text-gray-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body - Scrollable -->
        <div class="p-6 space-y-5 overflow-y-auto flex-1">
          
          <!-- Option 1: Hall Delivery -->
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm">
                1
              </div>
              <h3 class="font-semibold text-gray-700 text-base">Deliver to Hall</h3>
            </div>

            <div class="ml-10 space-y-3">
              <!-- Hall Selection -->
              <div>
                <label for="hall" class="block text-sm font-medium text-gray-600 mb-1">
                  Select Your Hall
                </label>
                <select 
                  id="hall" 
                  class="w-full border-2 border-gray-300 focus:border-green-600 focus:ring-2 focus:ring-green-100 p-2.5 rounded-lg outline-none transition text-sm"
                >
                  <option value="">-- Choose Hall --</option>
                  <option value="peace">Peace Hall</option>
                  <option value="patient">Patient Hall</option>
                  <option value="purity">Purity Hall</option>
                </select>
              </div>

              <!-- Room Number -->
              <div>
                <label for="room_no" class="block text-sm font-medium text-gray-600 mb-1">
                  Room Number
                </label>
                <input 
                  type="text"
                  id="room_no"
                  class="w-full border-2 border-gray-300 focus:border-green-600 focus:ring-2 focus:ring-green-100 p-2.5 rounded-lg outline-none transition text-sm"
                  placeholder="e.g., Room 204"
                >
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-600 mb-1">
                  Email
                </label>
                <input 
                  type="email"
                  id="email"
                  class="w-full border-2 border-gray-300 focus:border-green-600 focus:ring-2 focus:ring-green-100 p-2.5 rounded-lg outline-none transition text-sm"
                  placeholder="ola@gmail.com"
                >
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="flex items-center gap-3">
            <div class="flex-1 h-px bg-gray-300"></div>
            <span class="text-xs font-medium text-gray-500 uppercase">Or</span>
            <div class="flex-1 h-px bg-gray-300"></div>
          </div>

          <!-- Option 2: Custom Location -->
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                2
              </div>
              <h3 class="font-semibold text-gray-700 text-base">Deliver to Custom Location</h3>
            </div>

            <div class="ml-10">
              <label for="custom_location" class="block text-sm font-medium text-gray-600 mb-1">
                Specify Location
              </label>
              <input 
                type="text" 
                id="custom_location"
                class="w-full border-2 border-gray-300 focus:border-green-600 focus:ring-2 focus:ring-green-100 p-2.5 rounded-lg outline-none transition text-sm"
                placeholder="e.g., Faculty of Science, Block B"
              >
              <p class="text-xs text-gray-500 mt-1.5">
                📍 Enter class, library, or any campus location
              </p>
            </div>
          </div>

          <!-- Additional Instructions -->
          <div class="space-y-2">
            <label for="additional_message" class="block text-sm font-medium text-gray-700">
              Additional Instructions <span class="text-gray-400 font-normal">(Optional)</span>
            </label>
            <textarea 
              id="additional_message"
              rows="2"
              class="w-full border-2 border-gray-300 focus:border-green-600 focus:ring-2 focus:ring-green-100 p-2.5 rounded-lg outline-none transition resize-none text-sm"
              placeholder="e.g., Call me when you arrive..."
            ></textarea>
          </div>

          <!-- Info Box -->
          <div class="bg-green-50 border-l-4 border-green-600 p-3 rounded">
            <div class="flex gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-xs text-gray-700">
                <strong>Tip:</strong> Please ensure your location details are accurate for faster delivery!
              </p>
            </div>
          </div>
        </div>

        <!-- Footer - Fixed Button -->
        <div class="p-6 pt-4 border-t border-gray-200 flex-shrink-0">
          <button
            id="proceed-to-pay"
            class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Continue to Payment</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

      </div>
    `
      locationModal?.classList.remove("hidden")
      document.getElementById("close-location-modal")?.addEventListener("click", () => {
        locationModal?.classList.add("hidden")
      })
    }
    showOrderDetails()
  })
}

const showOrderDetails = () => { 
  document.getElementById("proceed-to-pay")?.addEventListener("click", () => { 
    const packs = getPacks() 
    const hall = document.getElementById('hall') as HTMLSelectElement 
    const email = document.getElementById("email") as HTMLInputElement | null
    const room = document.getElementById('room_no') as HTMLInputElement 
    const customLocation = document.getElementById('custom_location') as HTMLInputElement 
    const message = document.getElementById('additional_message') as HTMLTextAreaElement 
    const amount = grandTotals + packs.length * deliveryFee + packs.length * 200
    
    // Get delivery location
    const deliveryLocation = hall.value 
      ? `${hall.value} - Room ${room.value}` 
      : customLocation.value

    if(!hall.value || !room.value || !email?.value){
      alert("You must fill in the information below")
      return
    }
    
    // Calculate total
    if(!locationModal) return

    locationModal.innerHTML = ` 
      <div class="flex flex-col bg-white rounded-2xl w-full max-w-md shadow-2xl animate-fadeIn max-h-[90vh] overflow-hidden">
        
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 class="text-xl font-bold text-gray-800">Order Summary</h2>
          <button id="close-order-details" class="text-gray-400 hover:text-gray-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-6 overflow-y-auto flex-1">
          
          <!-- Order Info -->
          <div class="bg-green-50 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 class="font-semibold text-gray-800">Your Order</h3>
            </div>
            <p class="text-2xl font-bold text-green-600">${packs.length} Pack${packs.length > 1 ? 's' : ''}</p>
            <p class="text-sm text-gray-600 mt-1">${packs.reduce((total, pack) => total + pack.items.length, 0)} items total</p>
          </div>

          <!-- Delivery Details -->
          <div>
            <div class="flex items-center gap-2 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 class="font-semibold text-gray-800">Delivery Details</h3>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4 space-y-2">
              <div>
                <p class="text-xs text-gray-500 uppercase">Location</p>
                <p class="font-medium text-gray-800">${deliveryLocation}</p>
              </div>
              
              ${message.value ? `
                <div class="pt-2 border-t border-gray-200">
                  <p class="text-xs text-gray-500 uppercase">Additional Note</p>
                  <p class="text-sm text-gray-700">${message.value}</p>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Price Summary -->
          <div class="border-t border-gray-200 pt-4">
            <div class="flex justify-between items-center mb-2">
              <span class="text-gray-600">Subtotal</span>
              <span class="font-medium">₦${grandTotals.toLocaleString()}</span>
            </div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-gray-600">Delivery Fee</span>
              <span class="font-medium text-green-600">₦${deliveryFee * packs.length}</span>
            </div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-gray-600">Pack</span>
              <span class="font-medium text-green-600">₦${200 * packs.length}</span>
            </div>
            <div class="flex justify-between items-center pt-3 border-t border-gray-200">
              <span class="text-lg font-bold text-gray-800">Total</span>
              <span class="text-xl font-bold text-green-600">₦${amount}</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-6 pt-4 border-t border-gray-200 flex-shrink-0 space-y-3">
          <button
            id="pay"
            class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            Confirm & Pay ₦${amount}
          </button>
          <button
            id="edit-order"
            class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg transition-all"
          >
            Edit Order
          </button>
        </div>

      </div>
    ` 
    document.getElementById("edit-order")?.addEventListener("click", () => {
      locationModal?.classList.add("hidden")
    })

    document.getElementById("pay")?.addEventListener("click", () => {
      pay(email,amount)
    })
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