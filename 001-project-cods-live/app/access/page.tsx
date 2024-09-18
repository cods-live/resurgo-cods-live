"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { authenticator } from 'otplib';
import { useQRCode } from 'next-qrcode';

const generateRandomUsername = () => {
  const words = ['alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot', 'golf', 'hotel', 'india', 'juliet'];
  return Array.from({ length: 4 }, () => words[Math.floor(Math.random() * words.length)]).join('-');
};

const OnboardingPage = () => {
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [tokens, setTokens] = useState<string[]>(['', '', '']);
  const [displayTokens, setDisplayTokens] = useState<string[]>(['', '', '']);
  const [verificationStatus, setVerificationStatus] = useState<string[]>(['pending', 'pending', 'pending']);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [username, setUsername] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(0);
  const [usedTokens, setUsedTokens] = useState<Set<string>>(new Set());
  const [nextFieldCountdown, setNextFieldCountdown] = useState<number>(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { Image: ImageQR } = useQRCode();

  useEffect(() => {
    setUsername(generateRandomUsername());
  }, []);

  useEffect(() => {
    if (username) {
      generateTOTP();
    }
  }, [username]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (countdown === 0) {
      inputRefs.current[currentStep]?.focus();
    }
  }, [countdown, currentStep]);

  useEffect(() => {
    if (currentStep < 3 && verificationStatus[currentStep] === 'pending') {
      setTimeout(() => {
        inputRefs.current[currentStep]?.focus();
      }, 0);
    }
  }, [currentStep, verificationStatus]);

  useEffect(() => {
    if (nextFieldCountdown > 0) {
      const timer = setTimeout(() => {
        setNextFieldCountdown(prev => {
          if (prev === 1) {
            // When countdown reaches 0, enable and focus the next field
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            setTimeout(() => {
              inputRefs.current[nextStep]?.focus();
            }, 0);
          }
          return Math.max(0, prev - 1);
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [nextFieldCountdown, currentStep]);

  const generateTOTP = () => {
    const secret = authenticator.generateSecret();
    setSecret(secret);
    const otpauth = authenticator.keyuri(username, 'resurgo social', secret);
    setQrCode(otpauth);
    setCurrentStep(0);
    setTokens(['', '', '']);
    setDisplayTokens(['', '', '']);
    setVerificationStatus(['pending', 'pending', 'pending']);
    setUsedTokens(new Set());
    setCountdown(0);
    inputRefs.current[0]?.focus();
  };

  const verifyTOTP = (index: number) => {
    const token = tokens[index];
    console.log(`Verifying token: ${token} at index: ${index}`);
    if (usedTokens.has(token)) {
      setVerificationStatus(prev => {
        const newStatus = [...prev];
        newStatus[index] = 'Token already used';
        return newStatus;
      });
      return;
    }

    const isValid = authenticator.check(token, secret);
    console.log(`Token is valid: ${isValid}`);
    if (isValid) {
      setUsedTokens(prev => new Set(prev).add(token));
      setVerificationStatus(prev => {
        const newStatus = [...prev];
        newStatus[index] = 'verified';
        return newStatus;
      });
      
      // Start 30-second countdown before enabling the next field
      if (index < 2) {
        setNextFieldCountdown(30);
      } else {
        // All tokens verified
        console.log('All tokens verified');
      }
    } else {
      setVerificationStatus(prev => {
        const newStatus = [...prev];
        newStatus[index] = 'try again in 10 seconds';
        return newStatus;
      });
      setCountdown(10);
      setTimeout(() => {
        setVerificationStatus(prev => {
          const newStatus = [...prev];
          newStatus[index] = 'pending';
          return newStatus;
        });
        setCountdown(0);
        setTokens(prev => {
          const newTokens = [...prev];
          newTokens[index] = '';
          return newTokens;
        });
        setDisplayTokens(prev => {
          const newDisplayTokens = [...prev];
          newDisplayTokens[index] = '';
          return newDisplayTokens;
        });
        // Focus on the current input after resetting
        inputRefs.current[index]?.focus();
      }, 10000);
    }
  };

  const handleTokenChange = (index: number, value: string) => {
    const newTokens = [...tokens];
    const newDisplayTokens = [...displayTokens];

    // Handle backspace
    if (value.length < newTokens[index].length) {
      newTokens[index] = newTokens[index].slice(0, -1);
    } else {
      // Only add the last character if it's a digit
      const lastChar = value.slice(-1);
      if (/^\d$/.test(lastChar) && newTokens[index].length < 6) {
        newTokens[index] += lastChar;
      }
    }

    setTokens(newTokens);

    newDisplayTokens[index] = '•'.repeat(newTokens[index].length);
    setDisplayTokens(newDisplayTokens);

    
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(secret);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <Card className="mt-4 w-full max-w-md flex flex-col items-center">
        <CardHeader>
          <CardTitle>TOTP Onboarding</CardTitle>
        </CardHeader>
        <CardContent className="w-full flex flex-col items-center">
          <p>Username: {username}</p>
          <Button onClick={generateTOTP}>Generate New TOTP Secret</Button>
          {qrCode && (
            <div className="mt-4 flex flex-col items-center">
              <ImageQR
                text={qrCode}
                options={{
                  type: 'image/jpeg',
                  quality: 0.3,
                  errorCorrectionLevel: 'M',
                  margin: 3,
                  scale: 4,
                  width: 200,
                  color: {
                    dark: '#00000000',
                    light: '#FFFFFFFF',
                  },
                }}
              />
              <div className="flex items-center mt-2">
                <p>Secret: {'•'.repeat(secret.length)}</p>
                <Button onClick={copyToClipboard} className="ml-2">Copy</Button>
              </div>
            </div>
          )}
          {tokens.map((token, index) => (
            <div key={index} className="mt-4 w-full flex flex-col items-center">
              <Input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={displayTokens[index]}
                placeholder={`Enter TOTP token ${index + 1}`}
                disabled={currentStep !== index || countdown > 0 || verificationStatus[index] === 'verified'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    verifyTOTP(index);
                  }
                }}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                onChange={(e) => handleTokenChange(index, e.target.value)}
              />
              <Button 
                onClick={() => verifyTOTP(index)} 
                disabled={currentStep !== index || countdown > 0 || tokens[index].length !== 6 || verificationStatus[index] === 'verified'}
              >
                Verify TOTP {index + 1}
              </Button>
              <p>Status: {verificationStatus[index]}</p>
              {currentStep === index && countdown > 0 && <p>Next attempt in: {countdown}s</p>}
              {index < 2 && verificationStatus[index] === 'verified' && nextFieldCountdown > 0 && (
                <p>Please wait {nextFieldCountdown} seconds to continue with next verification</p>
              )}
            </div>
          ))}
          {verificationStatus.every(status => status === 'verified') && <p>Access Granted</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingPage;