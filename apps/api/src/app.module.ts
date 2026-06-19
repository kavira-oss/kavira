import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { SessionsModule } from './sessions/sessions.module';
import { BehaviorsModule } from './behaviors/behaviors.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    SessionsModule,
    BehaviorsModule,
    EventsModule,
  ],
})
export class AppModule {}
