import { collection, getDocs, query, where, orderBy, doc, getDoc, addDoc, updateDoc, deleteDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db, isFirebaseReady } from './firebase';
import { Review, ReviewInput } from '@/types';

export async function getReviews(productId?: string): Promise<Review[]> {
  if (!isFirebaseReady) {
    // Mock data for static export
    const mockReviews: Review[] = [
      // Reviews for mock1 (Test Keyboard) - 3 reviews, all 5 stars, average 5
      {
        id: 'mock-review1',
        productId: 'mock1',
        rating: 5,
        text: 'Great keyboard! Love the RGB lights.',
        author: 'John Doe',
        createdAt: new Date('2025-10-26T10:00:00Z'),
      },
      {
        id: 'mock-review2',
        productId: 'mock1',
        rating: 5,
        text: 'Perfect for gaming, smooth typing.',
        author: 'Jane Smith',
        createdAt: new Date('2025-10-26T11:00:00Z'),
      },
      {
        id: 'mock-review3',
        productId: 'mock1',
        rating: 5,
        text: 'Excellent value with the free mouse.',
        author: 'Bob Johnson',
        createdAt: new Date('2025-10-26T12:00:00Z'),
      },
      // Reviews for mock2 (Keyboard and Mouse) - 4 reviews, 3x5, 1x4, average 4.75 -> 4.8
      {
        id: 'mock-review4',
        productId: 'mock2',
        rating: 5,
        text: 'Wireless freedom, great build quality.',
        author: 'Alice Brown',
        createdAt: new Date('2025-10-26T09:00:00Z'),
      },
      {
        id: 'mock-review5',
        productId: 'mock2',
        rating: 5,
        text: 'RGB is stunning, mouse is responsive.',
        author: 'Charlie Wilson',
        createdAt: new Date('2025-10-26T10:30:00Z'),
      },
      {
        id: 'mock-review6',
        productId: 'mock2',
        rating: 5,
        text: 'Full-size layout is comfortable.',
        author: 'Diana Evans',
        createdAt: new Date('2025-10-26T11:30:00Z'),
      },
      {
        id: 'mock-review7',
        productId: 'mock2',
        rating: 4,
        text: 'Good overall, but battery life could be better.',
        author: 'Eve Taylor',
        createdAt: new Date('2025-10-26T13:00:00Z'),
      },
    ];

    let filteredReviews = mockReviews;

    if (productId) {
      filteredReviews = mockReviews.filter(review => review.productId === productId);
    }

    // Sort by createdAt desc
    filteredReviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return filteredReviews;
  }

  try {
    let reviewsRef = collection(db!, 'reviews');
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
  if (!isFirebaseReady) {
    // Mock data for static export
    const mockReviews: Review[] = [
      {
        id: 'mock-review1',
        productId: 'mock1',
        rating: 5,
        text: 'Great keyboard! Love the RGB lights.',
        author: 'John Doe',
        createdAt: new Date('2025-10-26T10:00:00Z'),
      },
      {
        id: 'mock-review2',
        productId: 'mock1',
        rating: 5,
        text: 'Perfect for gaming, smooth typing.',
        author: 'Jane Smith',
        createdAt: new Date('2025-10-26T11:00:00Z'),
      },
      {
        id: 'mock-review3',
        productId: 'mock1',
        rating: 5,
        text: 'Excellent value with the free mouse.',
        author: 'Bob Johnson',
        createdAt: new Date('2025-10-26T12:00:00Z'),
      },
      {
        id: 'mock-review4',
        productId: 'mock2',
        rating: 5,
        text: 'Wireless freedom, great build quality.',
        author: 'Alice Brown',
        createdAt: new Date('2025-10-26T09:00:00Z'),
      },
      {
        id: 'mock-review5',
        productId: 'mock2',
        rating: 5,
        text: 'RGB is stunning, mouse is responsive.',
        author: 'Charlie Wilson',
        createdAt: new Date('2025-10-26T10:30:00Z'),
      },
      {
        id: 'mock-review6',
        productId: 'mock2',
        rating: 5,
        text: 'Full-size layout is comfortable.',
        author: 'Diana Evans',
        createdAt: new Date('2025-10-26T11:30:00Z'),
      },
      {
        id: 'mock-review7',
        productId: 'mock2',
        rating: 4,
        text: 'Good overall, but battery life could be better.',
        author: 'Eve Taylor',
        createdAt: new Date('2025-10-26T13:00:00Z'),
      },
    ];
    return mockReviews.find(r => r.id === id) || null;
  }

  try {
    const reviewRef = doc(db!, 'reviews', id);
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
  if (!isFirebaseReady) {
    throw new Error('Firebase not available in static export mode');
  }

  try {
    const reviewsRef = collection(db!, 'reviews');
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
  if (!isFirebaseReady) {
    throw new Error('Firebase not available in static export mode');
  }

  try {
    const reviewRef = doc(db!, 'reviews', id);
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
  if (!isFirebaseReady) {
    throw new Error('Firebase not available in static export mode');
  }

  try {
    const reviewRef = doc(db!, 'reviews', id);
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
