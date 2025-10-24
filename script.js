// === CAPY WORKBENCH CALCULATOR === //
// 😎 made with logic and love

// 🔹 Konversi tabel ke Epic+0
const conversionTable = {
  "Epic+0": { sitem: 1, fodder: 0 },
  "Epic+1": { sitem: 1, fodder: 1 },
  "Epic+2": { sitem: 1, fodder: 3 },
  "Legendary+0": { sitem: 3, fodder: 9 },
  "Legendary+1": { sitem: 3, fodder: 21 },
  "Legendary+2": { sitem: 3, fodder: 33 },
  "Legendary+3": { sitem: 6, fodder: 42 },
  "Mythic+0": { sitem: 18, fodder: 126 },
  "Mythic+1": { sitem: 36, fodder: 252 },
  "Mythic+2": { sitem: 54, fodder: 378 },
  "Mythic+3": { sitem: 72, fodder: 504 },
  "Mythic+4": { sitem: 90, fodder: 630 }
};

// 🔹 Tier list biar berurutan
const tiers = [
  "Epic+0", "Epic+1", "Epic+2",
  "Legendary+0", "Legendary+1", "Legendary+2", "Legendary+3",
  "Mythic+0", "Mythic+1", "Mythic+2", "Mythic+3", "Mythic+4"
];

// 🔹 Ambil total konversi ke Epic+0
function calculateTotals(prefix) {
  let totalSItem = 0;
  let totalFodder = 0;

  tiers.forEach(tier => {
    // ganti simbol untuk ID input (biar nyocok)
    const idSafe = tier.toLowerCase().replace("+", "").replace(/\s/g, "_");

    const sItemValue = Number(document.getElementById(`${prefix}_sitem_${idSafe}`)?.value || 0);
    const fodderValue = Number(document.getElementById(`${prefix}_fod_${idSafe}`)?.value || 0);

    totalSItem += sItemValue * conversionTable[tier].sitem;
    totalFodder += fodderValue * conversionTable[tier].fodder;
  });

  return { sitem: totalSItem, fodder: totalFodder };
}

// 🔹 Update result secara realtime
function updateResult() {
  const owned = calculateTotals("owned");
  const target = calculateTotals("target");

  const diffSItem = owned.sitem - target.sitem;
  const diffFodder = owned.fodder - target.fodder;

  const resultBox = document.getElementById("result");
  if (!resultBox) return;

  let sItemText = diffSItem >= 0
    ? `S-Item: +${diffSItem.toLocaleString()} (Lebih 😎)`
    : `S-Item: ${diffSItem.toLocaleString()} (Kurang 😭)`;

  let fodderText = diffFodder >= 0
    ? `Fodder: +${diffFodder.toLocaleString()} (Lebih 🤓)`
    : `Fodder: ${diffFodder.toLocaleString()} (Kurang 😭)`;

  resultBox.innerHTML = `
    <h3>Result</h3>
    <p>${sItemText}</p>
    <p>${fodderText}</p>
  `;
}

// 🔹 Listener untuk semua input biar auto update
document.querySelectorAll("input").forEach(input => {
  input.addEventListener("input", updateResult);
});

// Jalankan sekali di awal
updateResult();
