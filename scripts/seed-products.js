const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, Timestamp } = require('firebase/firestore');

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

const sampleProducts = [
  {
    name: 'Mechanical Keyboard Pro',
    shortDescription: 'Premium mechanical keyboard with RGB lighting and customizable switches.',
    longDescription: 'Premium mechanical keyboard with RGB lighting and customizable switches. Perfect for gaming and typing. Features Cherry MX switches, full RGB backlighting, and programmable keys for ultimate customization.',
    price: 149.99,
    imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500',
    stock: 25,
    category: 'Gaming',
    slug: 'mechanical-keyboard-pro',
    tags: ['100%', 'gaming', 'rgb', 'mechanical'],
  },
  {
    name: 'Wireless Mechanical Keyboard',
    shortDescription: 'Compact wireless mechanical keyboard with long battery life.',
    longDescription: 'Compact wireless mechanical keyboard with long battery life. Ideal for modern workspaces. Bluetooth connectivity, up to 100 hours of battery life, and a sleek design that fits any setup.',
    price: 199.99,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
    stock: 15,
    category: 'Wireless',
    slug: 'wireless-mechanical-keyboard',
  },
  {
    name: 'Retro Mechanical Keyboard',
    shortDescription: 'Vintage-style mechanical keyboard with clicky switches.',
    longDescription: 'Vintage-style mechanical keyboard with clicky switches. Brings back the classic typing feel. Inspired by the IBM Model M, with modern internals and a retro aesthetic.',
    price: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500',
    stock: 30,
    category: 'Retro',
    slug: 'retro-mechanical-keyboard',
  },
  {
    name: 'RGB Gaming Keyboard',
    shortDescription: 'Full-size gaming keyboard with customizable RGB lighting.',
    longDescription: 'Full-size gaming keyboard with customizable RGB lighting and anti-ghosting keys. Perfect for gamers who want style and performance. Includes dedicated media keys and a detachable USB cable.',
    price: 129.99,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
    stock: 20,
    category: 'Gaming',
    slug: 'rgb-gaming-keyboard',
  },
  {
    name: 'Compact 60% Keyboard',
    shortDescription: 'Space-saving 60% layout keyboard with mechanical switches.',
    longDescription: 'Space-saving 60% layout keyboard with mechanical switches. Perfect for minimalists. Compact design without sacrificing functionality, ideal for portable setups.',
    price: 109.99,
    imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500',
    stock: 18,
    category: 'Compact',
    slug: 'compact-60-keyboard',
  },
  {
    name: 'Ergonomic Mechanical Keyboard',
    shortDescription: 'Split ergonomic keyboard designed for comfort.',
    longDescription: 'Split ergonomic keyboard designed for comfort during long typing sessions. Reduces strain on wrists and shoulders, with tenting and tilting options for optimal positioning.',
    price: 249.99,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
    stock: 10,
    category: 'Ergonomic',
    slug: 'ergonomic-mechanical-keyboard',
  },
];

async function seedProducts() {
  try {
    console.log('Seeding products...');

    for (const product of sampleProducts) {
      await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      console.log(`Added product: ${product.name}`);
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
}

seedProducts();
