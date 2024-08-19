export interface AccessTokenPayload {
  id: string;
  // sub: string; // 用户的唯一标识符，通常是用户 ID
  email: string; // 用户的邮箱，根据实际需求添加
  // iss: string;
  // aud: string[];
  exp: number;
  iat: number;
  // jti: string;
}
