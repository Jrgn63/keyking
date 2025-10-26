import { NextResponse } from 'next/server';
import { getProducts, addProduct, updateProduct, deleteProduct } from '@/lib/products';

export const dynamic = 'force-dynamic';

const ADMIN_PASSWORD = '10e10e1.5';

async function verifyAdmin(request: Request) {
  const authHeader = request.headers.get('Authorization');
  console.log('Auth header:', authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Auth failed: missing or invalid header');
    return false;
  }
  const token = authHeader.substring(7);
  console.log('Token:', token);
  console.log('Expected password:', ADMIN_PASSWORD);
  const isValid = token === ADMIN_PASSWORD;
  console.log('Is valid:', isValid);
  return isValid;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || undefined;
    const sortBy = (searchParams.get('sortBy') as 'price' | 'name' | 'createdAt') || undefined;
    const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || undefined;

    const products = await getProducts(search, category, tags, sortBy, sortOrder);
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!(await verifyAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const { name, shortDescription, longDescription, price, imageUrls, stock, category, tags, discount } = body;
    if (!name || !shortDescription || !longDescription || !price || !imageUrls || !stock || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const productId = await addProduct({ name, shortDescription, longDescription, price, imageUrls, stock, category, tags: tags || [], discount });
    return NextResponse.json({ id: productId }, { status: 201 });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await verifyAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    console.log('Update request body:', body);
    const { id, name, shortDescription, longDescription, price, imageUrls, stock, category, tags, discount } = body;
    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }
    await updateProduct(id, { name, shortDescription, longDescription, price, imageUrls, stock, category, tags, discount });
    return NextResponse.json({ message: 'Product updated' });
  } catch (error) {
    console.error('Full error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await verifyAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }
    await deleteProduct(id);
    return NextResponse.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
