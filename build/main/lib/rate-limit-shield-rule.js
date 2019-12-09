"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_shield_1 = require("graphql-shield");
const get_graphql_rate_limiter_1 = require("./get-graphql-rate-limiter");
const rate_limit_error_1 = require("./rate-limit-error");
/**
 * Creates a graphql-shield rate limit rule. e.g.
 *
 * ```js
 * const rateLimit = createRateLimitRule({ identifyContext: (ctx) => ctx.id });
 * const permissions = shield({ Mutation: { signup: rateLimit({ window: '10s', max: 1 }) } })
 * ```
 */
const createRateLimitRule = (config) => {
    const noCacheRule = graphql_shield_1.rule({ cache: 'no_cache' });
    const rateLimiter = get_graphql_rate_limiter_1.getGraphQLRateLimiter(config);
    return (fieldConfig) => noCacheRule(async (parent, args, context, info) => {
        const { errorMessage } = await rateLimiter({
            parent,
            args,
            context,
            info: info // I hope this is so.
        }, fieldConfig);
        return errorMessage ? new rate_limit_error_1.RateLimitError(errorMessage) : true;
    });
};
exports.createRateLimitRule = createRateLimitRule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmF0ZS1saW1pdC1zaGllbGQtcnVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvcmF0ZS1saW1pdC1zaGllbGQtcnVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLG1EQUFzQztBQUV0Qyx5RUFBbUU7QUFDbkUseURBQW9EO0FBRXBEOzs7Ozs7O0dBT0c7QUFDSCxNQUFNLG1CQUFtQixHQUFHLENBQUMsTUFBOEIsRUFBRSxFQUFFO0lBQzdELE1BQU0sV0FBVyxHQUFHLHFCQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztJQUNoRCxNQUFNLFdBQVcsR0FBRyxnREFBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUVsRCxPQUFPLENBQUMsV0FBMEMsRUFBRSxFQUFFLENBQ3BELFdBQVcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUU7UUFDaEQsTUFBTSxFQUFFLFlBQVksRUFBRSxHQUFHLE1BQU0sV0FBVyxDQUN4QztZQUNFLE1BQU07WUFDTixJQUFJO1lBQ0osT0FBTztZQUNQLElBQUksRUFBRSxJQUEwQixDQUFDLHFCQUFxQjtTQUN2RCxFQUNELFdBQVcsQ0FDWixDQUFDO1FBQ0YsT0FBTyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksaUNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ2hFLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDO0FBRU8sa0RBQW1CIn0=