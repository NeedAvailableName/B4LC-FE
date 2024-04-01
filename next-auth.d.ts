import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      address: string;
      role: string;
    } & DefaultSession;
  }

  interface User extends DefaultUser {
    address: string;
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    address: string;
    role: string;
  }
}
