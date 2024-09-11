import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/utils/customDecorator/user.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      // context.getClass(),
    ]);
    console.log(IS_PUBLIC_KEY, "hfhhf")
    if (isPublic) {
      console.log("trueddd",isPublic)
      return true;
    }
    return super.canActivate(context);
  }
}

