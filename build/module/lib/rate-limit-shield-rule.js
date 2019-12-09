import { rule } from 'graphql-shield';
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
const createRateLimitRule = (config) => {
    const noCacheRule = rule({ cache: 'no_cache' });
    const rateLimiter = getGraphQLRateLimiter(config);
    return (fieldConfig) => noCacheRule(async (parent, args, context, info) => {
        const { errorMessage } = await rateLimiter({
            parent,
            args,
            context,
            info: info // I hope this is so.
        }, fieldConfig);
        return errorMessage ? new RateLimitError(errorMessage) : true;
    });
};
export { createRateLimitRule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmF0ZS1saW1pdC1zaGllbGQtcnVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvcmF0ZS1saW1pdC1zaGllbGQtcnVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFdEMsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDbkUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRXBEOzs7Ozs7O0dBT0c7QUFDSCxNQUFNLG1CQUFtQixHQUFHLENBQUMsTUFBOEIsRUFBRSxFQUFFO0lBQzdELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELE1BQU0sV0FBVyxHQUFHLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRWxELE9BQU8sQ0FBQyxXQUEwQyxFQUFFLEVBQUUsQ0FDcEQsV0FBVyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRTtRQUNoRCxNQUFNLEVBQUUsWUFBWSxFQUFFLEdBQUcsTUFBTSxXQUFXLENBQ3hDO1lBQ0UsTUFBTTtZQUNOLElBQUk7WUFDSixPQUFPO1lBQ1AsSUFBSSxFQUFFLElBQTBCLENBQUMscUJBQXFCO1NBQ3ZELEVBQ0QsV0FBVyxDQUNaLENBQUM7UUFDRixPQUFPLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUNoRSxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQztBQUVGLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxDQUFDIn0=