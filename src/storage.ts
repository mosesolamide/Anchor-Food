import { Pack } from "./type"

// ================= Get or Initialize Packs =================
export const getPacks = (): Pack[] => {
  const packs = localStorage.getItem("packs")
  if (!packs || JSON.parse(packs).length === 0) {
    const initialPack: Pack = { id: 1, packNo: 1, items: [] }
    localStorage.setItem("packs", JSON.stringify([initialPack]))
    return [initialPack]
  }
  return JSON.parse(packs)
}

// ================= Save Packs =================
export const savePacks = (packs: Pack[]) => {
  localStorage.setItem("packs", JSON.stringify(packs))
}