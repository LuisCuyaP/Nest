import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from '@nestjs/passport';


@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({defaultStrategy: 'jwt'}),
   /*  JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { 
        expiresIn: '2h' 
      }
    }) */
  ],
  exports: [TypeOrmModule]
})
export class AuthModule {}
