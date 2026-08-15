export function initStayConnectMap(containerId = 'stay-map') {
  if (!document.getElementById(containerId)) return;

  const leafCss = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  const leafJs = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

  if (!document.querySelector(`link[href="${leafCss}"]`)) {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = leafCss;
    document.head.appendChild(l);
  }

  function ensureLeaf(callback) {
    if (window.L) return callback();

    const s = document.createElement('script');
    s.src = leafJs;
    s.onload = callback;
    document.body.appendChild(s);
  }

  ensureLeaf(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (container._leaflet_id) return;

    const map = L.map(containerId).setView([40.4168, -3.7038], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const stores = [
      { name: 'StayConnect Madrid', lat: 40.4203, lon: -3.7058, street: 'C. de Alcalá, 50, 28014 Madrid' },
      { name: 'StayConnect Barcelona', lat: 41.3870, lon: 2.1699, street: 'La Rambla, 120, 08002 Barcelona' },
      { name: 'StayConnect Valencia', lat: 39.4699, lon: -0.3763, street: 'C. de Colón, 45, 46004 Valencia' },
      { name: 'StayConnect Sevilla', lat: 37.3886, lon: -5.9953, street: 'Av. de la Constitución, 10, 41001 Sevilla' },
      { name: 'StayConnect Bilbao', lat: 43.2630, lon: -2.9349, street: 'C. de la Ribera, 3, 48005 Bilbao' },
      { name: 'StayConnect Zaragoza', lat: 41.6488, lon: -0.8891, street: 'Plaza del Pilar, 1, 50003 Zaragoza' },
      { name: 'StayConnect Málaga', lat: 36.7202, lon: -4.4203, street: 'C. Larios, 7, 29015 Málaga' },
      { name: 'StayConnect Alicante', lat: 38.3452, lon: -0.4810, street: 'Av. Maisonnave, 23, 03003 Alicante' },
      { name: 'StayConnect Granada', lat: 37.1773, lon: -3.5986, street: 'C. Realejo, 12, 18010 Granada' },
      { name: 'StayConnect Coruña', lat: 43.3623, lon: -8.4115, street: 'Rúa Real, 5, 15001 A Coruña' }
    ];

    stores.forEach((s, idx) => {
      const marker = L.marker([s.lat, s.lon]).addTo(map);
      marker.bindPopup(`<strong>${s.name}</strong><br/><small>${s.street}</small>`);
      
      if (idx === 0) marker.openPopup();
    });
  });
}
