export interface AuthPayload {
  sub: string;
  username: string;
  email: string;
  role: string;
  typ: 'access' | 'refresh';
}

export interface TokenSubject {
  sub: string;
  username: string;
  email: string;
  role: string;
}

export interface IssuedTokens {
  accessToken: string;
  refreshToken: string;
  refreshMaxAgeMs: number;
}

