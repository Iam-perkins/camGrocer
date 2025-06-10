import { NextResponse } from 'next/server';
import { sendApprovalEmail, sendRejectionEmail } from '@/lib/email';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const testEmail = searchParams.get('email');
  
  if (!testEmail) {
    return NextResponse.json(
      { success: false, error: 'Email parameter is required' },
      { status: 400 }
    );
  }
  
  const storeName = 'Test Store';
  
  try {
    console.log('Environment variables:', {
      EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
      EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
      EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
      EMAIL_FROM: process.env.EMAIL_FROM,
      NODE_ENV: process.env.NODE_ENV
    });

    // Test approval email
    console.log('Sending approval email to:', testEmail);
    const approvalResult = await sendApprovalEmail(testEmail, storeName);
    console.log('Approval email result:', approvalResult);
    
    // Test rejection email
    console.log('Sending rejection email to:', testEmail);
    const rejectionResult = await sendRejectionEmail(
      testEmail, 
      storeName, 
      'This is a test rejection reason.'
    );
    console.log('Rejection email result:', rejectionResult);

    return NextResponse.json({
      success: true,
      message: 'Test emails processing completed',
      approvalEmail: approvalResult,
      rejectionEmail: rejectionResult,
      env: {
        EMAIL_SERVER_HOST: !!process.env.EMAIL_SERVER_HOST,
        EMAIL_SERVER_PORT: !!process.env.EMAIL_SERVER_PORT,
        EMAIL_SERVER_USER: !!process.env.EMAIL_SERVER_USER,
        EMAIL_SERVER_PASSWORD: !!process.env.EMAIL_SERVER_PASSWORD,
        EMAIL_FROM: !!process.env.EMAIL_FROM,
      }
    });
  } catch (error) {
    console.error('Error sending test emails:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send test emails',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
