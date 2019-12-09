import { GraphQLRateLimitConfig } from './types';
/**
 * Returns the Directive to be passed to your GraphQL server.
 *
 * TODO: Fix `any` return type;
 * @param customConfig
 */
declare const createRateLimitDirective: (customConfig?: GraphQLRateLimitConfig) => any;
export { createRateLimitDirective };
