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

// ================= Hamburger Menu =================
harmburgerMenu?.addEventListener("click", () => {
  navList?.classList.toggle("hidden")
})

// ================= Display Food =================
const displayFood = (isLoading = false) => {
  if (!productContainer) return

  // show spinner
  if (isLoading) {
    productContainer.innerHTML = `
      <div class="flex justify-center items-center py-20">
        <div class="w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    `
    return
  }

  // if no items
  if (filteredFood.length <= 0) {
    productContainer.innerHTML = `
      <div class="text-center text-gray-600 font-semibold py-20">
        No food items found 😢
      </div>
    `
    return
  }

  // display food
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
              Add to Cart
            </button>
          </div>

          <div class="flex md:flex-col justify-between h-full mt-4 md:mt-0">
            <label class="flex gap-2 font-medium">
              Quantity:
              <input 
                type="number" 
                class="border w-20 rounded indent-2" 
                value="1"
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

  const currentItem = foodTempData.find((item) => item.name === itemName)
  if (!currentItem) return

  let carts = JSON.parse(localStorage.getItem("cart") || "[]")
  if(carts.length === 0){
    createNewPack()
  }

  const existingItem = carts.find((item: Food) => item.name === currentItem.name)

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    carts.push({ ...currentItem, quantity })
  }

  localStorage.setItem("cart", JSON.stringify(carts))
  alert("Item Added")
  // displayCart()
})

const createNewPack = () => {
  const packs = JSON.parse(localStorage.getItem("packs") || "[]")
  if(!packs) return
  // check for packs length
  const packLength = packs.length
  // create a new object of pack and add carts items
  const packObj = {
    id: packLength + 1,
    packNo: packLength === 0? 1 : packLength + 1, // if pack length is 0 then add 1 to pack number else packs lenght + 1
    items: []
  }
  // store new object into packs storage
  localStorage.setItem("packs", JSON.stringify(packObj))
}

setInterval( () => {
  console.log(JSON.parse(localStorage.getItem("packs") || "[]"))
},5000)

// ================= Display Cart =================
const displayCart = () => {
  const availableCarts = JSON.parse(localStorage.getItem("cart") || "[]")

  if (availableCarts.length <= 0) {
    if (!cartItems) return
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
// <h2 class="block">Pack 1</h2>
  const cartsHtml = availableCarts
    .map(
      ({ img, price, name, quantity, id }: Food) => `
        <div class="flex justify-between items-center border-b border-gray-200 py-4">
          
          <div class="flex items-center gap-4">
            <img src=${img} alt=${name} class="w-14 h-14 rounded-md object-cover shadow-sm" />
            <div>
              <h2 class="font-semibold text-gray-800">${name}</h2>
              <p class="text-green-600 font-medium">₦${price}</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="cart-item flex items-center border border-gray-300 rounded-md overflow-hidden">
              <button 
                data-id=${id} 
                data-action="decrement"
                class="quantity-btn px-2 py-1 text-gray-700 hover:bg-gray-100 font-bold">
                −
              </button>

              <span class="w-10 text-center border-none outline-none appearance-none">${quantity}</span>

              <button 
                data-id=${id} 
                data-action="increment"
                class="quantity-btn px-2 py-1 text-gray-700 hover:bg-gray-100 font-bold">
                +
              </button>
            </div>

            <button 
              class="delete-btn text-red-600 hover:text-red-700 cursor-pointer"
              data-id=${id}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
              </svg>
            </button>
          </div>
        </div>
      `
    )
    .join("")

  if (!cartItems) return
  cartItems.innerHTML = cartsHtml
}

// ================= Cart Quantity Update =================
cartItems?.addEventListener("click", (e) => {
  const updateQuantity = (e.target as HTMLElement).closest(".quantity-btn") as HTMLElement | null
  if (!updateQuantity) return

  const action = updateQuantity.dataset.action
  const id = Number(updateQuantity.dataset.id)
  if (!action || !id) return

  const carts: Food[] = JSON.parse(localStorage.getItem("cart") || "[]")
  const foundItem = carts.find((item) => item.id === id)
  if (!foundItem) return

  if (action === "increment") foundItem.quantity += 1
  else if (action === "decrement" && foundItem.quantity > 1) foundItem.quantity -= 1

  localStorage.setItem("cart", JSON.stringify(carts))

  const quantityDisplay = updateQuantity
    .closest(".cart-item")
    ?.querySelector("span") as HTMLElement
  if (quantityDisplay) quantityDisplay.textContent = foundItem.quantity.toString()
})

// ================= Delete Cart Item =================
cartItems?.addEventListener("click", (e) => {
  const deleteBtn = (e.target as HTMLElement).closest(".delete-btn") as HTMLElement | null
  if (!deleteBtn) return

  const itemId = deleteBtn.dataset.id
  if (!itemId) return

  const carts: Food[] = JSON.parse(localStorage.getItem("cart") || "[]")
  const removeItem = carts.filter((item) => item.id !== Number(itemId))

  localStorage.setItem("cart", JSON.stringify(removeItem))
  alert("Item removed successfully")
  displayCart()
})

// ================= Cart Modal Controls =================
document.getElementById("open-cart")?.addEventListener("click", () => {
  cartModal?.classList.toggle("hidden")
  navList?.classList.add("hidden")
})

document.getElementById("close-cart")?.addEventListener("click", () => {
  cartModal?.classList.toggle("hidden")
})

// ================= Initial Load =================
window.onload = () => {
  selectCategory("All")
  displayCart()
}

// ================= Year Auto Update =================
const yearEl = document.getElementById("year") as HTMLElement
if (yearEl) yearEl.textContent = new Date().getFullYear().toString()
