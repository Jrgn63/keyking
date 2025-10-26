import { collection, getDocs, query, where, orderBy, doc, getDoc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseReady } from './firebase';
import { Product } from '@/types';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

export async function getProducts(search?: string, category?: string, tags?: string[], sortBy?: 'price' | 'name' | 'createdAt', sortOrder?: 'asc' | 'desc'): Promise<Product[]> {
  if (!isFirebaseReady) {
    // Mock data for static export
    const mockProducts: Product[] = [
      {
        id: 'mock1',
        name: 'Test Keyboard',
        shortDescription: 'Keyboard and mouse',
        longDescription: 'A high quality mechanical keyboard with RGB lights and a FREE mouse!',
        price: 69,
        imageUrls: ['https://s.alicdn.com/@sc04/kf/A2513e8b680bb486e9aeb083068456ddfv.jpg?avif=close&webp=close'],
        stock: 15,
        category: 'gaming',
        tags: ['60%', 'gaming', 'rgb', 'wired', 'mechanical'],
        slug: 'test',
        createdAt: new Date('2025-10-25T19:05:29.102Z'),
        updatedAt: new Date('2025-10-26T13:54:30.134Z'),
        discount: 40,
      },
      {
        id: 'mock2',
        name: 'Keyboard and Mouse',
        shortDescription: 'Keyboard and mouse',
        longDescription: 'A high quality mechanical keyboard with RGB lights and a FREE mouse!',
        price: 199,
        imageUrls: ['https://s.alicdn.com/@sc04/kf/Hfb97332e2adb440281852cd643fd37a3c.jpg?avif=close&webp=close'],
        stock: 15,
        category: 'gaming',
        tags: ['100%', 'gaming', 'rgb', 'mechanical', 'wireless'],
        slug: 'keyboard-and-mouse',
        createdAt: new Date('2025-10-25T18:30:00.185Z'),
        updatedAt: new Date('2025-10-26T13:53:18.167Z'),
        discount: 28,
      },
    ];

    // Apply client-side filters and sorting to mocks
    let filteredProducts = mockProducts;

    if (search) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
        product.longDescription.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (tags && tags.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        tags.some(tag => product.tags.includes(tag))
      );
    }

    // Sort products
    filteredProducts.sort((a, b) => {
      // If tags are selected, prioritize by tag relevance (number of matching tags)
      if (tags && tags.length > 0) {
        const aMatches = a.tags.filter(tag => tags.includes(tag)).length;
        const bMatches = b.tags.filter(tag => tags.includes(tag)).length;
        if (aMatches !== bMatches) {
          return bMatches - aMatches; // More matches first
        }
      }

      // Secondary sort by the specified field
      const sortField = sortBy || 'createdAt';
      const sortDir = sortOrder === 'asc' ? 1 : -1;

      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'name') {
        return sortDir * aVal.localeCompare(bVal);
      } else if (sortField === 'price') {
        return sortDir * (aVal - bVal);
      } else { // createdAt
        return sortDir * (aVal.getTime() - bVal.getTime());
      }
    });

    return filteredProducts;
  }

  try {
    let productsRef = collection(db!, 'products');
    let q = query(productsRef, orderBy(sortBy || 'createdAt', sortOrder === 'asc' ? 'asc' : 'desc'));

    if (category) {
      q = query(productsRef, where('category', '==', category), orderBy(sortBy || 'createdAt', sortOrder === 'asc' ? 'asc' : 'desc'));
    }

    const snapshot = await getDocs(q);

    const products: Product[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      products.push({
        id: doc.id,
        name: data.name,
        shortDescription: data.shortDescription || data.description || '',
        longDescription: data.longDescription || data.description || '',
        price: data.price,
        imageUrls: data.imageUrls || [data.imageUrl], // Backward compatibility
        stock: data.stock,
        category: data.category,
        tags: data.tags || [],
        slug: data.slug,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        discount: data.discount,
      });
    });

    // Client-side filters
    let filteredProducts = products;

    if (search) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
        product.longDescription.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (tags && tags.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        tags.some(tag => product.tags.includes(tag))
      );
    }

    // Sort products
    filteredProducts.sort((a, b) => {
      // If tags are selected, prioritize by tag relevance (number of matching tags)
      if (tags && tags.length > 0) {
        const aMatches = a.tags.filter(tag => tags.includes(tag)).length;
        const bMatches = b.tags.filter(tag => tags.includes(tag)).length;
        if (aMatches !== bMatches) {
          return bMatches - aMatches; // More matches first
        }
      }

      // Secondary sort by the specified field
      const sortField = sortBy || 'createdAt';
      const sortDir = sortOrder === 'asc' ? 1 : -1;

      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'name') {
        return sortDir * aVal.localeCompare(bVal);
      } else if (sortField === 'price') {
        return sortDir * (aVal - bVal);
      } else { // createdAt
        return sortDir * (aVal.getTime() - bVal.getTime());
      }
    });

    return filteredProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  if (!isFirebaseReady) {
    // Return mock if matches
    const mockProducts = [
      {
        id: 'mock1',
        name: 'Test Keyboard',
        shortDescription: 'Keyboard and mouse',
        longDescription: 'A high quality mechanical keyboard with RGB lights and a FREE mouse!',
        price: 69,
        imageUrls: ['https://s.alicdn.com/@sc04/kf/A2513e8b680bb486e9aeb083068456ddfv.jpg?avif=close&webp=close'],
        stock: 15,
        category: 'gaming',
        tags: ['60%', 'gaming', 'rgb', 'wired', 'mechanical'],
        slug: 'test',
        createdAt: new Date('2025-10-25T19:05:29.102Z'),
        updatedAt: new Date('2025-10-26T13:54:30.134Z'),
        discount: 40,
      },
      {
        id: 'mock2',
        name: 'Keyboard and Mouse',
        shortDescription: 'Keyboard and mouse',
        longDescription: 'A high quality mechanical keyboard with RGB lights and a FREE mouse!',
        price: 199,
        imageUrls: ['https://s.alicdn.com/@sc04/kf/Hfb97332e2adb440281852cd643fd37a3c.jpg?avif=close&webp=close'],
        stock: 15,
        category: 'gaming',
        tags: ['100%', 'gaming', 'rgb', 'mechanical', 'wireless'],
        slug: 'keyboard-and-mouse',
        createdAt: new Date('2025-10-25T18:30:00.185Z'),
        updatedAt: new Date('2025-10-26T13:53:18.167Z'),
        discount: 28,
      },
    ];
    return mockProducts.find(p => p.id === id) || null;
  }

  try {
    const productRef = doc(db!, 'products', id);
    const snapshot = await getDoc(productRef);

    if (snapshot.exists()) {
      const data = snapshot.data();
      return {
        id: snapshot.id,
        name: data.name,
        shortDescription: data.shortDescription || data.description || '',
        longDescription: data.longDescription || data.description || '',
        price: data.price,
        imageUrls: data.imageUrls || [data.imageUrl], // Backward compatibility
        stock: data.stock,
        category: data.category,
        tags: data.tags || [],
        slug: data.slug,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        discount: data.discount,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isFirebaseReady) {
    // Return mock if matches
    const mockProducts = [
      {
        id: 'mock1',
        name: 'Test Keyboard',
        shortDescription: 'Keyboard and mouse',
        longDescription: 'A high quality mechanical keyboard with RGB lights and a FREE mouse!',
        price: 69,
        imageUrls: ['https://s.alicdn.com/@sc04/kf/A2513e8b680bb486e9aeb083068456ddfv.jpg?avif=close&webp=close'],
        stock: 15,
        category: 'gaming',
        tags: ['60%', 'gaming', 'rgb', 'wired', 'mechanical'],
        slug: 'test',
        createdAt: new Date('2025-10-25T19:05:29.102Z'),
        updatedAt: new Date('2025-10-26T13:54:30.134Z'),
        discount: 40,
      },
      {
        id: 'mock2',
        name: 'Keyboard and Mouse',
        shortDescription: 'Keyboard and mouse',
        longDescription: 'A high quality mechanical keyboard with RGB lights and a FREE mouse!',
        price: 199,
        imageUrls: ['https://s.alicdn.com/@sc04/kf/Hfb97332e2adb440281852cd643fd37a3c.jpg?avif=close&webp=close'],
        stock: 15,
        category: 'gaming',
        tags: ['100%', 'gaming', 'rgb', 'mechanical', 'wireless'],
        slug: 'keyboard-and-mouse',
        createdAt: new Date('2025-10-25T18:30:00.185Z'),
        updatedAt: new Date('2025-10-26T13:53:18.167Z'),
        discount: 28,
      },
    ];
    return mockProducts.find(p => p.slug === slug) || null;
  }

  try {
    const productsRef = collection(db!, 'products');
    const q = query(productsRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        shortDescription: data.shortDescription || data.description || '',
        longDescription: data.longDescription || data.description || '',
        price: data.price,
        imageUrls: data.imageUrls || [data.imageUrl], // Backward compatibility
        stock: data.stock,
        category: data.category,
        tags: data.tags || [],
        slug: data.slug,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        discount: data.discount,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

export async function addProduct(productData: Omit<Product, 'id' | 'slug' | 'createdAt' | 'updatedAt'>): Promise<string> {
  if (!isFirebaseReady) {
    throw new Error('Firebase not available in static export mode');
  }

  try {
    const productsRef = collection(db!, 'products');
    const docRef = await addDoc(productsRef, {
      ...productData,
      slug: slugify(productData.name),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
}

export async function updateProduct(id: string, productData: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
  if (!isFirebaseReady) {
    throw new Error('Firebase not available in static export mode');
  }

  try {
    const productRef = doc(db!, 'products', id);
    const updateData: any = {
      ...productData,
      updatedAt: serverTimestamp(),
    };
    if (productData.name) {
      updateData.slug = slugify(productData.name);
    }
    await updateDoc(productRef, updateData);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  if (!isFirebaseReady) {
    throw new Error('Firebase not available in static export mode');
  }

  try {
    const productRef = doc(db!, 'products', id);
    await deleteDoc(productRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}
