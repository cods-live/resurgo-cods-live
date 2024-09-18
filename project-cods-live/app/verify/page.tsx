'use client';

import { useState } from 'react';
import axios from 'axios';

const TOTPPage = () => {
  const [qrCodeURL, setQrCodeURL] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<string>('');

  const generateTOTP = async () => {
    try {
      const response = await axios.get('/api/generate-totp');
      setQrCodeURL(response.data.qrCodeDataURL);
      setSecret(response.data.secret);
    } catch (error) {
      console.error('Error generating TOTP:', error);
    }
  };

  const verifyTOTP = async () => {
    try {
      const response = await axios.post('/api/verify-totp', { token, secret });
      setVerificationResult(response.data.valid ? 'Valid' : 'Invalid');
    } catch (error) {
      console.error('Error verifying TOTP:', error);
      setVerificationResult('Error');
    }
  };

  return (
    <div>
      <h1>TOTP Authentication</h1>
      <button onClick={generateTOTP}>Generate TOTP</button>
      {qrCodeURL && (
        <div>
          <img src={qrCodeURL} alt="TOTP QR Code" />
          <p>Secret: {secret}</p>
        </div>
      )}
      <div>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Enter TOTP token"
        />
        <button onClick={verifyTOTP}>Verify TOTP</button>
        {verificationResult && <p>Verification Result: {verificationResult}</p>}
      </div>
    </div>
  );
};

export default TOTPPage;