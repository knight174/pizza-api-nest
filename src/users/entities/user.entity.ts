import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../drizzle/db/schema';

export class UserEntity {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 'e0169a2c-1509-4050-9195-1fa30062ff97',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  email: string;

  // 密码通常不应该在 API 响应中返回。
  // 如果 UserEntity 用于 API 响应，请考虑移除此字段或使用 class-transformer 的 @Exclude()
  // 此处保留，但需注意不要直接返回给客户端，除非特定场景（如内部使用）。
  // @ApiProperty({
  //   description: '用户账户的密码 (通常不应暴露)',
  //   // example: '********',
  // })
  // password?: string; // 改为可选，或在转换时移除

  @ApiProperty({
    description: 'Name of the user',
    example: '即刻披萨Bot',
  })
  name: string;

  @ApiProperty({
    description: 'Address of the user',
    example: '东胜神洲/傲来国/花果山福地/水帘洞',
  })
  address: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '7758258',
  })
  phone: string;

  @ApiProperty({
    description: 'Timestamp of user creation',
    type: Date,
  })
  created_at: Date;

  @ApiProperty({
    description: 'Timestamp of the last update',
    type: Date,
  })
  updated_at: Date;
}

// 辅助函数：将 Drizzle User 类型映射到 UserEntity
// 这在你需要将数据库查询结果转换为 API 响应格式时非常有用
export function mapDrizzleUserToUserEntity(drizzleUser: User): UserEntity {
  const { password, ...restOfUser } = drizzleUser; // 默认从 UserEntity 中移除密码
  return {
    ...restOfUser,
    // 如果 Drizzle 返回的是字符串日期，确保转换为 Date 对象
    // created_at: new Date(drizzleUser.created_at),
    // updated_at: new Date(drizzleUser.updated_at),
  };
}

export function mapDrizzleUserArrayToUserEntityArray(
  drizzleUsers: User[],
): UserEntity[] {
  return drizzleUsers.map(mapDrizzleUserToUserEntity);
}
