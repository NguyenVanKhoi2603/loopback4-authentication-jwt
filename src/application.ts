import {AuthenticationComponent} from '@loopback/authentication';
import {JWTAuthenticationComponent, TokenServiceBindings} from '@loopback/authentication-jwt';
import {AuthorizationComponent} from '@loopback/authorization';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {DbDataSource} from './datasources';
import {MySequence} from './sequence';
import {JWTService} from "./services/jwt.service";
import {UserServiceBindings} from "./services/keys";
import {NPUserService} from "./services/user.service";

export {ApplicationConfig};

export class DouglasApiApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    this.component(AuthenticationComponent)
    // Binding authorization component
    this.component(AuthorizationComponent)
    // Binding JWT Component
    this.component(JWTAuthenticationComponent)
    // Bind JWT service
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService)
    // Binding datasource
    this.dataSource(DbDataSource, UserServiceBindings.DATASOURCE_NAME)
    //Binding User Service
    this.bind(UserServiceBindings.USER_SERVICE).toClass(NPUserService)
  }
}
