import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from '../../controllers/users/users.controller';
import { PasswordController } from '../../controllers/users/password.controller';
import { AvatarController } from '../../controllers/users/avatar.controller';
import { UserEntity } from './user.entity';
import { EmailService } from "../../utils/email/email.service";
import { AuthUserController } from "../../controllers/users/auth.user.controller";
import { ProductsModule } from "../products/products.module";
import { AuthModule } from '../../auth/auth.module';
import {AuthAdminController} from "../../controllers/users/authAdminController";
import {OtpService} from "../../utils/otp.service";
import {AdminController} from "../../controllers/users/admin.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ProductsModule,
    AuthModule,
  ],
  controllers: [UsersController, PasswordController, AvatarController, AuthUserController, AuthAdminController, AdminController],
  providers: [UsersService, EmailService, OtpService],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
