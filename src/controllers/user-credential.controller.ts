import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {UserCredential} from '../models';
import {UserCredentialRepository} from '../repositories';

export class UserCredentialController {
  constructor(
    @repository(UserCredentialRepository)
    public userCredentialRepository : UserCredentialRepository,
  ) {}

  @post('/user-credentials')
  @response(200, {
    description: 'UserCredential model instance',
    content: {'application/json': {schema: getModelSchemaRef(UserCredential)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCredential, {
            title: 'NewUserCredential',
            exclude: ['id'],
          }),
        },
      },
    })
    userCredential: Omit<UserCredential, 'id'>,
  ): Promise<UserCredential> {
    return this.userCredentialRepository.create(userCredential);
  }

  @get('/user-credentials/count')
  @response(200, {
    description: 'UserCredential model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(UserCredential) where?: Where<UserCredential>,
  ): Promise<Count> {
    return this.userCredentialRepository.count(where);
  }

  @get('/user-credentials')
  @response(200, {
    description: 'Array of UserCredential model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UserCredential, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(UserCredential) filter?: Filter<UserCredential>,
  ): Promise<UserCredential[]> {
    return this.userCredentialRepository.find(filter);
  }

  @patch('/user-credentials')
  @response(200, {
    description: 'UserCredential PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCredential, {partial: true}),
        },
      },
    })
    userCredential: UserCredential,
    @param.where(UserCredential) where?: Where<UserCredential>,
  ): Promise<Count> {
    return this.userCredentialRepository.updateAll(userCredential, where);
  }

  @get('/user-credentials/{id}')
  @response(200, {
    description: 'UserCredential model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UserCredential, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(UserCredential, {exclude: 'where'}) filter?: FilterExcludingWhere<UserCredential>
  ): Promise<UserCredential> {
    return this.userCredentialRepository.findById(id, filter);
  }

  @patch('/user-credentials/{id}')
  @response(204, {
    description: 'UserCredential PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCredential, {partial: true}),
        },
      },
    })
    userCredential: UserCredential,
  ): Promise<void> {
    await this.userCredentialRepository.updateById(id, userCredential);
  }

  @put('/user-credentials/{id}')
  @response(204, {
    description: 'UserCredential PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() userCredential: UserCredential,
  ): Promise<void> {
    await this.userCredentialRepository.replaceById(id, userCredential);
  }

  @del('/user-credentials/{id}')
  @response(204, {
    description: 'UserCredential DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userCredentialRepository.deleteById(id);
  }
}
