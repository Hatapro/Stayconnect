import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function clearCollection(name) {
  try {
    const all = await pb.collection(name).getFullList(200);

    for (const r of all)
      await pb.collection(name).delete(r.id);
    console.log(`🧹 ${name} limpiada.`);

  } catch (err) {
    console.warn(`No se pudo limpiar ${name}:`, err?.message || err);
  }
}

async function seed() {
  await pb.admins.authWithPassword('superuser@gmail.com','superuser.');

  await clearCollection('simpleList');

  const items = [
    { name: 'Balón de fútbol', attribute: 'Talla 5, Nylon', price: 29.99 },
    { name: 'Zapatillas de running', attribute: 'Talla 42, Hombre', price: 79.95 },
    { name: 'Raqueta de pádel', attribute: 'Carbono, 360g', price: 120.0 },
    { name: 'Mancuernas (par)', attribute: '5 kg cada una', price: 39.5 },
    { name: 'Esterilla yoga', attribute: '6mm, antideslizante', price: 24.0 },
    { name: 'Casco ciclismo', attribute: 'Talla M, ventilado', price: 59.9 },
    { name: 'Reloj deportivo', attribute: 'GPS, resistente al agua', price: 199.0 },
    { name: 'Camiseta fútbol', attribute: 'Talla L, poliéster', price: 34.5 },
    { name: 'Balón baloncesto', attribute: 'Indoor', price: 25.0 },
    { name: 'Bandas elásticas', attribute: 'Set 3 resistencias', price: 14.99 }
  ];

  for (const it of items) {
    try {
      await pb.collection('simpleList').create(it);

    } catch (err) {
      console.error('Failed to create record', it.name, err?.message || err);
    }
  }
  console.log('Seeder finished');
}

seed().catch(e => { console.error('Seeder error', e); process.exit(1); });