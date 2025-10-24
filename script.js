// ========================================
// 📦 Material Conversion Table (to Epic +0)
// ========================================

// Versi 1: Menggunakan kombinasi S-item dan Fodder
const materialConversion = {
  "Epic+0":      { sitem: 1,  fodder: 0 },
  "Epic+1":      { sitem: 1,  fodder: 1 },
  "Epic+2":      { sitem: 1,  fodder: 3 },
  "Legendary+0": { sitem: 3,  fodder: 9 },
  "Legendary+1": { sitem: 3,  fodder: 21 },
  "Legendary+2": { sitem: 3,  fodder: 33 },
  "Legendary+3": { sitem: 6,  fodder: 42 },
  "Mythic+0":    { sitem: 18, fodder: 126 },
  "Mythic+1":    { sitem: 36, fodder: 252 },
  "Mythic+2":    { sitem: 54, fodder: 378 },
  "Mythic+3":    { sitem: 72, fodder: 504 },
  "Mythic+4":    { sitem: 90, fodder: 630 }
};

// Versi 2: Semua dikonversi jadi setara Fodder total (jika ingin hitung bahan full)
const fodderOnlyConversion = {
  "Epic+0":      1,   // Base Epic
  "Epic+1":      2,   // Epic+0 + 1 fodder
  "Epic+2":      4,   // Epic+1 + 2 fodder
  "Legendary+0": 12,  // 3 S-item * 4 Epic each
  "Legendary+1": 30,  // 3 S-item + 21 fodder
  "Legendary+2": 48,
  "Legendary+3": 72,
  "Mythic+0":    252,
  "Mythic+1":    504,
  "Mythic+2":    756,
  "Mythic+3":    1008,
  "Mythic+4":    1260
};

// ========================================
// 🔍 Helper Functions
// ========================================

// Dapatkan material berdasarkan tier
function getMaterial(tier) {
  return materialConversion[tier] || { sitem: 0, fodder: 0 };
}

// Dapatkan total fodder (jika ingin konversi semua ke fodder)
function getTotalFodder(tier) {
  return fodderOnlyConversion[tier] || 0;
}
