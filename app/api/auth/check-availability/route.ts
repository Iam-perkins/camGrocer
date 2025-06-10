import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const { email, phone } = await request.json();

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Email or phone number is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Check in all relevant collections
    const [existingUser, existingStoreOwner, existingPending] = await Promise.all([
      email ? db.collection('users').findOne({ email }) : null,
      email ? db.collection('store_owners').findOne({ email }) : null,
      email ? db.collection('pending_store_owners').findOne({ email }) : null,
    ]);

    // Check phone numbers if provided
    const [phoneUser, phoneStoreOwner, phonePending] = phone ? await Promise.all([
      db.collection('users').findOne({ phone }),
      db.collection('store_owners').findOne({ phone }),
      db.collection('pending_store_owners').findOne({ phone }),
    ]) : [null, null, null];

    const existingEmail = existingUser || existingStoreOwner || existingPending;
    const existingPhone = phoneUser || phoneStoreOwner || phonePending;

    return NextResponse.json({
      email: {
        exists: !!existingEmail,
        message: existingEmail ? 'Email already in use' : 'Email available',
      },
      phone: phone ? {
        exists: !!existingPhone,
        message: existingPhone ? 'Phone number already in use' : 'Phone number available',
      } : undefined,
    });

  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
