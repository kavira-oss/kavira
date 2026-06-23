import { IsString, MinLength, IsOptional } from 'class-validator';

// userId is intentionally not a body field: accepting it from the client
// is an IDOR vector (any caller could create behaviors for any user).
// TODO(#3): once the auth guard lands, userId comes from req.user.id.
// Until then, BehaviorsController takes it as a route param instead.
export class CreateBehaviorDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}
