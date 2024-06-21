import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import authConfig from './auth.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      inject: [authConfig.KEY],
      useFactory: (
        authCfg: ConfigType<typeof authConfig>,
      ): JwtModuleOptions => {
        const jwtSecret = authCfg.JWT_SECRET;
        const jwtExpiresInHour = authCfg.JWT_EXPIRES_IN_HOUR;

        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: `${jwtExpiresInHour}h`,
          },
        };
      },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
