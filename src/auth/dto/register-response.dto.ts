export class RegisterResponseDTO {
  token: string; // 用 access token 更好。如果注册后立即登录，可能包含访问令牌

  // message: string; // 注册成功的消息
  // user?: UserEntity;
  // statusCode?: number;
}
