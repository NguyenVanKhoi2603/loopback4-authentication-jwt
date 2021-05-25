import {belongsTo, Entity, model, property} from '@loopback/repository';
import {User} from './user.model';

@model()
export class UserCredential extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  password: string;

  @belongsTo(() => User)
  userId: number;

  constructor(data?: Partial<UserCredential>) {
    super(data);
  }
}

export interface UserCredentialRelations {
  // describe navigational properties here
}

export type UserCredentialWithRelations = UserCredential & UserCredentialRelations;
