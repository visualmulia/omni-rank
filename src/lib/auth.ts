import crypto from 'crypto';
import { cookies } from 'next/headers';

const SESSION_SECRET = process.env.SESSION_SECRET || 'omnirank-super-secret-key-that-is-at-least-32-chars';

export function encryptSession(data: any): string {
  const iv = crypto.randomBytes(12);
  const key = Buffer.alloc(32);
  Buffer.from(SESSION_SECRET, 'utf8').copy(key);
  
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}.${encrypted}.${tag.toString('hex')}`;
}

export function decryptSession(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const tag = Buffer.from(parts[2], 'hex');
    
    const key = Buffer.alloc(32);
    Buffer.from(SESSION_SECRET, 'utf8').copy(key);
    
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  } catch (err) {
    console.error('[Session Decryption Failed]', err);
    return null;
  }
}

export async function getSession(): Promise<{ email: string; userId: string } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('omnirank_session')?.value;
    if (!token) return null;
    return decryptSession(token);
  } catch (err) {
    console.error('Error getting session:', err);
    return null;
  }
}
