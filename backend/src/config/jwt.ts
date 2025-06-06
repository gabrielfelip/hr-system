import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key';
export const JWT_EXPIRES_IN = '1h'; // Tempo de expiração do token