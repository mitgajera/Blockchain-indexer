import { hash, compare } from 'bcryptjs';
import { randomBytes } from 'crypto';
import { prisma } from './prisma';
import speakeasy from 'speakeasy';

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 16);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword);
}

export function generateVerificationToken(): string {
  return randomBytes(32).toString('hex');
}

export function generateResetToken(): string {
  return randomBytes(32).toString('hex');
}

export async function createUser(email: string, password: string, name?: string) {
  const hashedPassword = await hashPassword(password);
  const verificationToken = generateVerificationToken();
  
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verified: false,
    },
  });
}

export function generateMfaSecret() {
  return speakeasy.generateSecret({ length: 20 });
}

export function verifyMfaToken(secret: string, token: string) {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
  });
}