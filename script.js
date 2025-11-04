// === KONVERSI TABEL ===
const CONVERSION_TABLE = {
    'Epic +0': [1, 0],
    'Epic +1': [1, 1],
    'Epic +2': [1, 3],
    'Legend +0': [3, 9],
    'Legend +1': [3, 21],
    'Legend +2': [3, 33],
    'Legend +3': [6, 42],
    'Mythic +0': [18, 126],
    'Mythic +1': [18, 270],
    'Mythic +2': [18, 414],
    'Mythic +3': [18, 558],
    'Mythic +4': [18, 702]
};

// === AMBIL INPUT VALUE ===
function getInputValue(id) {
    const element = document.getElementById(id);
    if (element) {
        return Math.max(0, parseInt(element.value, 10) || 0);
    }
    return 0;
}

// === SETUP INPUT LISTENER ===
function setupInputListeners() {
    const TIERS = Object.keys(CONVERSION_TABLE);

    const ownedSitemInputs = document.querySelectorAll('.section:nth-child(1) .columns .column:nth-child(1) input');
    TIERS.forEach((tier, index) => {
        const tierId = tier.replace(/\s/g, '').replace('+', '');
        ownedSitemInputs[index].id = `owned_sitem_${tierId}`;
        ownedSitemInputs[index].addEventListener('input', calculate);
    });

    const ownedFodderInputs = document.querySelectorAll('.section:nth-child(1) .columns .column:nth-child(2) input');
    TIERS.forEach((tier, index) => {
        const tierId = tier.replace(/\s/g, '').replace('+', '');
        ownedFodderInputs[index].id = `owned_fodder_${tierId}`;
        ownedFodderInputs[index].addEventListener('input', calculate);
    });

    const targetSitemInputs = document.querySelectorAll('.section:nth-child(2) .columns .column:nth-child(1) input');
    TIERS.forEach((tier, index) => {
        const tierId = tier.replace(/\s/g, '').replace('+', '');
        targetSitemInputs[index].id = `target_sitem_${tierId}`;
        targetSitemInputs[index].addEventListener('input', calculate);
    });
}

// === KALKULASI UTAMA ===
function calculate() {
    const ids = [
        'Epic0','Epic1','Epic2','Legend0','Legend1','Legend2','Legend3',
        'Mythic0','Mythic1','Mythic2','Mythic3','Mythic4'
    ];
    const tiers = ['Epic +0','Epic +1','Epic +2','Legend +0','Legend +1','Legend +2','Legend +3',
                   'Mythic +0','Mythic +1','Mythic +2','Mythic +3','Mythic +4'];

    // total semua
    let totalOwnedSItem = 0;
    let fodderFromSItem = 0;
    let fodderFromFodder = 0;
    let totalTargetSItem = 0;
    let totalTargetFodder = 0;

    ids.forEach((id, i) => {
        const tier = tiers[i];
        const [S, F] = CONVERSION_TABLE[tier];

        const qsSitem = getInputValue(`owned_sitem_${id}`);
        const qfFodder = getInputValue(`owned_fodder_${id}`);
        const qtTarget = getInputValue(`target_sitem_${id}`);

        totalOwnedSItem += qsSitem * S;
        fodderFromSItem += qsSitem * F;
        fodderFromFodder += qfFodder * (S + F);
        totalTargetSItem += qtTarget * S;
        totalTargetFodder += qtTarget * F;
    });

    const totalOwnedFodder = fodderFromSItem + fodderFromFodder;

    const rawResultSItem = totalTargetSItem - totalOwnedSItem;
    const rawResultFodder = totalTargetFodder - totalOwnedFodder;

    const sItemFlag = rawResultSItem > 0 ? 'less' : rawResultSItem < 0 ? 'more' : 'equal';
    const fodderFlag = rawResultFodder > 0 ? 'less' : rawResultFodder < 0 ? 'more' : 'equal';

    const resultSItem = Math.abs(rawResultSItem);
    const resultFodder = Math.abs(rawResultFodder);

    const rSItemElement = document.getElementById('r_sitem');
    const rFodderElement = document.getElementById('r_fodder');

    rSItemElement.textContent = resultSItem.toLocaleString();
    rFodderElement.textContent = resultFodder.toLocaleString();

    const redFont = '#9C0006', redFill = '#FFC7CE';
    const greenFont = '#006100', greenFill = '#C6EFCE';
    const neutralFill = '#f5f5f5';

    if (sItemFlag === 'less') {
        rSItemElement.style.color = redFont;
        rSItemElement.style.backgroundColor = redFill;
    } else if (sItemFlag === 'more') {
        rSItemElement.style.color = greenFont;
        rSItemElement.style.backgroundColor = greenFill;
    } else {
        rSItemElement.style.color = 'initial';
        rSItemElement.style.backgroundColor = neutralFill;
    }

    if (fodderFlag === 'less') {
        rFodderElement.style.color = redFont;
        rFodderElement.style.backgroundColor = redFill;
    } else if (fodderFlag === 'more') {
        rFodderElement.style.color = greenFont;
        rFodderElement.style.backgroundColor = greenFill;
    } else {
        rFodderElement.style.color = 'initial';
        rFodderElement.style.backgroundColor = neutralFill;
    }

    rSItemElement.style.fontWeight = 'bolder';
    rFodderElement.style.fontWeight = 'bolder';
}

// === CREDITS MODAL ===
function setupCreditsModal() {
    const modal = document.getElementById("credits-modal");
    const btn = document.querySelector('.home-link[href="#"]');
    const closeBtn = document.querySelector(".close-btn");
    
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      modal.style.display = "flex";
    });
    
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
    
    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
}

// === INIT SEMUANYA ===
document.addEventListener('DOMContentLoaded', () => {
    setupInputListeners();
    calculate();
    setupCreditsModal();
});
