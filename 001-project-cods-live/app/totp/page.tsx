"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from '@/components/ui/navigation-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { authenticator } from 'otplib';
import { useQRCode } from 'next-qrcode';

const TOTPPage = () => {
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<string>('');
  const [generatedToken, setGeneratedToken] = useState<string>('');
  const [renderKey, setRenderKey] = useState<number>(0); // State to force re-render

  const generateTOTP = () => {
    const secret = authenticator.generateSecret();
    setSecret(secret);
    const otpauth = authenticator.keyuri('user@example.com', 'YourAppName', secret);
    setQrCode(otpauth);
    setRenderKey(prevKey => prevKey + 1); // Force re-render
  };

  const verifyTOTP = () => {
    const isValid = authenticator.check(token, secret);
    setVerificationResult(isValid ? 'Valid' : 'Invalid');
  };

  const generateCurrentToken = () => {
    const currentToken = authenticator.generate(secret);
    setGeneratedToken(currentToken);
  };

  const { Image: ImageQR } = useQRCode();

  return (
    <div className="flex flex-col items-center p-4" key={renderKey}>
      <NavigationMenu className="w-full flex justify-center">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="#">Home</NavigationMenuLink>
              <NavigationMenuLink href="#">About</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <Card className="mt-4 w-full max-w-md flex flex-col items-center">
        <CardHeader>
          <CardTitle>TOTP Authentication</CardTitle>
        </CardHeader>
        <CardContent className="w-full flex flex-col items-center">
          <Button onClick={generateTOTP}>Generate TOTP</Button>
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
              <p>Secret: {secret}</p>
              <Button onClick={generateCurrentToken}>Show Current TOTP Token</Button>
              {generatedToken && <p>Current TOTP Token: {generatedToken}</p>}
            </div>
          )}
          <div className="mt-4 w-full flex flex-col items-center">
            <div className="relative w-full">
              <Input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter TOTP token"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    verifyTOTP();
                  }
                }}
              />
              {/* Placeholder for the extension icon */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                {/* Extension icon should be placed here */}
              </div>
            </div>
            <Button onClick={verifyTOTP}>Verify TOTP</Button>
            {verificationResult && <p>Verification Result: {verificationResult}</p>}
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 w-full max-w-md flex flex-col items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>Dialog Description</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Open Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button>Hover me</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tooltip content</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Alert className="mt-4 w-full flex flex-col items-center">
          <AlertTitle>Alert Title</AlertTitle>
          <AlertDescription>Alert Description</AlertDescription>
        </Alert>

        <Avatar className="mt-4">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default TOTPPage;