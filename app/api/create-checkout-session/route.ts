import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { items, customerEmail } = await request.json();

    const lineItems = items.map((item: any) => {
      const discountedPrice = item.product.discount && item.product.discount > 0
        ? item.product.price * (1 - item.product.discount / 100)
        : item.product.price;
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
            description: item.product.description,
            images: [item.product.imageUrls[0]],
          },
          unit_amount: Math.round(discountedPrice * 100), // Stripe expects amount in cents
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
      customer_email: customerEmail,
      metadata: {
        customerEmail,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
