import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      req.currentUser = null;
      next();
      return;
    }
    const token = authHeader.split(' ')[1];
    try {
      const { id } = jwt.verify(token, process.env.JWT_SECRETKEY) as JwtPayload;
      const currentUser = await this.userService.findOne(+id);
      req.currentUser = currentUser;
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

interface JwtPayload {
  id: string;
}
