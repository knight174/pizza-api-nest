import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  status: string;
  message: string;
  data?: T;
}

// 拦截器会在响应数据返回之前执行
@Injectable() // 标记为可注入的服务
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  /**
   * @description 处理数据，移除 deletedAt 字段
   * @param data 需要处理的数据
   * @returns 处理后的数据
   */
  private removeDeletedAt(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.removeDeletedAt(item));
    }

    if (data && typeof data === 'object') {
      const newObj = { ...data };
      delete newObj.deletedAt;

      // 处理嵌套的 pizza 对象
      if (newObj.pizza) {
        delete newObj.pizza.deletedAt;
      }

      return newObj;
    }

    return data;
  }

  /**
   * @description 拦截器的核心方法
   * @param context 执行上下文
   * @param next 下一个处理器
   * @returns 返回一个 Observable 对象
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        status: 'success',
        message: '操作成功',
        data: this.removeDeletedAt(data),
      })),
    );
  }
}
