import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    address: string;
    user: {
      name: string;
      address: string;
      role: string;
    } & DefaultSession;
  }

  interface User extends DefaultUser {
    name: string;
    address: string;
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    name: string;
    address: string;
    role: string;
  }
}
