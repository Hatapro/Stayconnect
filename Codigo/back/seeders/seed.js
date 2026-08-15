import PocketBase from 'pocketbase';
import https from 'https';
import http from 'http';
import { URL } from 'url';

const pb = new PocketBase('http://127.0.0.1:8090');

async function clearCollection(name) {
  const all = await pb.collection(name).getFullList(200);
  for (const r of all) {
    await pb.collection(name).delete(r.id);
  }
  console.log(`🧹 ${name} limpiada.`);
}

const imageUrls = {
  'Camisetas': {
    'S': 'https://images.unsplash.com/photo-1618354691438-25bc04584c23?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=715',
    'M': 'https://images.unsplash.com/photo-1618354691438-25bc04584c23?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=715',
    'L': 'https://images.unsplash.com/photo-1618354691438-25bc04584c23?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=715',
    'XL': 'https://images.unsplash.com/photo-1618354691438-25bc04584c23?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=715',
    'XXL': 'https://images.unsplash.com/photo-1618354691438-25bc04584c23?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=715'
  },
  'Pantalones': {
    'S': 'https://images.unsplash.com/photo-1715532098035-a343b26eaeaa?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=627',
    'M': 'https://images.unsplash.com/photo-1715532098035-a343b26eaeaa?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=627',
    'L': 'https://images.unsplash.com/photo-1715532098035-a343b26eaeaa?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=627',
    'XL': 'https://images.unsplash.com/photo-1715532098035-a343b26eaeaa?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=627',
    'XXL': 'https://images.unsplash.com/photo-1715532098035-a343b26eaeaa?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=627'
  },
  'Zapatillas': {
    'S': 'https://images.unsplash.com/photo-1608667508764-33cf0726b13a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=880',
    'M': 'https://images.unsplash.com/photo-1608667508764-33cf0726b13a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=880',
    'L': 'https://images.unsplash.com/photo-1608667508764-33cf0726b13a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=880',
    'XL': 'https://images.unsplash.com/photo-1608667508764-33cf0726b13a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=880',
    'XXL': 'https://images.unsplash.com/photo-1608667508764-33cf0726b13a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=880'
  },
  'Sandalias': {
    'S': 'https://images.unsplash.com/photo-1622920799137-86c891159e44?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=735',
    'M': 'https://images.unsplash.com/photo-1622920799137-86c891159e44?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=735',
    'L': 'https://images.unsplash.com/photo-1622920799137-86c891159e44?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=735',
    'XL': 'https://images.unsplash.com/photo-1622920799137-86c891159e44?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=735',
    'XXL': 'https://images.unsplash.com/photo-1622920799137-86c891159e44?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=735'
  },
  'Mochilas': {
    'Rojo': 'https://images.unsplash.com/photo-1579718080147-0fef34dc9529?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
    'Azul': 'https://images.unsplash.com/photo-1621624959365-071359461b94?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764',
    'Negro': 'https://images.unsplash.com/photo-1667411424771-cadd97150827?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
    'Blanco': 'https://images.unsplash.com/photo-1569697008488-e88ca8a71a39?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=880',
    'Verde': 'https://images.unsplash.com/photo-1583300418584-8332e32b710e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687'
  },
  'Gafas': {
    'Rojo': 'https://plus.unsplash.com/premium_photo-1664475725768-8946b7b6de10?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
    'Azul': 'https://images.unsplash.com/photo-1467044705596-744699fa8931?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171',
    'Negro': 'https://images.unsplash.com/photo-1533060629428-48484ce98a74?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764',
    'Blanco': 'https://images.unsplash.com/photo-1747494749385-c75103afc37d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
    'Verde': 'https://halcontiendasdedeporte.com/19285-large_default/gafas-natacion-jr-atipick-wave.jpg'
  },
  'Auriculares': {
    'Rojo': 'https://ilikephone.es/wp-content/uploads/2019/03/Auricular-con-Cable-y-Manos-Libres-E48P-color-Rojo.jpg',
    'Azul': 'https://cdn2.coolaccesorios.com/57880-large_default/auriculares-35-mm-cool-bear-stereo-con-micro-azul.jpg',
    'Negro': 'https://plus.unsplash.com/premium_photo-1668418188837-d40b734ed6d2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
    'Blanco': 'https://images.unsplash.com/photo-1580236176063-bea7f16aec30?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=672',
    'Verde': 'https://ociodual.com/cdn/shop/products/80219_0-i-0.jpg?v=1704962930'
  },
  'Smartwatches': {
    'Rojo': 'https://joyeriarelojeriacaprichos.com/28602-ultralarge_default/smartwatch-deportivo-smarty-sw011b.jpg',
    'Azul': 'https://stylewatch.vtexassets.com/arquivos/ids/192538/Smartwach_V31_BLUE_COV31B.jpg?v=637560868280100000',
    'Negro': 'https://ismarch.com/wp-content/uploads/2023/05/X6.jpg',
    'Blanco': 'https://www.worten.es/i/cc7b9b2a0bde20050ed5e9102fcabdbbeb39c29e',
    'Verde': 'https://media.falabella.com/falabellaPE/137023794_01/w=1500,h=1500,fit=pad'
  },
  'Pesas': {
    'Rojo': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl1ECvUpl_G55KVn2Ud3_lpz7YvSZv92YWvw&s',
    'Azul': 'https://http2.mlstatic.com/D_NQ_NP_744808-MLA87329764456_072025-O.webp',
    'Negro': 'https://johnsonfitness.tienda/media/catalog/product/cache/e53fc21299476a8c7a5fbd954cf1529d/p/a/pa-60994800-0_base_11.jpg',
    'Blanco': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt5OvGqI04khCfFwXfjzPYLprIBQ6yED7O5w&s',
    'Verde': 'https://img.joomcdn.net/815795dfea18991ca1082532ea894a4ec167fcfb_original.jpeg'
  },
  'Cintas de correr': {
    'Rojo': 'https://media.adeo.com/mkp/c1f5f10ed6cf0c25c5a3c675e2ffe9a0/media.jpeg',
    'Azul': 'https://img.freepik.com/psd-premium/cinta-correr-azul-fondo-transparente_812094-292.jpg',
    'Negro': 'https://images.unsplash.com/photo-1637714409323-d5e6e9731252?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
    'Blanco': 'https://contents.mediadecathlon.com/m17283849/k$792499b2d299a8b9c0d86a35754681eb/picture.jpg',
    'Verde': 'https://teletienda.es/10645-large_default/cinta-de-andar-y-correr-walk-slim.jpg'
  },
  'Bañadores': {
    'S': 'https://bohodot.es/15682-large_default/banador-de-hombre-coast.jpg',
    'M': 'https://bohodot.es/15682-large_default/banador-de-hombre-coast.jpg',
    'L': 'https://bohodot.es/15682-large_default/banador-de-hombre-coast.jpg',
    'XL': 'https://bohodot.es/15682-large_default/banador-de-hombre-coast.jpg',
    'XXL': 'https://bohodot.es/15682-large_default/banador-de-hombre-coast.jpg'
  }
};

const descriptionsBySubcategory = {
  'Camisetas': [
    'Tejido de algodón premium 100% orgánico, suave al tacto y transpirable.',
    'Diseño ergonómico con costuras planas para máximo confort durante todo el día.',
    'Tela de secado rápido ideal para deportes y actividades al aire libre.',
    'Ajuste cómodo y moderno, perfecto para uso casual o deportivo.',
    'Material resistente al desgaste con tecnología anti-olor integrada.'
  ],
  'Pantalones': [
    'Corte moderno con elasticidad en 4 direcciones para libertad de movimiento total.',
    'Tejido resistente a la abrasión con múltiples bolsillos funcionales.',
    'Material transpirable con tratamiento repelente al agua y manchas.',
    'Cintura ajustable con cordón interior para un ajuste personalizado perfecto.',
    'Diseño versátil apto para oficina, viajes y actividades outdoor.'
  ],
  'Zapatillas': [
    'Suela con amortiguación avanzada que reduce el impacto hasta en un 40%.',
    'Upper transpirable con malla técnica de última generación.',
    'Diseño ligero con soporte en el arco y talón para máxima estabilidad.',
    'Tecnología anti-deslizante para tracción superior en cualquier superficie.',
    'Plantilla extraíble con memoria que se adapta a la forma de tu pie.'
  ],
  'Sandalias': [
    'Plantilla anatómica con soporte ergonómico para largas caminatas.',
    'Material impermeable de secado rápido, perfecto para playa y piscina.',
    'Correas ajustables con cierre de velcro para un ajuste seguro.',
    'Suela antideslizante con diseño de surcos para máximo agarre.',
    'Diseño ultraligero que flota en el agua, ideal para deportes acuáticos.'
  ],
  'Mochilas': [
    'Capacidad de 30L con múltiples compartimentos organizadores internos.',
    'Material resistente al agua con costuras selladas térmicamente.',
    'Correas acolchadas ergonómicas con panel trasero ventilado.',
    'Puerto USB integrado para cargar dispositivos sobre la marcha.',
    'Bolsillo anti-robo oculto en la parte trasera con cierre de seguridad.'
  ],
  'Gafas': [
    'Lentes polarizadas con protección UV400 para máxima protección ocular.',
    'Montura flexible TR90 ultra-resistente y ligera como una pluma.',
    'Diseño envolvente que bloquea luz lateral y reduce el deslumbramiento.',
    'Revestimiento anti-rayado y anti-empañamiento de larga duración.',
    'Incluye estuche rígido y paño de microfibra de alta calidad.'
  ],
  'Auriculares': [
    'Cancelación activa de ruido adaptativa con modo de transparencia.',
    'Batería de larga duración: hasta 30 horas de reproducción continua.',
    'Audio Hi-Fi con drivers de 40mm para graves profundos y agudos cristalinos.',
    'Conexión Bluetooth 5.0 con emparejamiento multi-dispositivo.',
    'Almohadillas de espuma viscoelástica ultra-cómodas para uso prolongado.'
  ],
  'Smartwatches': [
    'Monitorización continua de frecuencia cardíaca y niveles de oxígeno en sangre.',
    'Pantalla AMOLED de 1.4" con always-on display y brillo auto-ajustable.',
    'Resistencia al agua 5ATM: natación, ducha y deportes acuáticos.',
    'GPS integrado con más de 100 modos deportivos y análisis detallado.',
    'Batería de hasta 14 días con carga rápida: 2 horas en 15 minutos.'
  ],
  'Pesas': [
    'Recubrimiento de goma premium que protege suelos y reduce ruido.',
    'Agarre ergonómico texturizado anti-deslizante para máxima seguridad.',
    'Diseño compacto hexagonal que evita rodamiento y ahorra espacio.',
    'Material de hierro fundido de alta densidad extremadamente duradero.',
    'Marcado permanente con código de colores para identificación rápida.'
  ],
  'Cintas de correr': [
    'Motor potente de 3HP silencioso con velocidad ajustable de 1-20 km/h.',
    'Superficie de carrera amplia de 130x45cm con amortiguación en 8 zonas.',
    'Pantalla LCD táctil de 7" con programas de entrenamiento pre-cargados.',
    'Conectividad Bluetooth con apps de fitness y seguimiento de progreso.',
    'Sistema de plegado hidráulico con ruedas de transporte integradas.'
  ],
  'Bañadores': [
    'Tejido de secado ultra-rápido con protección UPF 50+ contra rayos UV.',
    'Material resistente al cloro y sal marina que mantiene el color vibrante.',
    'Tecnología anti-transparencia con forro interior completo.',
    'Cintura elástica con cordón ajustable para ajuste seguro sin marcar.',
    'Costuras planas que evitan rozaduras durante entrenamientos intensos.'
  ]
};

async function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    client.get(url, (response) => {
      if (response.statusCode !== 200) {
          reject(new Error(`Failed to download: ${response.statusCode}`));
          return;
      }
      
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });
    }).on('error', reject);
  });
}

async function fetchImageAndCreateBlob(subcategoryName, variant, index) {
  try {
    const subImages = imageUrls[subcategoryName];
    if (!subImages) {
      return null;
    }
    
    const imageUrl = subImages[variant];
    if (!imageUrl) {
      return null;
    }
          
    const buffer = await downloadImage(imageUrl);
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    const fileName = `${subcategoryName.toLowerCase().replace(/\s+/g, '-')}-${variant}.jpg`;
    return new File([blob], fileName, { type: 'image/jpeg' });
    
  } catch (error) {
    return null;
  }
}

async function seed() {
  await pb.admins.authWithPassword('superuser@gmail.com','superuser.');
    
  for (const col of ['orders','variants','products','subcategories','categories','users','reviews']) {
    await clearCollection(col);
  }

  await pb.collection('users').create({
    email:'demo@example.com',
    emailVisibility:true,
    verified:true,
    password:'password',
    passwordConfirm:'password',
    name:'Demo Usuario',
    street:'Calle Demo 1',
    phone:'600123456'
  });

  const catNames = ['Ropa','Calzado','Accesorios','Electrónica','Fitness','Natación'];
  const subMap = {
    Ropa: ['Camisetas','Pantalones'],
    Calzado: ['Zapatillas','Sandalias'],
    Accesorios: ['Mochilas','Gafas'],
    Electrónica: ['Auriculares','Smartwatches'],
    Fitness: ['Pesas','Cintas de correr'],
    Natación: ['Bañadores']
  };

  const categories = [];
  const subcategories = [];

  for (const name of catNames) {
    const c = await pb.collection('categories').create({ name });
    categories.push(c);
    for (const subName of subMap[name] || []) {
      subcategories.push(
        await pb.collection('subcategories').create({
          name: subName,
          category: c.id
        })
      );
    }
  }

  const colorOptions = ['Rojo','Azul','Negro','Blanco','Verde'];
  const sizeOptions = ['S','M','L','XL','XXL'];

  for (let i = 1; i <= 20; i++) {
    const sub = subcategories[Math.floor(Math.random() * subcategories.length)];
    
    const specificDescriptions = descriptionsBySubcategory[sub.name] || [
      'Producto de alta calidad con excelentes acabados.',
      'Diseño moderno y funcional para uso diario.',
      'Material premium resistente y duradero.',
      'Perfecto equilibrio entre estilo y rendimiento.',
      'Tecnología avanzada para máximo confort.'
    ];
    
    const prod = await pb.collection('products').create({
      name: `${sub.name} ${i}`,
      description: specificDescriptions[Math.floor(Math.random() * specificDescriptions.length)],
      category: sub.category,
      subcategory: sub.id
    });

    let variantsList = [];
    if (['Camisetas','Pantalones','Zapatillas','Sandalias','Bañadores'].includes(sub.name)) {
      variantsList = sizeOptions;
    } else {
      variantsList = colorOptions;
    }

    for (const opt of variantsList) {
      const imageFile = await fetchImageAndCreateBlob(sub.name, opt, i);
      
      const formData = new FormData();
      formData.append('product', prod.id);
      formData.append('description', opt);
      formData.append('price', parseFloat((15 + Math.random() * 50).toFixed(2)));
      formData.append('stock', Math.floor(Math.random() * 20) + 1);
      
      if (imageFile) {
          formData.append('image', imageFile);
      } else {
      }

      await pb.collection('variants').create(formData);
    }
  }

  const prods = await pb.collection('products').getFullList();
  const comments = [
      'Excelente calidad, superó mis expectativas',
      'Muy cómodo y perfecto para el día a día',
      'Buena relación calidad-precio, totalmente recomendado',
      'No cumplió con lo esperado, calidad regular',
      'Perfecto, justo lo que buscaba',
      'Material de primera, muy satisfecho con la compra',
      'Un poco caro para lo que ofrece',
      'Increíble diseño y muy funcional'
  ];
    
  for (const prod of prods) {
      const n = Math.floor(Math.random() * 5);
      for (let r = 0; r < n; r++) {
          await pb.collection('reviews').create({
              product: prod.id,
              user: (await pb.collection('users').getFullList())[0].id,
              score: 1 + Math.floor(Math.random() * 5),
              comment: comments[Math.floor(Math.random() * comments.length)]
          });
      }
  }

  console.log('✅ Seed completado.');
}

seed();
