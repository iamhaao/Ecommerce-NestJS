import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const UserCurrent = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.currentUser;
  },
);
