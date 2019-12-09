import { GraphQLRateLimitConfig, GraphQLRateLimitDirectiveArgs } from './types';
/**
 * Creates a graphql-shield rate limit rule. e.g.
 *
 * ```js
 * const rateLimit = createRateLimitRule({ identifyContext: (ctx) => ctx.id });
 * const permissions = shield({ Mutation: { signup: rateLimit({ window: '10s', max: 1 }) } })
 * ```
 */
declare const createRateLimitRule: (config: GraphQLRateLimitConfig) => (fieldConfig: GraphQLRateLimitDirectiveArgs) => import("graphql-shield/dist/rules").Rule;
export { createRateLimitRule };
