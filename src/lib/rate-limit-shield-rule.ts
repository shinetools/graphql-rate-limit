import { GraphQLResolveInfo } from 'graphql';
import { rule } from 'graphql-shield';
import { GraphQLRateLimitConfig, GraphQLRateLimitDirectiveArgs } from './types';
import { getGraphQLRateLimiter } from './get-graphql-rate-limiter';
import { RateLimitError } from './rate-limit-error';

/**
 * Creates a graphql-shield rate limit rule. e.g.
 *
 * ```js
 * const rateLimit = createRateLimitRule({ identifyContext: (ctx) => ctx.id });
 * const permissions = shield({ Mutation: { signup: rateLimit({ window: '10s', max: 1 }) } })
 * ```
 */
const createRateLimitRule = (config: GraphQLRateLimitConfig) => {
  const noCacheRule = rule({ cache: 'no_cache' });
  const rateLimiter = getGraphQLRateLimiter(config);

  return (fieldConfig: GraphQLRateLimitDirectiveArgs) =>
    noCacheRule(async (parent, args, context, info) => {
      const { errorMessage } = await rateLimiter(
        {
          parent,
          args,
          context,
          info: info as GraphQLResolveInfo // I hope this is so.
        },
        fieldConfig
      );
      return errorMessage ? new RateLimitError(errorMessage) : true;
    });
};

export { createRateLimitRule };
