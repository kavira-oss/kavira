import { ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { SYS_MSG } from 'src/common/constants/sys-msg';
import { JwtPayload } from './strategies/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { StringValue } from 'ms'
import { jwtConfig } from 'src/config/jwt.config';
import { ConfigType } from '@nestjs/config';

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
    user: UserResponse
}

export type UserResponse = Omit<
    User, 
    | 'passwordHash' 
    | 'verificationToken' 
    | 'verificationTokenExpires' 
    | 'resetPasswordToken' 
    | 'resetPasswordExpires'
    | 'refreshTokenHash'
>

const BCRYPT_ROUNDS = 10;

@Injectable()
export class AuthService {
    constructor(
        @Inject(jwtConfig.KEY)
        private readonly jwtCfg: ConfigType<typeof jwtConfig>,
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ){}

    async register(dto: RegisterDto): Promise<UserResponse> {
        const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

        const user = await this.usersService.create({
            email: dto.email,
            passwordHash,
            name: dto.name,
            username: dto.username
        })

        // this.sendVerificationEmail(user)
        return this.toUserResponse(user);
    }

    async login(dto: LoginDto): Promise<AuthResponse> {
        const user = await this.usersService.findUserByEmail(dto.email);
        if (!user) throw new UnauthorizedException(SYS_MSG.INVALID_CREDENTIALS);
        const valid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!valid) throw new UnauthorizedException(SYS_MSG.INVALID_CREDENTIALS)

        if (!user.isVerified) {
            // await this.sendVerificationEmail(user)
            throw new ForbiddenException(SYS_MSG.EMAIL_NOT_VERIFIED);
        }

        return this.issueTokens(user);
    }

    async refresh(refreshToken: string): Promise<AuthTokens> {
        let payload: JwtPayload;
        try {
            payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
                secret: this.jwtCfg.refreshSecret,
            });
        } catch {
            throw new UnauthorizedException(SYS_MSG.INVALID_REFRESH_TOKEN)
        }

        const user = await this.usersService.findOne(payload.sub);
        if (!user.refreshTokenHash) throw new UnauthorizedException(SYS_MSG.INVALID_REFRESH_TOKEN);

        const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash);
        if (!matches) throw new UnauthorizedException(SYS_MSG.INVALID_REFRESH_TOKEN);

        const tokens = await this.signTokens(user);
        await this.persistRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    async getProfile(userId: string): Promise<void> {
        await this.usersService.findOne(userId);
    }

    async logout(userId: string): Promise<void> {
        return this.usersService.setRefreshTokenHash(userId, null);
    }

    private toUserResponse(user: User): UserResponse {
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    }

    private async issueTokens(user: User): Promise<AuthResponse> {
        const tokens = await this.signTokens(user);
        await this.persistRefreshToken(user.id, tokens.refreshToken);

        return { ...tokens, user: this.toUserResponse(user) }
    }
    
    private async signTokens(user: User): Promise<AuthTokens> {
        const payload: JwtPayload = { sub: user.id, email: user.email };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.jwtCfg.accessSecret,
                expiresIn: this.jwtCfg.accessExpiresIn as StringValue,
            }),
            this.jwtService.signAsync(payload, {
                secret: this.jwtCfg.refreshSecret,
                expiresIn: this.jwtCfg.refreshExpiresIn as StringValue,
            }),
        ]);
        return { accessToken, refreshToken }
    }

    private async persistRefreshToken(
        userId: string,
        refreshToken: string
    ): Promise<void> {
        const hash = await bcrypt.hash(refreshToken, BCRYPT_ROUNDS);
        await this.usersService.setRefreshTokenHash(userId, hash);
    }
}
