import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    await dbConnect();
    try {
        const product = await Product.findById(params.id);
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }
}
