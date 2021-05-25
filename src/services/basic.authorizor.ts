import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata
} from '@loopback/authorization';
import {securityId, UserProfile} from '@loopback/security';
import _ from 'lodash';

// Instance level authorizer
// Can be also registered as an authorizer, depends on users' need.
export async function basicAuthorization(
  authorizationCtx: AuthorizationContext,
  metadata: AuthorizationMetadata,
): Promise<AuthorizationDecision> {
  // No access if authorization details are missing

  let currentUser: UserProfile
  if (authorizationCtx.principals.length > 0) {
    const user = _.pick(authorizationCtx.principals[0], [
      'id',
      'username',
      'role',
    ])
    currentUser = {[securityId]: user.id, name: user.username, role: user.role}

  } else {
    return AuthorizationDecision.DENY
  }

  if (_.isEmpty(currentUser.role)) {
    return AuthorizationDecision.DENY
  }

  // Authorize everything that does not have a allowedRoles property
  if (!metadata.allowedRoles) {
    return AuthorizationDecision.ALLOW
  }

  let roleIsAllowed = false
  if (metadata.allowedRoles!.includes(currentUser.role)) {
    roleIsAllowed = true
  }

  if (!roleIsAllowed) {
    return AuthorizationDecision.DENY
  } else {
    return AuthorizationDecision.ALLOW
  }

  /**
   * Allow access only to model owners, using route as source of truth
   *
   * eg. @post('/users/{userId}/orders', ...) returns `userId` as args[0]
   */
}
