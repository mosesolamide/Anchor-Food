// import type { Pack } from "./type"
// import { displayCart } from "./ui"


// export let currentPackId = 1 // Track which pack is currently selected
// // const deliveryFee = 200


// // ================= Get or Initialize Packs =================
// export const getPacks = (): Pack[] => {
//   const packs = localStorage.getItem("packs")
//   if (!packs || JSON.parse(packs).length === 0) {
//     const initialPack: Pack = { id: 1, packNo: 1, items: [] }
//     localStorage.setItem("packs", JSON.stringify([initialPack]))
//     return [initialPack]
//   }
//   return JSON.parse(packs)
// }

// // ================= Save Packs =================
// export const savePacks = (packs: Pack[]) => {
//   localStorage.setItem("packs", JSON.stringify(packs))
// }

// // ================= Delete Pack =================
// export const deletePack = (packId: number) => {
//   const packs = getPacks()
  
//   if (packs.length === 1) {
//     alert("You must have at least one pack!")
//     return
//   }
  
//   const filteredPacks = packs.filter(pack => pack.id !== packId)
  
//   // Reassign pack numbers
//   filteredPacks.forEach((pack, index) => {
//     pack.packNo = index + 1
//   })
  
//   savePacks(filteredPacks)
  
//   // If deleted pack was selected, switch to first pack
//   if (currentPackId === packId) {
//     currentPackId = filteredPacks[0].id
//   }
  
//   displayCart()
// }

// // // ================= Create New Pack =================
// export const createNewPack = () => {
//   const packs = getPacks()
//   const newPackNo = packs.length + 1
//   const newPack: Pack = {
//     id: newPackNo,
//     packNo: newPackNo,
//     items: []
//   }
  
//   packs.push(newPack)
//   savePacks(packs)
//   currentPackId = newPack.id
  
//   displayCart()
//   alert(`Pack ${newPackNo} created! Now adding items to Pack ${newPackNo}`)
// }

// // ================= Select Pack =================
// export const selectPack = (packId: number) => {
//   currentPackId = packId
//   displayCart()
// }

