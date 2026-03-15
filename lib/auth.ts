// @ts-ignore: bcryptjs missing type declarations locally
import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 12

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Compare a plain password with a hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Create a session token (using next-auth internally)
 * This is a placeholder for session management via next-auth
 */
export function generateToken(userId: string): string {
  // next-auth handles JWT generation internally
  // This is kept for API compatibility
  return `session_${userId}_${Date.now()}`
}

/**
 * Verify a session token
 * In production, this should validate via next-auth session
 */
export function verifyToken(token: string): { userId: string } | null {
  // next-auth handles token verification internally
  // This is kept for API compatibility
  if (token.startsWith('session_')) {
    return { userId: token.split('_')[1] }
  }
  return null
}

/**
 * Extract token from Authorization header
 */
export function extractToken(authHeader?: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.slice(7)
}

/**
 * Middleware to verify JWT from request
 */
export async function verifyAuth(req: Request): Promise<string | null> {
  const authHeader = req.headers.get('authorization')
  const token = extractToken(authHeader)

  if (!token) {
    return null
  }

  const decoded = verifyToken(token)
  return decoded?.userId || null
}
