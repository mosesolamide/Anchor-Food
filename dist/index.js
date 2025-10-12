"use strict";
const harmburgerMenu = document.getElementById("harmburger");
const navList = document.getElementById("mobile-nav-list");
const foodCategories = document.getElementById("food-categories");
const productContainer = document.getElementById("product");
const foodCategoriesArr = ["All", "Proteins", "Swallows & Soup", "Drinks"];
const foodTempData = [
    {
        img: "./assets/Delivery.jpg",
        price: 3500,
        category: "Food",
        name: "Jollof Rice",
        id: 1,
        des: "200$ pack cost inclusive",
    },
    {
        img: "./assets/Delivery.jpg",
        price: 3500,
        category: "Swallows & Soup",
        name: "Eba",
        id: 2,
        des: "200$ pack cost inclusive",
    },
    {
        img: "./assets/Delivery.jpg",
        price: 3500,
        category: "Proteins",
        name: "Fish",
        id: 3,
        des: "200$ pack cost inclusive",
    },
    {
        img: "./assets/Delivery.jpg",
        price: 3500,
        category: "Drinks",
        name: "Pepsi",
        id: 4,
        des: "200$ pack cost inclusive",
    },
];
let filterData = [...foodTempData];
// ================ Hamburger Menu ==================
harmburgerMenu === null || harmburgerMenu === void 0 ? void 0 : harmburgerMenu.addEventListener("click", () => {
    navList === null || navList === void 0 ? void 0 : navList.classList.toggle("hidden");
});
// =============== Order functions ===================
const selectCategory = (selectedCategory) => {
    // Remove active border from all li elements
    const allCategories = foodCategories === null || foodCategories === void 0 ? void 0 : foodCategories.querySelectorAll("li");
    allCategories === null || allCategories === void 0 ? void 0 : allCategories.forEach((item) => {
        item.classList.remove("border-b-[4px]", "border-navbar");
    });
    // Add thicker border to clicked element
    const activeCategory = foodCategories === null || foodCategories === void 0 ? void 0 : foodCategories.querySelector(`li[data-category="${selectedCategory}"]`);
    activeCategory === null || activeCategory === void 0 ? void 0 : activeCategory.classList.add("border-b-[4px]", "border-navbar");
    // Filter foods
    if (selectedCategory === "All") {
        filterData = foodTempData;
    }
    else {
        filterData = foodTempData.filter((item) => { var _a; return ((_a = item.category) === null || _a === void 0 ? void 0 : _a.toUpperCase()) === selectedCategory.toUpperCase(); });
    }
    displayFood();
};
// =============== Create Categories ==================
if (foodCategories) {
    foodCategoriesArr.forEach((category, index) => {
        const li = document.createElement("li");
        li.className =
            "relative px-2 md:px-4 rounded cursor-pointer transition-all duration-300 " +
                "before:absolute before:left-0 before:bottom-0 before:h-[2px] before:w-0 before:bg-navbar " +
                "hover:before:w-full before:transition-all before:duration-300";
        li.textContent = category.toUpperCase();
        li.dataset.category = category;
        li.onclick = () => selectCategory(category);
        if (index === 0)
            li.classList.add("border-b-[4px]", "border-navbar");
        foodCategories.appendChild(li);
    });
}
// =============== Display Food ==================
const displayFood = () => {
    if (!productContainer)
        return;
    const foodHTML = filterData
        .map(({ img, price, name, des }) => `
        <div class="flex flex-col md:flex-row space-x-4 md:items-start border-b border-green-600 py-10 max-w-[650px] md:h-[220px]">
          <div class="w-38 h-34 mx-auto md:m-4">
            <img src="${img}" alt="${name}" class="w-full h-full object-cover rounded">
          </div>

          <div class="space-y-2.5 order-3 md:order-0 md:space-y-6.5 mt-4">
            <h2 class="text-sm md:text-[18px] font-bold">${name}</h2>
            <p class="text-sm">${des}</p>
            <button class="bg-btn font-semibold px-4 py-2 rounded w-full hover:bg-btn">Add to Cart</button>
          </div>

          <div class="flex md:flex-col justify-between h-full mt-4 mt-0">
            <label class="flex gap-2 font-medium">
              Quantity:
              <input 
                type="number" 
                class="border w-18 rounded indent-2" 
                value="1"
              >
            </label>
            <span class="font-bold block">$${price}</span>
          </div>
        </div>
      `)
        .join("");
    productContainer.innerHTML = foodHTML;
};
// Call the function after the page loads
window.onload = displayFood;
