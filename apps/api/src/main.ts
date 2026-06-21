import 'dotenv/config';
import { setDefaultResultOrder } from 'node:dns';
import { setDefaultAutoSelectFamily } from 'node:net';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// Opt-in workaround for hosts with no working IPv6 route: Node's Happy Eyeballs
// dual-stack racing (autoSelectFamily) treats the instant IPv6 ENETUNREACH as
// a signal that corrupts the race timing, so an otherwise-healthy IPv4 attempt
// can also report ETIMEDOUT. Not safe to force on environments that rely on
// IPv6 or dual-stack, so this only applies when explicitly enabled.
if (process.env.FORCE_IPV4_FIRST === 'true') {
  setDefaultResultOrder('ipv4first');
  setDefaultAutoSelectFamily(false);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Kavira API')
    .setDescription('Behavioral tracking and analytics API')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`API running on http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/docs`);
}
bootstrap();
