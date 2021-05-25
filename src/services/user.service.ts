import {UserService} from "@loopback/authentication";
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {compare} from 'bcryptjs';
import {User, UserWithRelations} from '../models/user.model';
import {UserRepository} from '../repositories';

export type Credentials = {
  username: string
  password: string
}

export class NPUserService implements UserService<User, Credentials> {

  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
  ) { }
  async verifyCredentials(credentials: Credentials): Promise<User> {
    const invalidUserNameError = 'Tên đăng nhập chưa đúng. Vui lòng thử lại.'
    const invalidPasswordError = 'Mật khẩu chưa đúng. Vui lòng thử lại.';

    const foundUser = await this.userRepository.findOne({
      where: {username: credentials.username},
    })

    if (!foundUser) {
      throw new HttpErrors.Unauthorized(JSON.stringify({usernameMessage: invalidUserNameError}))
    }

    const credentialsFound = await this.userRepository.findCredentials(foundUser.id)
    if (!credentialsFound) {
      throw new HttpErrors.Unauthorized(JSON.stringify({usernameMessage: invalidUserNameError}))
    }

    const passwordMatched = await compare(
      credentials.password,
      credentialsFound.password,
    )

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized(JSON.stringify({passwordMessage: invalidPasswordError}))
    }

    return foundUser
  }

  convertToUserProfile(user: User): UserProfile {
    return {
      [securityId]: user.id?.toString(),
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
    }
  }

  //function to find user by id
  async findUserById(id: number): Promise<User & UserWithRelations> {
    const userNotfound = 'invalid User'
    const foundUser = await this.userRepository.findOne({
      where: {id: id},
    })

    if (!foundUser) {
      throw new HttpErrors.Unauthorized(userNotfound)
    }
    return foundUser
  }
}
