import { NextResponse } from 'next/server';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export async function GET() {
 
    // Generate a secret for TOTP
    const secret = speakeasy.generateSecret({ name: 'YourAppName' });
    console.log('Secret generated:', secret.base32);

    // Create the OTP Auth URL
    const otpauth = secret.otpauth_url;
    

    // Generate the QR code from the OTP Auth URL
    if (!otpauth) {
        console.error('Invalid OTP Auth URL');
        return NextResponse.json({ error: 'Invalid OTP Auth URL' }, { status: 400 });
    }
    const qrCodeDataURL = await QRCode.toDataURL(otpauth);
    console.log('QR Code generated successfully');

    // Send the response with the secret and QR code
    return NextResponse.json({ secret: secret.base32, qrCodeDataURL });
 
}