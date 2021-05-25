import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {User, UserCredential, UserRelations} from '../models';
import {UserCredentialRepository} from './user-credential.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly userCredential: HasOneRepositoryFactory<UserCredential, typeof User.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('UserCredentialRepository') protected userCredentialRepositoryGetter: Getter<UserCredentialRepository>,
  ) {
    super(User, dataSource);
    this.userCredential = this.createHasOneRepositoryFactoryFor('userCredential', userCredentialRepositoryGetter);
    this.registerInclusionResolver('userCredential', this.userCredential.inclusionResolver);
  }
  async findCredentials(
    userId: typeof User.prototype.id,
  ): Promise<UserCredential | undefined> {
    try {
      return await this.userCredential(userId).get();
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }
      throw err;
    }
  }
}
