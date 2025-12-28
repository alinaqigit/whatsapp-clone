import { Conversation } from 'generated/prisma/client';
import { UserEntity } from './user.entity';

export class ConversationEntity {
  id: Conversation['id'];

  name: Conversation['name'];

  lastMessageAt: Conversation['lastMessageAt'];

  ownerId: Conversation['ownerId'];

  participants?: Array<UserEntity>;

  constructor(partial: Partial<ConversationEntity>) {
    Object.assign(this, partial);
    if (partial.participants) {
      this.participants = []
      partial.participants.forEach( participant => {
        this.participants!.push(new UserEntity(participant))
      })
    }
  }
}
