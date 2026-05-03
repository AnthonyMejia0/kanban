import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import Link from 'next/link';
import { getSupabaseBrowserClient } from '@/lib/supabase/browser-client';
import { generateUsername } from '@/lib/utils/generateUsername';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Spinner } from './ui/spinner';

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();

  const handleSignup = async (e: React.SubmitEvent) => {
    e.preventDefault();

    setLoading(true);

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      password.length < 8 ||
      password !== confirmPassword
    ) {
      setLoading(false);
      toast.error('Please fill in all fields correctly.');
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (signUpError) {
      console.log('Login error: ', signUpError.message);
      toast.error(signUpError.message);
    } else {
      const user = data.user;
      const username = generateUsername();

      await supabase.auth.updateUser({
        data: {
          first_name: firstName,
          last_name: lastName,
          username,
        },
      });

      await supabase.from('profiles').insert({
        id: user?.id,
        email: user?.email,
        first_name: firstName,
        last_name: lastName,
        username,
      });

      router.push('/');
    }

    setLoading(false);
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="bg-foreground">
        <CardHeader className="text-center">
          <CardTitle className="heading-xl text-primary-text">
            Create your account
          </CardTitle>
          <CardDescription className="heading-sm text-secondary-text">
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <FieldGroup>
              <Field className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel
                    htmlFor="first-name"
                    className="text-primary-text"
                  >
                    First Name
                  </FieldLabel>
                  <Input
                    id="first-name"
                    type="text"
                    required
                    className="text-primary-text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="last-name" className="text-primary-text">
                    Last Name
                  </FieldLabel>
                  <Input
                    id="last-name"
                    type="text"
                    required
                    className="text-primary-text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Field>
              </Field>
              <Field>
                <FieldLabel htmlFor="email" className="text-primary-text">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="text-primary-text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel
                      htmlFor="password"
                      className="text-primary-text"
                    >
                      Password
                    </FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      required
                      className="text-primary-text"
                      placeholder="********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel
                      htmlFor="confirm-password"
                      className="text-primary-text"
                    >
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      required
                      className="text-primary-text"
                      placeholder="********"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </Field>
                </Field>
                <FieldDescription className="text-secondary-text">
                  Must be at least 8 characters.
                </FieldDescription>
              </Field>
              <Field>
                <Button
                  type="submit"
                  className="heading-md bg-button-primary hover:bg-button-primary-hover cursor-pointer"
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner width={16} height={16} />
                  ) : (
                    'Create Account'
                  )}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link href="/login">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
