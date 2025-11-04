fetch('header.html')
  .then(res => res.text())
  .then(data => document.getElementById('header').innerHTML = data)
  .catch(() => console.error('Header failed to load'));

fetch('footer.html')
  .then(res => res.text())
  .then(data => document.getElementById('footer').innerHTML = data)
  .catch(() => console.error('Footer failed to load'));
