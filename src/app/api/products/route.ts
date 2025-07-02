import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const { title, description, drawing } = await request.json();

    if (!title || !description || !drawing) {
      return NextResponse.json(
        { error: 'Title, description, and drawing are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('company');
    const collection = db.collection('products');

    const product = {
      title,
      description,
      drawing, // This will be the canvas data URL
      approved: false,
      contractAddress: '', // Empty for new products, filled when approved
      createdAt: new Date(),
    };

    const result = await collection.insertOne(product);

    return NextResponse.json({
      success: true,
      productId: result.insertedId,
    });
  } catch (error) {
    console.error('Error saving product:', error);
    return NextResponse.json(
      { error: 'Failed to save product' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('company');
    const collection = db.collection('products');

    const products = await collection.find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
