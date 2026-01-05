import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  login(data: LoginDto) {
    const payload = {
      tenant: data.tenant,
      email: data.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
