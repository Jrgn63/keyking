import { collection, getDocs, query, where, orderBy, doc, getDoc, addDoc, updateDoc, deleteDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { Review, ReviewInput } from '@/types';

export async function getReviews(productId?: string): Promise<Review[]> {
  try {
    let reviewsRef = collection(db, 'reviews');
    let q = query(reviewsRef, orderBy('createdAt', 'desc'));

    if (productId) {
      q = query(reviewsRef, where('productId', '==', productId), orderBy('createdAt', 'desc'));
    }

    const snapshot = await getDocs(q);

    const reviews: Review[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      reviews.push({
        id: doc.id,
        productId: data.productId,
        rating: data.rating,
        text: data.text,
        author: data.author,
        createdAt: data.createdAt.toDate(),
      });
    });

    return reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

export async function getReview(id: string): Promise<Review | null> {
  try {
    const reviewRef = doc(db, 'reviews', id);
    const snapshot = await getDoc(reviewRef);

    if (snapshot.exists()) {
      const data = snapshot.data();
      return {
        id: snapshot.id,
        productId: data.productId,
        rating: data.rating,
        text: data.text,
        author: data.author,
        createdAt: data.createdAt.toDate(),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching review:', error);
    return null;
  }
}

export async function addReview(reviewData: Omit<Review, 'id' | 'createdAt'> | ReviewInput): Promise<string> {
  try {
    const reviewsRef = collection(db, 'reviews');
    const data: any = { ...reviewData };
    if ('createdAt' in reviewData && reviewData.createdAt) {
      data.createdAt = Timestamp.fromDate(new Date(reviewData.createdAt));
    } else {
      data.createdAt = serverTimestamp();
    }
    const docRef = await addDoc(reviewsRef, data);
    return docRef.id;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
}

export async function updateReview(id: string, reviewData: Partial<Omit<Review, 'id' | 'createdAt'>> | Partial<ReviewInput>): Promise<void> {
  try {
    const reviewRef = doc(db, 'reviews', id);
    const updateData: any = { ...reviewData };
    if ('createdAt' in reviewData && reviewData.createdAt) {
      updateData.createdAt = Timestamp.fromDate(new Date(reviewData.createdAt));
    }
    updateData.updatedAt = serverTimestamp();
    await updateDoc(reviewRef, updateData);
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
}

export async function deleteReview(id: string): Promise<void> {
  try {
    const reviewRef = doc(db, 'reviews', id);
    await deleteDoc(reviewRef);
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
}

export async function getAverageRating(productId: string): Promise<number | null> {
  try {
    const reviews = await getReviews(productId);
    if (reviews.length === 0) return null;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((totalRating / reviews.length) * 10) / 10; // Round to 1 decimal place
  } catch (error) {
    console.error('Error calculating average rating:', error);
    return null;
  }
}
