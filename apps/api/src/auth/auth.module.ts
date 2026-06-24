import { Module } from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { StringValue } from 'ms';
import { jwtConfig } from 'src/config/jwt.config';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            inject: [jwtConfig.KEY],
            useFactory: (jwt: ConfigType<typeof jwtConfig>) => ({
                secret: jwt.accessSecret,
                signOptions: { expiresIn: jwt.accessExpiresIn as StringValue },
            }),
        }),
        UsersModule,
        // EmailModule goes here
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
