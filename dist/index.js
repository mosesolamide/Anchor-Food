var _a, _b;
import { foodTempData } from "./foodData.js";
import { getPacks, savePacks } from "./storage.js";
import { displayFood, productContainer, currentPackId, setCurrentPackId, setFilteredFood, displayCart, cartItems } from "./ui.js";
// DOM Element
const harmburgerMenu = document.getElementById("harmburger");
const navList = document.getElementById("mobile-nav-list");
const foodCategories = document.getElementById("food-categories");
const cartModal = document.getElementById("cartModal");
// CATEGORIES
const foodCategoriesArr = ["All", "Proteins", "Swallows & Soup", "Drinks"];
// ================= Select Pack =================
const selectPack = (packId) => {
    setCurrentPackId(packId);
    displayCart();
};
// ================= Delete Pack =================
const deletePack = (packId) => {
    const packs = getPacks();
    if (packs.length === 1) {
        alert("You must have at least one pack!");
        return;
    }
    const filteredPacks = packs.filter(pack => pack.id !== packId);
    // Reassign pack numbers
    filteredPacks.forEach((pack, index) => {
        pack.packNo = index + 1;
    });
    savePacks(filteredPacks);
    // If deleted pack was selected, switch to first pack
    if (currentPackId === packId) {
        setCurrentPackId(filteredPacks[0].id);
    }
    displayCart();
};
// ================= Hamburger Menu =================
harmburgerMenu === null || harmburgerMenu === void 0 ? void 0 : harmburgerMenu.addEventListener("click", () => {
    navList === null || navList === void 0 ? void 0 : navList.classList.toggle("hidden");
});
// ================= Category Selection =================
const selectCategory = (selectedCategory) => {
    const allCategories = foodCategories === null || foodCategories === void 0 ? void 0 : foodCategories.querySelectorAll("li");
    allCategories === null || allCategories === void 0 ? void 0 : allCategories.forEach((item) => {
        item.classList.remove("border-b-[4px]", "border-navbar");
    });
    const activeCategory = foodCategories === null || foodCategories === void 0 ? void 0 : foodCategories.querySelector(`li[data-category="${selectedCategory}"]`);
    activeCategory === null || activeCategory === void 0 ? void 0 : activeCategory.classList.add("border-b-[4px]", "border-navbar");
    displayFood(true);
    if (selectedCategory === "All") {
        setFilteredFood(foodTempData);
    }
    else {
        setFilteredFood(foodTempData.filter((item) => { var _a; return ((_a = item.category) === null || _a === void 0 ? void 0 : _a.toUpperCase()) === selectedCategory.toUpperCase(); }));
    }
    displayFood();
};
// ================= Create Category Tabs =================
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
// ================= Add to Cart =================
productContainer === null || productContainer === void 0 ? void 0 : productContainer.addEventListener("click", (e) => {
    var _a, _b;
    const button = e.target.closest(".add-to-cart");
    if (!button)
        return;
    const card = button.closest(".food-card");
    const itemName = (_b = (_a = card === null || card === void 0 ? void 0 : card.querySelector("h2")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim();
    const quantityInput = card === null || card === void 0 ? void 0 : card.querySelector("input[type='number']");
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
    if (quantity < 1) {
        alert("Quantity must be at least 1");
        return;
    }
    const currentItem = foodTempData.find((item) => item.name === itemName);
    if (!currentItem)
        return;
    const packs = getPacks();
    const currentPack = packs.find(pack => pack.id === currentPackId);
    if (!currentPack)
        return;
    // Check if item already exists in current pack
    const existingItem = currentPack.items.find((item) => item.id === currentItem.id);
    if (existingItem) {
        existingItem.quantity += quantity;
    }
    else {
        currentPack.items.push(Object.assign(Object.assign({}, currentItem), { quantity }));
    }
    savePacks(packs);
    displayCart();
    alert(`${currentItem.name} (x${quantity}) added to Pack ${currentPack.packNo}!`);
    // Reset quantity input
    if (quantityInput)
        quantityInput.value = "1";
});
// ================= Cart Quantity Update =================
cartItems === null || cartItems === void 0 ? void 0 : cartItems.addEventListener("click", (e) => {
    const updateQuantity = e.target.closest(".quantity-btn");
    if (!updateQuantity)
        return;
    const action = updateQuantity.dataset.action;
    const packId = Number(updateQuantity.dataset.packId);
    const itemId = Number(updateQuantity.dataset.itemId);
    if (!action || !packId || !itemId)
        return;
    const packs = getPacks();
    const pack = packs.find(p => p.id === packId);
    if (!pack)
        return;
    const foundItem = pack.items.find((item) => item.id === itemId);
    if (!foundItem)
        return;
    if (action === "increment") {
        foundItem.quantity += 1;
    }
    else if (action === "decrement" && foundItem.quantity > 1) {
        foundItem.quantity -= 1;
    }
    savePacks(packs);
    displayCart();
});
// ================= Delete Cart Item =================
cartItems === null || cartItems === void 0 ? void 0 : cartItems.addEventListener("click", (e) => {
    const deleteBtn = e.target.closest(".delete-btn");
    if (!deleteBtn)
        return;
    const packId = Number(deleteBtn.dataset.packId);
    const itemId = Number(deleteBtn.dataset.itemId);
    if (!packId || !itemId)
        return;
    const packs = getPacks();
    const pack = packs.find(p => p.id === packId);
    if (!pack)
        return;
    pack.items = pack.items.filter((item) => item.id !== itemId);
    savePacks(packs);
    displayCart();
    alert("Item removed successfully");
});
// ================= Select Pack =================
cartItems === null || cartItems === void 0 ? void 0 : cartItems.addEventListener("click", (e) => {
    const selectBtn = e.target.closest(".select-pack-btn");
    if (!selectBtn)
        return;
    const packId = Number(selectBtn.dataset.packId);
    if (!packId)
        return;
    selectPack(packId);
    displayFood(); // Refresh to update button text
});
// ================= Delete Pack =================
cartItems === null || cartItems === void 0 ? void 0 : cartItems.addEventListener("click", (e) => {
    const deletePackBtn = e.target.closest(".delete-pack-btn");
    if (!deletePackBtn)
        return;
    const packId = Number(deletePackBtn.dataset.packId);
    if (!packId)
        return;
    if (confirm("Are you sure you want to delete this pack?")) {
        deletePack(packId);
    }
});
// ================= Cart Modal Controls =================
(_a = document.getElementById("open-cart")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    cartModal === null || cartModal === void 0 ? void 0 : cartModal.classList.toggle("hidden");
    navList === null || navList === void 0 ? void 0 : navList.classList.add("hidden");
    displayCart();
});
(_b = document.getElementById("close-cart")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
    cartModal === null || cartModal === void 0 ? void 0 : cartModal.classList.toggle("hidden");
});
// ================= Initial Load =================
window.onload = () => {
    getPacks(); // Initialize packs if none exist
    selectCategory("All");
    displayCart();
};
// ================= Year Auto Update =================
const yearEl = document.getElementById("year");
if (yearEl)
    yearEl.textContent = new Date().getFullYear().toString();
