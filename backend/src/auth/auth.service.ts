import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.usersService.create(email, hashed);
    return { id: user.id, email: user.email };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findOne(email);
    if (!user) throw new UnauthorizedException();
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException();
    const payload = { sub: user.id, email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }
}
