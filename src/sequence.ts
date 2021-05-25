//import {MiddlewareSequence} from '@loopback/rest';


import {
  AuthenticateFn,
  AuthenticationBindings,
  AUTHENTICATION_STRATEGY_NOT_FOUND,
  USER_PROFILE_NOT_FOUND
} from '@loopback/authentication';
import {inject} from '@loopback/context';
import {FindRoute, InvokeMethod, InvokeMiddleware, InvokeMiddlewareOptions, MiddlewareSequence, ParseParams, Reject, RequestContext, Send, SequenceActions, SequenceHandler} from '@loopback/rest';


export class MySequence implements SequenceHandler {
  static defaultOptions: InvokeMiddlewareOptions = {
    chain: 'middlewareChain.rest',
    orderedGroups: [
      //'sendResponse',
      // default
      'cors',
      // 'apiSpec',

      // // default
      // 'middleware',

      // // rest
      // 'findRoute',

      // // authentication
      // 'authentication',

      // // rest
      // 'parseParams',
      // 'invokeMethod',
    ],
  };

  constructor(
    @inject(AuthenticationBindings.AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn,
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,

    @inject(SequenceActions.INVOKE_MIDDLEWARE)
    readonly invokeMiddleware: InvokeMiddleware,
    readonly options: InvokeMiddlewareOptions = MiddlewareSequence.defaultOptions,
  ) { }
  async handle(context: RequestContext) {
    try {
      const {request, response} = context;
      const finished = await this.invokeMiddleware(context);
      if (finished) {
        return;
      }
      const route = this.findRoute(request);
      await this.authenticateRequest(request);
      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      // if error is coming from the JWT authentication extension
      // make the statusCode 401
      if (
        err.code === AUTHENTICATION_STRATEGY_NOT_FOUND ||
        err.code === USER_PROFILE_NOT_FOUND
      ) {
        Object.assign(err, {statusCode: 401 /* Unauthorized */});
      }
      this.reject(context, err);
    }
  }
}
