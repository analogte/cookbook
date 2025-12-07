import { SignJWT, jwtVerify } from "jose";

// Secret key for signing (in production, use a strong random key from env)
const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "gastronomique-secret-key-change-in-production"
);

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";

export interface TokenPayload {
    username: string;
    exp?: number;
}

/**
 * Generate a signed JWT token
 */
export async function generateToken(username: string): Promise<string> {
    const token = await new SignJWT({ username })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(JWT_SECRET);

    return token;
}

/**
 * Verify and decode a JWT token
 * Returns the payload if valid, null if invalid
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);

        // Check if username matches admin
        if (payload.username !== ADMIN_USERNAME) {
            return null;
        }

        return {
            username: payload.username as string,
            exp: payload.exp,
        };
    } catch {
        return null;
    }
}

/**
 * Check if a token is valid and not expired
 */
export async function isValidToken(token: string): Promise<boolean> {
    const payload = await verifyToken(token);
    return payload !== null;
}
