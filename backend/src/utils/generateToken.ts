import jwt from 'jsonwebtoken';

const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET as string;
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  return jwt.sign({ id }, secret, {
    expiresIn: '30d',
  });
};

export default generateToken;
