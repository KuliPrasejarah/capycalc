function calcResource(currentLevel, targetLevel) {
  let resourceNeeded = (targetLevel - currentLevel) * 100;
  return resourceNeeded;
}

function showResult() {
  const current = parseInt(document.getElementById('current').value);
  const target = parseInt(document.getElementById('target').value);

  if (isNaN(current) || isNaN(target) || target <= current) {
    alert('Isi level dengan benar ya 😅');
    return;
  }

  const result = calcResource(current, target);
  document.getElementById('result').innerText = `Total resource yang dibutuhkan: ${result}`;
}
