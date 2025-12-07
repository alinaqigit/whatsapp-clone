import { ArrayMinSize, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AddUserToConversationDTO {
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsEmail({}, { each: true })
  members: string[];
}
