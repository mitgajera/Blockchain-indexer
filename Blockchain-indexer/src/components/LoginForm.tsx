import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        ...(mfaRequired ? { mfaCode } : {}),
      });

      if (!result?.ok) {
        if (result?.error === 'MFA_REQUIRED') {
          setMfaRequired(true);
        } else {
          setError(result?.error || 'Login failed');
        }
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-center text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 text-sm text-white bg-red-500 rounded-md">
            {error}
          </div>
        )}

        {!mfaRequired ? (
          <>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link href="/auth/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </>
        ) : (
          <div>
            <label htmlFor="mfaCode" className="block text-sm font-medium text-gray-700">
              Authentication Code
            </label>
            <input
              id="mfaCode"
              name="mfaCode"
              type="text"
              required
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="6-digit code"
            />
            <p className="mt-2 text-sm text-gray-500">
              Please enter the verification code from your authenticator app.
            </p>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Signing in...' : mfaRequired ? 'Verify' : 'Sign in'}
          </button>
        </div>
      </form>

      <div className="text-sm text-center">
        <span className="text-gray-500">Don't have an account? </span>
        <Link href="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500">
          Register
        </Link>
      </div>
    </div>
  );
}