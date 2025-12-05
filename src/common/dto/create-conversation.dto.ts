import { ArrayMinSize, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateConversationDto {
  
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsNotEmpty({ each: true })
  @IsEmail({}, { each: true })
  members: string[];
}
