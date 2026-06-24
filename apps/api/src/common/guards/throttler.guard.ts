import { ThrottlerGuard } from "@nestjs/throttler";
import { Request } from 'express';

export class AppThrottlerGuard extends ThrottlerGuard {
    protected getTracker(req: Request): Promise<string> {
        return Promise.resolve(req.ip ?? req.socket.remoteAddress ?? 'unknown');
    }
}