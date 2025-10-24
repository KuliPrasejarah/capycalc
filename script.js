/**
 * Capy Workbench Calculator - script.js (V3: Explicit Call)
 *
 * Logika perhitungan:
 * - Setiap input dipanggil satu per satu menggunakan ID eksplisit.
 * - Ini membuat kode sangat mudah dibaca, di-debug, dan diubah perhitungannya.
 */

// 1. Tabel Konversi (Data sumber tetap sama)
// Item S-Item: [S-Item Value, Fodder Value] dalam satuan Epic +0.
const CONVERSION_TABLE = {
    // Tier: [S-Item Value, Fodder Value]
    'Epic +0': [1, 0],
    'Epic +1': [1, 1],
    'Epic +2': [1, 3],
    'Legend +0': [3, 9],
    'Legend +1': [3, 21],
    'Legend +2': [3, 33],
    'Legend +3': [6, 42],
    'Mythic +0': [18, 126],
    'Mythic +1': [36, 252],
    'Mythic +2': [54, 378],
    'Mythic +3': [72, 504],
    'Mythic +4': [90, 630]
};

/**
 * Fungsi Pembantu: Memastikan nilai dari input adalah integer non-negatif.
 * Ini adalah 'Best Practice' biar kalkulator gak crash kalau user input teks.
 * @param {string} id - ID element input.
 * @returns {number} - Nilai integer non-negatif.
 */
function getInputValue(id) {
    const element = document.getElementById(id);
    if (element) {
        // parseInt(element.value, 10) -> Mengambil nilai dan mengubah ke angka basis 10.
        // || 0 -> Kalau nilai kosong (NaN), anggap saja 0.
        // Math.max(0, ...) -> Memastikan nilainya tidak minus (karena jumlah item gak mungkin minus).
        return Math.max(0, parseInt(element.value, 10) || 0);
    }
    return 0;
}

/**
 * Pemasangan ID dan Event Listener.
 * Karena kita mau sangat detail, kita pastikan setiap input sudah punya ID.
 * Di versi ini, kita biarkan fungsi ini saja yang pakai loop, karena cuma untuk setup.
 */
function setupInputListeners() {
    const TIERS = Object.keys(CONVERSION_TABLE); // Ambil semua nama Tier

    // 1. OWNED ITEMS - S-Item
    const ownedSitemInputs = document.querySelectorAll('.section:nth-child(1) .columns .column:nth-child(1) input');
    TIERS.forEach((tier, index) => {
        const tierId = tier.replace(/\s/g, '').replace('+', ''); // Contoh: 'Epic +0' jadi 'Epic0'
        ownedSitemInputs[index].id = `owned_sitem_${tierId}`;
        ownedSitemInputs[index].addEventListener('input', calculate); // Tambahkan Listener
    });

    // 2. OWNED ITEMS - Fodder
    const ownedFodderInputs = document.querySelectorAll('.section:nth-child(1) .columns .column:nth-child(2) input');
    TIERS.forEach((tier, index) => {
        const tierId = tier.replace(/\s/g, '').replace('+', '');
        ownedFodderInputs[index].id = `owned_fodder_${tierId}`;
        ownedFodderInputs[index].addEventListener('input', calculate);
    });

    // 3. TARGET ITEMS - S-Item
    const targetSitemInputs = document.querySelectorAll('.section:nth-child(2) .columns .column:nth-child(1) input');
    TIERS.forEach((tier, index) => {
        const tierId = tier.replace(/\s/g, '').replace('+', '');
        targetSitemInputs[index].id = `target_sitem_${tierId}`;
        targetSitemInputs[index].addEventListener('input', calculate);
    });
}


/**
 * Fungsi Utama Perhitungan (Logic Inti!)
 * Di sini kita akan lihat setiap baris perhitungan S-Item dan Fodder.
 */
function calculate() {
    
    // =========================================================================
    // BAGIAN 1: MENGAMBIL SEMUA NILAI INPUT DARI HTML (Inilah yang Paling Manual!)
    // =========================================================================

    // A. OWNED S-ITEM Quantities
    const qsOwnedSitemE0 = getInputValue('owned_sitem_Epic0');
    const qsOwnedSitemE1 = getInputValue('owned_sitem_Epic1');
    const qsOwnedSitemE2 = getInputValue('owned_sitem_Epic2');
    const qsOwnedSitemL0 = getInputValue('owned_sitem_Legend0');
    const qsOwnedSitemL1 = getInputValue('owned_sitem_Legend1');
    const qsOwnedSitemL2 = getInputValue('owned_sitem_Legend2');
    const qsOwnedSitemL3 = getInputValue('owned_sitem_Legend3');
    const qsOwnedSitemM0 = getInputValue('owned_sitem_Mythic0');
    const qsOwnedSitemM1 = getInputValue('owned_sitem_Mythic1');
    const qsOwnedSitemM2 = getInputValue('owned_sitem_Mythic2');
    const qsOwnedSitemM3 = getInputValue('owned_sitem_Mythic3');
    const qsOwnedSitemM4 = getInputValue('owned_sitem_Mythic4');

    // B. OWNED FODDER Quantities
    const qfOwnedFodderE0 = getInputValue('owned_fodder_Epic0');
    const qfOwnedFodderE1 = getInputValue('owned_fodder_Epic1');
    const qfOwnedFodderE2 = getInputValue('owned_fodder_Epic2');
    const qfOwnedFodderL0 = getInputValue('owned_fodder_Legend0');
    const qfOwnedFodderL1 = getInputValue('owned_fodder_Legend1');
    const qfOwnedFodderL2 = getInputValue('owned_fodder_Legend2');
    const qfOwnedFodderL3 = getInputValue('owned_fodder_Legend3');
    const qfOwnedFodderM0 = getInputValue('owned_fodder_Mythic0');
    const qfOwnedFodderM1 = getInputValue('owned_fodder_Mythic1');
    const qfOwnedFodderM2 = getInputValue('owned_fodder_Mythic2');
    const qfOwnedFodderM3 = getInputValue('owned_fodder_Mythic3');
    const qfOwnedFodderM4 = getInputValue('owned_fodder_Mythic4');

    // C. TARGET S-ITEM Quantities
    const qtTargetSitemE0 = getInputValue('target_sitem_Epic0');
    const qtTargetSitemE1 = getInputValue('target_sitem_Epic1');
    const qtTargetSitemE2 = getInputValue('target_sitem_Epic2');
    const qtTargetSitemL0 = getInputValue('target_sitem_Legend0');
    const qtTargetSitemL1 = getInputValue('target_sitem_Legend1');
    const qtTargetSitemL2 = getInputValue('target_sitem_Legend2');
    const qtTargetSitemL3 = getInputValue('target_sitem_Legend3');
    const qtTargetSitemM0 = getInputValue('target_sitem_Mythic0');
    const qtTargetSitemM1 = getInputValue('target_sitem_Mythic1');
    const qtTargetSitemM2 = getInputValue('target_sitem_Mythic2');
    const qtTargetSitemM3 = getInputValue('target_sitem_Mythic3');
    const qtTargetSitemM4 = getInputValue('target_sitem_Mythic4');


    // =========================================================================
    // BAGIAN 2: PERHITUNGAN TOTAL KEPEMILIKAN (OWNED) DALAM EPIC +0 UNIT
    // =========================================================================

    // Mengambil nilai konversi untuk S-Item dan Fodder dari CONVERSION_TABLE
    const [S_E0, F_E0] = CONVERSION_TABLE['Epic +0'];
    const [S_E1, F_E1] = CONVERSION_TABLE['Epic +1'];
    const [S_E2, F_E2] = CONVERSION_TABLE['Epic +2'];
    const [S_L0, F_L0] = CONVERSION_TABLE['Legend +0'];
    const [S_L1, F_L1] = CONVERSION_TABLE['Legend +1'];
    const [S_L2, F_L2] = CONVERSION_TABLE['Legend +2'];
    const [S_L3, F_L3] = CONVERSION_TABLE['Legend +3'];
    const [S_M0, F_M0] = CONVERSION_TABLE['Mythic +0'];
    const [S_M1, F_M1] = CONVERSION_TABLE['Mythic +1'];
    const [S_M2, F_M2] = CONVERSION_TABLE['Mythic +2'];
    const [S_M3, F_M3] = CONVERSION_TABLE['Mythic +3'];
    const [S_M4, F_M4] = CONVERSION_TABLE['Mythic +4'];

    
    // --- TOTAL S-ITEM (Dari Pemecahan Owned S-Item) ---
    // Total S-Item (TS) = Qty Owned S-Item * S-Item Value Tier-nya
    const totalOwnedSItem = 
        (qsOwnedSitemE0 * S_E0) + (qsOwnedSitemE1 * S_E1) + (qsOwnedSitemE2 * S_E2) + 
        (qsOwnedSitemL0 * S_L0) + (qsOwnedSitemL1 * S_L1) + (qsOwnedSitemL2 * S_L2) + 
        (qsOwnedSitemL3 * S_L3) +
        (qsOwnedSitemM0 * S_M0) + (qsOwnedSitemM1 * S_M1) + (qsOwnedSitemM2 * S_M2) + 
        (qsOwnedSitemM3 * S_M3) + (qsOwnedSitemM4 * S_M4);


    // --- TOTAL FODDER (Dari Pemecahan Owned S-Item + Owned Fodder) ---
    
    // Fodder dari Pemecahan Owned S-Item: Qty Owned S-Item * Fodder Value Tier-nya
    const fodderFromSItem = 
        (qsOwnedSitemE0 * F_E0) + (qsOwnedSitemE1 * F_E1) + (qsOwnedSitemE2 * F_E2) + 
        (qsOwnedSitemL0 * F_L0) + (qsOwnedSitemL1 * F_L1) + (qsOwnedSitemL2 * F_L2) + 
        (qsOwnedSitemL3 * F_L3) +
        (qsOwnedSitemM0 * F_M0) + (qsOwnedSitemM1 * F_M1) + (qsOwnedSitemM2 * F_M2) + 
        (qsOwnedSitemM3 * F_M3) + (qsOwnedSitemM4 * F_M4);

    // Fodder dari Pemecahan Owned Fodder: Qty Owned Fodder * (S-Item Value + Fodder Value) Tier-nya
    // Logika Fodder: 
    // Rumus: Qty Fodder * (S_VAL + F_VAL) -> Ini yang kita pakai, icibos.
    const fodderFromFodder =
        (qfOwnedFodderE0 * (S_E0 + F_E0)) + (qfOwnedFodderE1 * (S_E1 + F_E1)) + (qfOwnedFodderE2 * (S_E2 + F_E2)) +
        (qfOwnedFodderL0 * (S_L0 + F_L0)) + (qfOwnedFodderL1 * (S_L1 + F_L1)) + (qfOwnedFodderL2 * (S_L2 + F_L2)) +
        (qfOwnedFodderL3 * (S_L3 + F_L3)) +
        (qfOwnedFodderM0 * (S_M0 + F_M0)) + (qfOwnedFodderM1 * (S_M1 + F_M1)) + (qfOwnedFodderM2 * (S_M2 + F_M2)) +
        (qfOwnedFodderM3 * (S_M3 + F_M3)) + (qfOwnedFodderM4 * (S_M4 + F_M4));

    const totalOwnedFodder = fodderFromSItem + fodderFromFodder;


    // =========================================================================
    // BAGIAN 3: PERHITUNGAN TOTAL KEBUTUHAN (TARGET) DALAM EPIC +0 UNIT
    // =========================================================================

    // --- TOTAL TARGET S-ITEM ---
    // Total Target S-Item (TS) = Qty Target S-Item * S-Item Value Tier-nya
    const totalTargetSItem = 
        (qtTargetSitemE0 * S_E0) + (qtTargetSitemE1 * S_E1) + (qtTargetSitemE2 * S_E2) + 
        (qtTargetSitemL0 * S_L0) + (qtTargetSitemL1 * S_L1) + (qtTargetSitemL2 * S_L2) + 
        (qtTargetSitemL3 * S_L3) +
        (qtTargetSitemM0 * S_M0) + (qtTargetSitemM1 * S_M1) + (qtTargetSitemM2 * S_M2) + 
        (qtTargetSitemM3 * S_M3) + (qtTargetSitemM4 * S_M4);

    // --- TOTAL TARGET FODDER ---
    // Total Target Fodder (TF) = Qty Target S-Item * Fodder Value Tier-nya
    const totalTargetFodder = 
        (qtTargetSitemE0 * F_E0) + (qtTargetSitemE1 * F_E1) + (qtTargetSitemE2 * F_E2) + 
        (qtTargetSitemL0 * F_L0) + (qtTargetSitemL1 * F_L1) + (qtTargetSitemL2 * F_L2) + 
        (qtTargetSitemL3 * F_L3) +
        (qtTargetSitemM0 * F_M0) + (qtTargetSitemM1 * F_M1) + (qtTargetSitemM2 * F_M2) + 
        (qtTargetSitemM3 * F_M3) + (qtTargetSitemM4 * F_M4);


    // =========================================================================
    // BAGIAN 4: HASIL (SELISIH)
    // =========================================================================
    
    const resultSItem = totalTargetSItem - totalOwnedSItem;
    const resultFodder = totalTargetFodder - totalOwnedFodder;


    // =========================================================================
    // BAGIAN 5: MENAMPILKAN DAN STYLING HASIL
    // =========================================================================

    const rSItemElement = document.getElementById('r_sitem');
    const rFodderElement = document.getElementById('r_fodder');

    // toLocaleString() untuk format angka yang enak dibaca (misalnya 10,000)
    rSItemElement.textContent = resultSItem.toLocaleString();
    rFodderElement.textContent = resultFodder.toLocaleString();

    // Styling sesuai permintaan Red-Yellow-Green (kita pakai Red dan Green)
    const redFont = '#9C0006'; 
    const redFill = '#FFC7CE'; 
    const greenFont = '#006100'; 
    const greenFill = '#C6EFCE'; 
    const neutralFill = '#f5f5f5'; // Default background

    // S-Item Result Styling
    if (resultSItem > 0) { // Kekurangan (Butuh) -> Merah (Bad)
        rSItemElement.style.color = redFont; 
        rSItemElement.style.backgroundColor = redFill;
    } else if (resultSItem < 0) { // Kelebihan -> Hijau (Good)
        rSItemElement.style.color = greenFont; 
        rSItemElement.style.backgroundColor = greenFill;
    } else { // Pas -> Default
        rSItemElement.style.color = 'initial'; 
        rSItemElement.style.backgroundColor = neutralFill;
    }

    // Fodder Result Styling
    if (resultFodder > 0) { // Kekurangan (Butuh) -> Merah (Bad)
        rFodderElement.style.color = redFont;
        rFodderElement.style.backgroundColor = redFill;
    } else if (resultFodder < 0) { // Kelebihan -> Hijau (Good)
        rFodderElement.style.color = greenFont;
        rFodderElement.style.backgroundColor = greenFill;
    } else { // Pas -> Default
        rFodderElement.style.color = 'initial';
        rFodderElement.style.backgroundColor = neutralFill;
    }
    
    rSItemElement.style.fontWeight = 'bolder';
    rFodderElement.style.fontWeight = 'bolder';
}


// Jalankan setup saat dokumen selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    setupInputListeners();
    calculate();
});
