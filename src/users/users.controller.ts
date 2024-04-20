import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserSignInDto } from './dto/user-signin.dto';
import { Request } from 'express';
import { UserCurrent } from '../utility/decorators/current-user.decorator';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import {
  Public,
  Roles,
} from 'src/utility/decorators/authorize-roles.decorator';
import { Role } from 'src/utility/common/user-role.enum';
import { AuthorizationGuard } from 'src/utility/guards/authorization.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Public()
  @Post('signup')
  async signup(@Body() userSignUpDTO: UserSignUpDto): Promise<User> {
    return await this.usersService.signup(userSignUpDTO);
  }

  @Public()
  @Post('signin')
  async signin(@Body() userSignInDto: UserSignInDto) {
    const user = await this.usersService.signin(userSignInDto);
    const accessToken = await this.usersService.accessToken(user);
    return { accessToken, user };
  }

  @Roles(Role.ADMIN)
  @Get('all')
  async findAll(@Req() req: Request): Promise<User[]> {
    console.log(req.currentUser);
    return await this.usersService.findAll();
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(+id);
  }

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createUserDto: UserSignUpDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
