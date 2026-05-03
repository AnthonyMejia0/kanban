'use client';

import { SignupForm } from '@/components/signup-form';
import DarkLogo from '@/assets/logo-dark.svg';
import LightLogo from '@/assets/logo-light.svg';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function SignupPage() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          {theme === 'dark' ? <LightLogo /> : <DarkLogo />}
        </a>
        <SignupForm />
      </div>
    </div>
  );
}
