require('dotenv').config({ path: '.env.local' });

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, updateDoc, doc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

async function migrateSlugs() {
  try {
    console.log('Starting slug migration...');

    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);

    const updates = [];
    snapshot.forEach((document) => {
      const data = document.data();
      if (!data.slug) {
        const slug = slugify(data.name);
        updates.push({
          id: document.id,
          slug,
          name: data.name,
        });
      }
    });

    for (const update of updates) {
      const productRef = doc(db, 'products', update.id);
      await updateDoc(productRef, { slug: update.slug });
      console.log(`Updated product: ${update.name} -> slug: ${update.slug}`);
    }

    console.log(`Migration completed! Updated ${updates.length} products.`);
  } catch (error) {
    console.error('Error migrating slugs:', error);
  }
}

migrateSlugs();
