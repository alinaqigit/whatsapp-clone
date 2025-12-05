import { User } from "generated/prisma/client";
import { Exclude } from "class-transformer";

export class UserEntity {
  name: User['name'];

  id: User['id'];
  email: User['email'];

  @Exclude()
  password: User['password'];
  @Exclude()
  createdAt: User['createdAt'];
  @Exclude()
  updatedAt: User['updatedAt'];

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}