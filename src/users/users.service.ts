import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserSignInDto } from './dto/user-signin.dto';
import * as jwt from 'jsonwebtoken';
import { RoleEntity } from './entities/role.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async signup(userSignUp: UserSignUpDto): Promise<User> {
    const userExist = await this.findUserByEmail(userSignUp.email);
    if (userExist) {
      throw new BadRequestException('Email is exist on system');
    }
    userSignUp.password = bcrypt.hashSync(userSignUp.password, 10);
    let user = this.userRepository.create(userSignUp);
    const defaultRole = new RoleEntity();
    defaultRole.id = 1;
    defaultRole.name = 'admin';
    user.roles = [defaultRole];

    user = await this.userRepository.save(user);
    delete user.password;
    return user;
  }
  async signin(userSignInDto: UserSignInDto): Promise<User> {
    const userExist = await this.findUserByEmail(userSignInDto.email);
    if (!userExist) {
      throw new BadRequestException('Email is not exist on system');
    }
    const matchPassword = bcrypt.compareSync(
      userSignInDto.password,
      userExist.password,
    );
    if (!matchPassword) {
      throw new BadRequestException('Password is incorrect');
    }
    delete userExist.password;
    return userExist;
  }
  create(createUserDto: UserSignUpDto) {
    return 'This action adds a new user';
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({ relations: ['roles'] });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: ['roles'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
      relations: ['roles'],
    });
    return user;
  }
  async accessToken(user: User) {
    return jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRETKEY,
      {
        expiresIn: '1d',
      },
    );
  }
}
