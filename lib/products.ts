import { collection, getDocs, query, where, orderBy, doc, getDoc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
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
  try {
    let productsRef = collection(db, 'products');
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

    return filteredProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const productRef = doc(db, 'products', id);
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
  try {
    const productsRef = collection(db, 'products');
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
  try {
    const productsRef = collection(db, 'products');
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
  try {
    const productRef = doc(db, 'products', id);
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
  try {
    const productRef = doc(db, 'products', id);
    await deleteDoc(productRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}
