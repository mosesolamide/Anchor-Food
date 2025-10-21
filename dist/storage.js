import { displayFood, setCurrentPackId, displayCart } from "./ui.js";
// ================= Get or Initialize Packs =================
export const getPacks = () => {
    const packs = localStorage.getItem("packs");
    if (!packs || JSON.parse(packs).length === 0) {
        const initialPack = { id: 1, packNo: 1, items: [] };
        localStorage.setItem("packs", JSON.stringify([initialPack]));
        return [initialPack];
    }
    return JSON.parse(packs);
};
// ================= Save Packs =================
export const savePacks = (packs) => {
    localStorage.setItem("packs", JSON.stringify(packs));
};
// ============ Create a new pack ==============
export const createNewPack = () => {
    const packs = getPacks();
    const newPackNo = packs.length + 1;
    const newPack = {
        id: newPackNo,
        packNo: newPackNo,
        items: []
    };
    packs.push(newPack);
    savePacks(packs);
    setCurrentPackId(newPack.id);
    displayCart();
    displayFood();
    alert(`Pack ${newPackNo} created! Now adding items to Pack ${newPackNo}`);
};
