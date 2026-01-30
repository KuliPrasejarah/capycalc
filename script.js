let ROWS = 8;
let COLS = 8;
let RADIUS = 1;

let grid = [];
let destroyed = new Set();
let mode = "auto";
let stepCounter = 0;
let autoTimer = null;

let baseSpeed = 400;
let speedMultiplier = 2;
let autoSpeed = baseSpeed / speedMultiplier;

document.addEventListener("DOMContentLoaded", () => {
  const gridContainer = document.getElementById("gridContainer");
  const rowsInput = document.getElementById("rowsInput");
  const colsInput = document.getElementById("colsInput");
  const radiusInput = document.getElementById("radiusInput");
  const generateBtn = document.getElementById("generateGridBtn");
  const speedSelect = document.getElementById("speedSelect");

  if (!gridContainer) return;

  function applySettings() {
    ROWS = parseInt(rowsInput.value) || 1;
    COLS = parseInt(colsInput.value) || 1;
    RADIUS = parseInt(radiusInput.value) || 0;
    buildGrid();
  }

  let resetTimer = null;
  function debounceApply() {
    clearTimeout(resetTimer);
    resetTimer = setTimeout(applySettings, 150);
  }

  rowsInput.addEventListener("input", debounceApply);
  colsInput.addEventListener("input", debounceApply);
  radiusInput.addEventListener("input", debounceApply);

  if (speedSelect) {
    speedSelect.addEventListener("change", e => {
      speedMultiplier = parseFloat(e.target.value);
      autoSpeed = baseSpeed / speedMultiplier;
    });
  }

  document.querySelectorAll('input[name="mode"]').forEach(radio => {
    radio.addEventListener("change", e => {
      mode = e.target.value;
      resetGridState();
      if (generateBtn) generateBtn.style.display = mode === "auto" ? "none" : "inline-block";
    });
  });

  if (generateBtn) generateBtn.addEventListener("click", resetGridState);

  function buildGrid() {
    grid = [];
    gridContainer.innerHTML = "";
    gridContainer.style.display = "grid";
    gridContainer.style.gridTemplateColumns = `repeat(${COLS}, 32px)`;
    gridContainer.style.gap = "4px";

    for (let r = 0; r < ROWS; r++) {
      grid[r] = [];
      for (let c = 0; c < COLS; c++) {
        const cell = document.createElement("div");
        Object.assign(cell.style, {
          width: "32px",
          height: "32px",
          border: "1px solid #555",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          background: "#eee",
          transition: "0.15s",
          userSelect: "none",
          fontSize: "13px"
        });
        cell.addEventListener("click", () => handleClick(r, c));
        gridContainer.appendChild(cell);
        grid[r][c] = cell;
      }
    }
    resetGridState();
  }

  function resetGridState() {
    destroyed.clear();
    stepCounter = 0;
    if (autoTimer) clearTimeout(autoTimer);

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = grid[r][c];
        cell.style.background = "#eee";
        cell.style.color = "#000";
        cell.textContent = "";
        cell.style.fontWeight = "normal";
        cell.style.outline = "none";
      }
    }
  }

  function handleClick(r, c) {
    const key = `${r},${c}`;

    if (mode === "simulator") {
      if (destroyed.size > 0 && !destroyed.has(key)) return;
      destroyArea(r, c);
      return;
    }

    resetGridState();
    grid[r][c].style.outline = "3px solid #888";
    autoExpand(r, c);
  }

  function countGain(r, c) {
    let gain = 0;
    for (let i = r - RADIUS; i <= r + RADIUS; i++) {
      for (let j = c - RADIUS; j <= c + RADIUS; j++) {
        if (i >= 0 && i < ROWS && j >= 0 && j < COLS) {
          const key = `${i},${j}`;
          if (!destroyed.has(key)) gain++;
        }
      }
    }
    return gain;
  }

  function destroyArea(r, c) {
    let affected = [];
    let gain = 0;

    for (let i = r - RADIUS; i <= r + RADIUS; i++) {
      for (let j = c - RADIUS; j <= c + RADIUS; j++) {
        if (i >= 0 && i < ROWS && j >= 0 && j < COLS) {
          const key = `${i},${j}`;
          if (!destroyed.has(key)) {
            gain++;
            affected.push([i, j]);
          }
        }
      }
    }

    if (gain <= 1) return false;

    affected.forEach(([i, j]) => {
      const key = `${i},${j}`;
      destroyed.add(key);
      grid[i][j].style.background = getGray(stepCounter);
      grid[i][j].style.color = "#fff";
    });

    stepCounter++;
    const cell = grid[r][c];
    cell.textContent = stepCounter;
    cell.style.fontWeight = "bold";
    cell.style.color = "#222";

    return true;
  }

  function getGray(step) {
    const maxSteps = ROWS * COLS;
    const intensity = Math.min(0.35 + (step / maxSteps) * 0.5, 0.85);
    const gray = Math.floor(255 * (1 - intensity));
    return `rgb(${gray},${gray},${gray})`;
  }

  function dist(a, b, c, d) {
    return Math.hypot(a - c, b - d);
  }

  function getCandidates() {
    if (destroyed.size === 0) {
      let all = [];
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          all.push([r, c]);
        }
      }
      return all;
    }
    return Array.from(destroyed).map(s => s.split(",").map(Number));
  }

  function findBestStep() {
    const centerX = (ROWS - 1) / 2;
    const centerY = (COLS - 1) / 2;

    let best = null;
    let maxGain = -1;
    let bestCenterDist = Infinity;

    for (const [r, c] of getCandidates()) {
      const gain = countGain(r, c);
      if (gain <= 1) continue;

      const dCenter = dist(r, c, centerX, centerY);

      if (gain > maxGain || (gain === maxGain && dCenter < bestCenterDist)) {
        maxGain = gain;
        best = { r, c };
        bestCenterDist = dCenter;
      }
    }

    return best;
  }

  function autoExpand(r, c) {
    if (!destroyArea(r, c)) return;

    function step() {
      const best = findBestStep();
      if (!best) return;
      if (!destroyArea(best.r, best.c)) return;
      autoTimer = setTimeout(step, autoSpeed);
    }

    step();
  }

  buildGrid();
});

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

function getInputValue(id) {
    const element = document.getElementById(id);
    if (element) {
        return Math.max(0, parseInt(element.value, 10) || 0);
    }
    return 0;
}

function setupInputListeners() {
    const TIERS = Object.keys(CONVERSION_TABLE);

    // Owned S-Item
    const ownedSitemInputs = document.querySelectorAll('.owned-items .columns .column:first-of-type input');
    TIERS.forEach((tier, index) => {
        const tierId = tier.replace(/\s/g, '').replace('+', '');
        ownedSitemInputs[index].id = `owned_sitem_${tierId}`;
        ownedSitemInputs[index].addEventListener('input', calculate);
    });

    // Owned Fodder
    const ownedFodderInputs = document.querySelectorAll('.owned-items .columns .column:last-of-type input');
    TIERS.forEach((tier, index) => {
        const tierId = tier.replace(/\s/g, '').replace('+', '');
        ownedFodderInputs[index].id = `owned_fodder_${tierId}`;
        ownedFodderInputs[index].addEventListener('input', calculate);
    });

    // Target S-Item
    const targetSitemInputs = document.querySelectorAll('.target-items input');
    TIERS.forEach((tier, index) => {
        const tierId = tier.replace(/\s/g, '').replace('+', '');
        targetSitemInputs[index].id = `target_sitem_${tierId}`;
        targetSitemInputs[index].addEventListener('input', calculate);
    });
}

function calculate() {
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

    const totalOwnedSItem = 
        (qsOwnedSitemE0 * S_E0) + (qsOwnedSitemE1 * S_E1) + (qsOwnedSitemE2 * S_E2) + 
        (qsOwnedSitemL0 * S_L0) + (qsOwnedSitemL1 * S_L1) + (qsOwnedSitemL2 * S_L2) + 
        (qsOwnedSitemL3 * S_L3) +
        (qsOwnedSitemM0 * S_M0) + (qsOwnedSitemM1 * S_M1) + (qsOwnedSitemM2 * S_M2) + 
        (qsOwnedSitemM3 * S_M3) + (qsOwnedSitemM4 * S_M4);

    const fodderFromSItem = 
        (qsOwnedSitemE0 * F_E0) + (qsOwnedSitemE1 * F_E1) + (qsOwnedSitemE2 * F_E2) + 
        (qsOwnedSitemL0 * F_L0) + (qsOwnedSitemL1 * F_L1) + (qsOwnedSitemL2 * F_L2) + 
        (qsOwnedSitemL3 * F_L3) +
        (qsOwnedSitemM0 * F_M0) + (qsOwnedSitemM1 * F_M1) + (qsOwnedSitemM2 * F_M2) + 
        (qsOwnedSitemM3 * F_M3) + (qsOwnedSitemM4 * F_M4);

    const fodderFromFodder =
        (qfOwnedFodderE0 * (S_E0 + F_E0)) + (qfOwnedFodderE1 * (S_E1 + F_E1)) + (qfOwnedFodderE2 * (S_E2 + F_E2)) +
        (qfOwnedFodderL0 * (S_L0 + F_L0)) + (qfOwnedFodderL1 * (S_L1 + F_L1)) + (qfOwnedFodderL2 * (S_L2 + F_L2)) +
        (qfOwnedFodderL3 * (S_L3 + F_L3)) +
        (qfOwnedFodderM0 * (S_M0 + F_M0)) + (qfOwnedFodderM1 * (S_M1 + F_M1)) + (qfOwnedFodderM2 * (S_M2 + F_M2)) +
        (qfOwnedFodderM3 * (S_M3 + F_M3)) + (qfOwnedFodderM4 * (S_M4 + F_M4));

    const totalOwnedFodder = fodderFromSItem + fodderFromFodder;

    const totalTargetSItem = 
        (qtTargetSitemE0 * S_E0) + (qtTargetSitemE1 * S_E1) + (qtTargetSitemE2 * S_E2) + 
        (qtTargetSitemL0 * S_L0) + (qtTargetSitemL1 * S_L1) + (qtTargetSitemL2 * S_L2) + 
        (qtTargetSitemL3 * S_L3) +
        (qtTargetSitemM0 * S_M0) + (qtTargetSitemM1 * S_M1) + (qtTargetSitemM2 * S_M2) + 
        (qtTargetSitemM3 * S_M3) + (qtTargetSitemM4 * S_M4);

    const totalTargetFodder = 
        (qtTargetSitemE0 * F_E0) + (qtTargetSitemE1 * F_E1) + (qtTargetSitemE2 * F_E2) + 
        (qtTargetSitemL0 * F_L0) + (qtTargetSitemL1 * F_L1) + (qtTargetSitemL2 * F_L2) + 
        (qtTargetSitemL3 * F_L3) +
        (qtTargetSitemM0 * F_M0) + (qtTargetSitemM1 * F_M1) + (qtTargetSitemM2 * F_M2) + 
        (qtTargetSitemM3 * F_M3) + (qtTargetSitemM4 * F_M4);

    const rawResultSItem = totalTargetSItem - totalOwnedSItem;
    const rawResultFodder = totalTargetFodder - totalOwnedFodder;

    const sItemFlag = rawResultSItem > 0 ? 'less' : rawResultSItem < 0 ? 'more' : 'equal';
    const fodderFlag = rawResultFodder > 0 ? 'less' : rawResultFodder < 0 ? 'more' : 'equal';

    const resultSItem = Math.abs(rawResultSItem);
    const resultFodder = Math.abs(rawResultFodder);

    const rSItemElement = document.getElementById('r_sitem');
    const rFodderElement = document.getElementById('r_fodder');

    const rSBoxElement = document.getElementById('r_sbox');
    const rFBoxElement = document.getElementById('r_fbox');

    rSItemElement.textContent = resultSItem.toLocaleString();
    rFodderElement.textContent = resultFodder.toLocaleString();

    const redFont = '#9C0006'; 
    const redFill = '#FFC7CE'; 
    const greenFont = '#006100'; 
    const greenFill = '#C6EFCE'; 
    const neutralFill = '#f5f5f5'; 

    if (sItemFlag === 'less') {
        rSItemElement.style.color = redFont;
        rSItemElement.style.backgroundColor = redFill;
        rSBoxElement.style.backgroundColor = redFill;
    } else if (sItemFlag === 'more') {
        rSItemElement.style.color = greenFont;
        rSItemElement.style.backgroundColor = greenFill;
        rSBoxElement.style.backgroundColor = greenFill;
    } else {
        rSItemElement.style.color = 'initial';
        rSItemElement.style.backgroundColor = neutralFill;
        rSBoxElement.style.backgroundColor = neutralFill;
    }

    if (fodderFlag === 'less') {
        rFodderElement.style.color = redFont;
        rFodderElement.style.backgroundColor = redFill;
        rFBoxElement.style.backgroundColor = redFill;
    } else if (fodderFlag === 'more') {
        rFodderElement.style.color = greenFont;
        rFodderElement.style.backgroundColor = greenFill;
        rFBoxElement.style.backgroundColor = greenFill;
    } else {
        rFodderElement.style.color = 'initial';
        rFodderElement.style.backgroundColor = neutralFill;
        rFBoxElement.style.backgroundColor = neutralFill;
    }

    rSItemElement.style.fontWeight = 'bolder';
    rFodderElement.style.fontWeight = 'bolder';
}

document.addEventListener('DOMContentLoaded', () => {
    setupInputListeners();
    calculate();
});
