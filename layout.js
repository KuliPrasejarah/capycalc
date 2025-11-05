fetch('header.html')
  .then(res => res.text())
  .then(data => {
      document.getElementById('header').innerHTML = data;

      // update judul otomatis tanpa class
      const siteTitle = document.querySelector('#header h1');
      if (siteTitle) {
          siteTitle.textContent = document.title; // ambil dari <title> <head>
      }
  })
  .catch(() => console.error('Header failed to load'));

fetch('footer.html')
  .then(res => res.text())
  .then(data => document.getElementById('footer').innerHTML = data)
  .catch(() => console.error('Footer failed to load'));

fetch('credits.html')
  .then(res => res.text())
  .then(data => document.getElementById('credits').innerHTML = data)
  .catch(() => console.error('Credits failed to load'));
