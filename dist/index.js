"use strict";
const harmburgerMenu = document.getElementById("harmburger");
const navList = document.getElementById("mobile-nav-list");
const foodCategories = document.getElementById("food-categories");
const foodCategoriesArr = ["All", "Proteins", "Swallows & Soup", "Drinks"];
harmburgerMenu === null || harmburgerMenu === void 0 ? void 0 : harmburgerMenu.addEventListener("click", () => {
    navList === null || navList === void 0 ? void 0 : navList.classList.toggle("hidden");
});
const selectCategory = (selectedCategory) => {
    console.log(selectedCategory);
    // Remove active border from all li elements
    const allCategories = foodCategories === null || foodCategories === void 0 ? void 0 : foodCategories.querySelectorAll('li');
    allCategories === null || allCategories === void 0 ? void 0 : allCategories.forEach(item => {
        item.classList.remove('border', 'border-navbar');
    });
    // Add border to clicked element
    const activeCategory = foodCategories === null || foodCategories === void 0 ? void 0 : foodCategories.querySelector(`li[data-category="${selectedCategory}"]`);
    activeCategory === null || activeCategory === void 0 ? void 0 : activeCategory.classList.add('border', 'border-navbar');
};
// Update your li creation:
if (foodCategories) {
    foodCategoriesArr.forEach(category => {
        const li = document.createElement('li');
        li.className = 'px-2 md:px-4 rounded cursor-pointer transition hover:bg-btn-hover'; // No border by default
        li.textContent = category;
        li.dataset.category = category;
        li.onclick = () => selectCategory(category);
        foodCategories.appendChild(li);
    });
}
