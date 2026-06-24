import { Inject } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConfig } from "src/config/jwt.config";

export interface JwtPayload {
    sub: string;
    email: string;
}

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        @Inject(jwtConfig.KEY)
        private readonly jwtCfg: ConfigType<typeof jwtConfig>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtCfg.accessSecret,
        });
    }

    validate(payload: JwtPayload): JwtPayload {
        return { sub: payload.sub, email: payload.email }
    }
}