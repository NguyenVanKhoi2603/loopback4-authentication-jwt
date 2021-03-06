import {Entity, hasOne, model, property} from '@loopback/repository';
import {UserCredential} from './user-credential.model';

@model()
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
    required: false,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
  })
  email: string;

  @property({
    type: 'boolean',
    default: true,
  })
  gender: boolean;

  @property({
    type: 'date',
  })
  birthday: string;

  @property({
    type: 'string',
    default: 'CUSTOMER',
  })
  role: string;

  @hasOne(() => UserCredential)
  userCredential: UserCredential;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
