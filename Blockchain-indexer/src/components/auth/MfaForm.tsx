import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import QRCode from 'qrcode.react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

interface MfaFormProps {
  userId: string;
  secret?: string;
  onComplete?: () => void;
}

export default function MfaForm({ userId, secret, onComplete }: MfaFormProps) {
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(secret ? 'verify' : 'setup');
  const [otpSecret, setOtpSecret] = useState(secret || '');

  // Setup MFA (get secret and QR code)
  const setupMfa = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/user/setup-mfa', {
        userId,
      });

      setOtpSecret(response.data.secret);
      setStep('verify');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  // Verify MFA code
  const verifyMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post('/api/user/verify-mfa', {
        userId,
        token: verificationCode,
        secret: otpSecret,
      });

      if (onComplete) {
        onComplete();
      } else {
        router.push('/settings/security?mfaEnabled=true');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Two-Factor Authentication">
      {step === 'setup' ? (
        <div className="space-y-4">
          <p className="text-gray-700">
            Two-factor authentication adds an extra layer of security to your account by requiring both a password and a verification code from your mobile device.
          </p>
          
          <Button
            onClick={setupMfa}
            isLoading={loading}
          >
            {loading ? 'Setting up...' : 'Set up Two-Factor Authentication'}
          </Button>
          
          {error && (
            <div className="p-3 text-sm text-white bg-red-500 rounded-md">
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Scan QR Code</h3>
            <p className="mt-1 text-sm text-gray-500">
              Scan this QR code with your authenticator app (like Google Authenticator, Authy, or 1Password).
            </p>
            <div className="mt-4 flex justify-center">
              <QRCode
                value={`otpauth://totp/BlockchainIndexer:${userId}?secret=${otpSecret}&issuer=BlockchainIndexer`}
                size={200}
                level="H"
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">Manual Entry</h3>
            <p className="mt-1 text-sm text-gray-500">
              If you can't scan the QR code, enter this code manually in your app:
            </p>
            <div className="mt-2 p-2 bg-gray-100 rounded-md font-mono text-center">
              {otpSecret}
            </div>
          </div>
          
          <form onSubmit={verifyMfa} className="space-y-4">
            <Input
              id="verificationCode"
              name="verificationCode"
              type="text"
              label="Verification Code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              fullWidth
              required
              error={error || undefined}
            />
            
            <Button
              type="submit"
              isLoading={loading}
              fullWidth
            >
              {loading ? 'Verifying...' : 'Verify and Enable'}
            </Button>
          </form>
        </div>
      )}
    </Card>
  );
}