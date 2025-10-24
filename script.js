/**
 * Capy Workbench Calculator - script.js
 *
 * Logika perhitungan:
 * 1. Semua item (Owned dan Target) dikonversi ke dalam satuan 'Epic +0' S-Item dan Fodder.
 * 2. Total Kebutuhan (Target) dikurangi Total Kepemilikan (Owned) untuk mendapatkan selisih (Result).
 */

// 1. Tabel Konversi
// Nilai adalah jumlah 'Epic +0' S-Item dan Fodder yang didapatkan jika item ini dipecah.
// Item S-Item: [S-Item Value, Fodder Value]
const CONVERSION_TABLE = {
    // Tier: [S-Item Value (sebagai Epic +0), Fodder Value (sebagai Epic +0)]
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

// Urutan tier yang digunakan untuk iterasi dan mapping ke input
const TIERS = [
    'Epic +0', 'Epic +1', 'Epic +2', 'Legend +0', 'Legend +1',
    'Legend +2', 'Legend +3', 'Mythic +0', 'Mythic +1',
    'Mythic +2', 'Mythic +3', 'Mythic +4'
];

/**
 * Mengambil nilai dari input dan memastikan nilainya non-negatif integer.
 * @param {string} id - ID element input.
 * @returns {number} - Nilai integer non-negatif.
 */
function getInputValue(id) {
    const element = document.getElementById(id);
    if (element) {
        return Math.max(0, parseInt(element.value, 10) || 0);
    }
    return 0;
}

/**
 * 2. Fungsi Konversi Item
 * Menghitung total S-Item dan Fodder Epic +0 dari semua item di sebuah kategori (Owned atau Target).
 * @param {string} category - Kategori item ('owned' atau 'target').
 * @param {string} itemType - Tipe item ('sitem' atau 'fodder').
 * @returns {object} - { totalSItem: number, totalFodder: number } dalam satuan Epic +0.
 */
function calculateTotalResources(category, itemType) {
    let totalSItem = 0;
    let totalFodder = 0;

    TIERS.forEach(tier => {
        // ID input mengikuti format: [kategori]_[tipe item]_[tier_tanpa_spasi]
        // Contoh: owned_sitem_Epic+0
        const inputId = `${category}_${itemType}_${tier.replace(/\s/g, '').replace('+', '')}`;
        const quantity = getInputValue(inputId);

        // Jika itemType adalah S-Item
        if (itemType === 'sitem') {
            // Konversi S-Item menghasilkan S-Item dan Fodder
            const [sItemValue, fodderValue] = CONVERSION_TABLE[tier];
            totalSItem += quantity * sItemValue;
            totalFodder += quantity * fodderValue;

        } else if (itemType === 'fodder') {
            // Konversi Fodder
            // Fodder yang dipecah menghasilkan:
            // S-Item: 0 (karena Fodder tidak menghasilkan S-Item, hanya Fodder)
            // Fodder: Sama seperti S-Item, karena 'Fodder' ini dianggap sebagai Fodder material murni.
            // Sesuai penjelasan: "2 legendary fodder +0 berarti dipecah menjadi epic+0 dengan fodder sebanyak 9 dan 3 (s item = fodder dalam konteks ini)"
            // -> Ini berarti 1 Legendary Fodder +0 setara 1 Legendary S-Item +0 Fodder Value (9) dan S-Item Value (3) *hanya Fodder*
            // KITA IKUTI KONSEP YANG PALING LOGIS DALAM KONTEKS GAME:
            // Item Fodder dipecah HANYA menghasilkan Fodder dalam jumlah yang sama dengan S-Item-nya.
            // Item Fodder +0 menghasilkan S-Item Fodder Value.
            const [sItemValue, fodderValue] = CONVERSION_TABLE[tier];
            // Dalam konteks Fodder, material yang didapat adalah Fodder.
            // Kita anggap Fodder menghasilkan Fodder sebanyak nilai Fodder (fodderValue) + nilai S-Item (sItemValue)
            // Ini untuk mengakomodasi contoh "3 (s item = fodder dalam konteks ini)"
            totalFodder += quantity * (fodderValue + sItemValue);
        }
    });

    return { totalSItem, totalFodder };
}


/**
 * 3. Fungsi Utama Perhitungan
 */
function calculate() {
    // --- Hitung Total Sumber Daya yang DIMILIKI (Owned) ---

    // Total Owned S-Item (sebagai Epic +0) dan Fodder dari kolom 'S-Item'
    const ownedSItemRes = calculateTotalResources('owned', 'sitem');
    // Total Owned Fodder (sebagai Epic +0 Fodder) dari kolom 'Fodder'
    const ownedFodderRes = calculateTotalResources('owned', 'fodder');

    const totalOwnedSItem = ownedSItemRes.totalSItem;
    // Total Fodder adalah akumulasi dari S-Item (hasil pemecahan) + Fodder (kolom Fodder)
    const totalOwnedFodder = ownedSItemRes.totalFodder + ownedFodderRes.totalFodder;


    // --- Hitung Total KEBUTUHAN Sumber Daya (Target) ---

    // Kebutuhan adalah target item yang ingin dibuat, jadi kita hitung nilai S-Item yang dibutuhkan
    let totalTargetSItem = 0;
    let totalTargetFodder = 0;

    TIERS.forEach(tier => {
        // ID input Target hanya ada di kolom S-Item
        const inputId = `target_sitem_${tier.replace(/\s/g, '').replace('+', '')}`;
        const quantity = getInputValue(inputId);

        // Kebutuhan S-Item = Item * S-Item Value
        // Kebutuhan Fodder = Item * Fodder Value
        const [sItemValue, fodderValue] = CONVERSION_TABLE[tier];
        totalTargetSItem += quantity * sItemValue;
        totalTargetFodder += quantity * fodderValue;
    });

    // --- Hitung Selisih (Result) ---
    // Result = Kebutuhan (Target) - Kepemilikan (Owned)

    const resultSItem = totalTargetSItem - totalOwnedSItem;
    const resultFodder = totalTargetFodder - totalOwnedFodder;

    // --- Tampilkan Hasil ---
    // Hasil yang negatif berarti item kita lebih dari cukup (kelebihan), positif berarti kekurangan

    const rSItemElement = document.getElementById('r_sitem');
    const rFodderElement = document.getElementById('r_fodder');

    rSItemElement.textContent = resultSItem;
    rFodderElement.textContent = resultFodder;

    // Tambahkan style untuk visualisasi kekurangan/kelebihan (opsional, tapi keren)
    // Kalau kekurangan (positif) kita kasih warna merah, kalau kelebihan/pas (negatif/nol) warna hijau/biru.
    if (resultSItem > 0) {
        rSItemElement.style.color = '#dc3545'; // Merah
    } else {
        rSItemElement.style.color = '#28a745'; // Hijau
    }

    if (resultFodder > 0) {
        rFodderElement.style.color = '#dc3545'; // Merah
    } else {
        rFodderElement.style.color = '#28a745'; // Hijau
    }
}


// 4. Event Listener
document.addEventListener('DOMContentLoaded', () => {
    // Dapatkan semua input type='number' di halaman
    const inputElements = document.querySelectorAll('input[type="number"]');

    // Beri ID yang unik sesuai struktur agar mudah diakses di JS
    // Kita iterasi berdasarkan struktur HTML
    const sections = ['owned', 'target'];
    const itemTypes = ['sitem', 'fodder'];
    
    sections.forEach(section => {
        // Kolom 'Target' hanya punya 'sitem'
        const currentItemTypes = (section === 'target') ? ['sitem'] : itemTypes;

        currentItemTypes.forEach(type => {
            const columnEl = document.querySelector(`.section:nth-child(${sections.indexOf(section) + 1}) .columns .column:nth-child(${type === 'sitem' ? 1 : 2})`);
            
            if (columnEl) {
                TIERS.forEach((tier, index) => {
                    const inputEl = columnEl.querySelector(`.row:nth-child(${index + 2}) input`); // Mulai dari child ke-2 karena ada h3
                    if (inputEl) {
                        // Bersihkan spasi dan simbol '+' untuk ID
                        const tierId = tier.replace(/\s/g, '').replace('+', '');
                        inputEl.id = `${section}_${type}_${tierId}`;
                        
                        // Tambahkan event listener untuk menghitung ulang setiap kali nilai berubah
                        inputEl.addEventListener('input', calculate);
                    }
                });
            }
        });
    });

    // Jalankan perhitungan awal (jika ada nilai default)
    calculate();
});
