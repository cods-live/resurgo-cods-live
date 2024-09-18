"use client";
import React, { useEffect, useState } from 'react';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';

const QRCodeTest = () => {
  const [qrCode, setQRCode] = useState<string>('');

  useEffect(() => {
    async function generateQRCode() {
      try {
        const secret = authenticator.generateSecret();
        console.log('Test Secret generated:', secret);

        const otpauth = authenticator.keyuri('User', 'YourAppName', secret);
        console.log('Test OTP Auth URL:', otpauth);

        const qrcodeDataURL = await qrcode.toDataURL(otpauth);
        console.log('Test QR Code generated successfully:', qrcodeDataURL);

        setQRCode(qrcodeDataURL);
      } catch (error) {
        console.error('Test Error generating QR code:', error.message);
        console.error('Test Error stack:', error.stack);
      }
    }

    generateQRCode();
  }, []);

  return (
    <div>
      <h1>QR Code Test</h1>
      {qrCode ? (
        <img src={qrCode} alt="QR Code" />
      ) : (
        <p>Generating QR Code...</p>
      )}
    </div>
  );
};

export default QRCodeTest;