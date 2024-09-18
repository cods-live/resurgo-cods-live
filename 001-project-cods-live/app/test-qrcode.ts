const { authenticator } = require('otplib');
const qrcode = require('qrcode');

async function testQRCodeGeneration() {
  try {
    const secret = authenticator.generateSecret();
    console.log('Secret generated:', secret);

    const otpauth = authenticator.keyuri('User', 'YourAppName', secret);
    console.log('OTP Auth URL:', otpauth);

    const qrCodeDataURL = await qrcode.toDataURL(otpauth);
    console.log('QR Code Data URL:', qrCodeDataURL);
  } catch (error) {
    console.error('Error generating QR code in test script:', error);
  }
}

testQRCodeGeneration();