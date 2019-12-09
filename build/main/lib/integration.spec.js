"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line import/no-extraneous-dependencies
const ava_1 = __importDefault(require("ava"));
const graphql_tools_1 = require("graphql-tools");
const graphql_1 = require("graphql");
const graphql_middleware_1 = require("graphql-middleware");
const graphql_shield_1 = require("graphql-shield");
const field_directive_1 = require("./field-directive");
const rate_limit_shield_rule_1 = require("./rate-limit-shield-rule");
const get_graphql_rate_limiter_1 = require("./get-graphql-rate-limiter");
ava_1.default('rate limit with schema directive', async (t) => {
    const directive = field_directive_1.createRateLimitDirective({
        identifyContext: ctx => ctx.id
    });
    const schema = graphql_tools_1.makeExecutableSchema({
        schemaDirectives: {
            rateLimit: directive
        },
        resolvers: {
            Query: {
                test: () => 'Result'
            }
        },
        typeDefs: `
      directive @rateLimit(
        message: String
        identityArgs: [String]
        arrayLengthField: String
        max: Int
        window: String
      ) on FIELD_DEFINITION

      type Query { test: String! @rateLimit(max: 1, window: "1s") }
    `
    });
    const { data } = await graphql_1.graphql(schema, 'query { test }', {}, { id: '1' });
    t.deepEqual(data, { test: 'Result' });
    const { data: data2, errors } = await graphql_1.graphql(schema, 'query { test }', {}, { id: '1' });
    t.falsy(data2);
    t.truthy(errors);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    t.is(errors.length, 1);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const [error] = errors;
    t.is(error.message, "You are trying to access 'test' too often");
    const { data: data3 } = await graphql_1.graphql(schema, 'query{test}', {}, { id: '2' });
    t.deepEqual(data3, { test: 'Result' });
});
ava_1.default('rate limit with graphql shield', async (t) => {
    const rule = rate_limit_shield_rule_1.createRateLimitRule({
        identifyContext: ctx => ctx.id
    });
    const schema = graphql_middleware_1.applyMiddleware(graphql_tools_1.makeExecutableSchema({
        resolvers: { Query: { test: () => 'Result' } },
        typeDefs: 'type Query { test: String! }'
    }), graphql_shield_1.shield({ Query: { test: rule({ max: 1, window: '1s' }) } }));
    const res = await graphql_1.graphql(schema, 'query { test }', {}, { id: '1' });
    t.deepEqual(res.data, { test: 'Result' });
    const res2 = await graphql_1.graphql(schema, 'query { test }', {}, { id: '1' });
    t.falsy(res2.data);
    t.truthy(res2.errors);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    t.is(res2.errors.length, 1);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const [error] = res2.errors;
    t.is(error.message, "You are trying to access 'test' too often");
    const res3 = await graphql_1.graphql(schema, 'query{test}', {}, { id: '2' });
    t.deepEqual(res3.data, { test: 'Result' });
});
ava_1.default('rate limit with base rate limiter', async (t) => {
    const rateLimiter = get_graphql_rate_limiter_1.getGraphQLRateLimiter({
        identifyContext: ctx => ctx.id
    });
    const schema = graphql_tools_1.makeExecutableSchema({
        resolvers: {
            Query: {
                test: async (parent, args, context, info) => {
                    const { errorMessage } = await rateLimiter({ parent, args, context, info }, { max: 1, window: '1s' });
                    if (errorMessage)
                        throw new Error(errorMessage);
                    return 'Result';
                }
            }
        },
        typeDefs: 'type Query { test: String! }'
    });
    const res = await graphql_1.graphql(schema, 'query { test }', {}, { id: '1' });
    t.deepEqual(res.data, { test: 'Result' });
    const res2 = await graphql_1.graphql(schema, 'query { test }', {}, { id: '1' });
    t.falsy(res2.data);
    t.truthy(res2.errors);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    t.is(res2.errors.length, 1);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const [error] = res2.errors;
    t.is(error.message, "You are trying to access 'test' too often");
    const res3 = await graphql_1.graphql(schema, 'query{test}', {}, { id: '2' });
    t.deepEqual(res3.data, { test: 'Result' });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWdyYXRpb24uc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvaW50ZWdyYXRpb24uc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDZEQUE2RDtBQUM3RCw4Q0FBdUI7QUFDdkIsaURBQXFEO0FBQ3JELHFDQUFrQztBQUNsQywyREFBcUQ7QUFDckQsbURBQXdDO0FBQ3hDLHVEQUE2RDtBQUM3RCxxRUFBK0Q7QUFDL0QseUVBQW1FO0FBRW5FLGFBQUksQ0FBQyxrQ0FBa0MsRUFBRSxLQUFLLEVBQUMsQ0FBQyxFQUFDLEVBQUU7SUFDakQsTUFBTSxTQUFTLEdBQUcsMENBQXdCLENBQUM7UUFDekMsZUFBZSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUU7S0FDL0IsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxNQUFNLEdBQUcsb0NBQW9CLENBQUM7UUFDbEMsZ0JBQWdCLEVBQUU7WUFDaEIsU0FBUyxFQUFFLFNBQVM7U0FDckI7UUFDRCxTQUFTLEVBQUU7WUFDVCxLQUFLLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLFFBQVE7YUFDckI7U0FDRjtRQUNELFFBQVEsRUFBRTs7Ozs7Ozs7OztLQVVUO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLE1BQU0saUJBQU8sQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDMUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztJQUN0QyxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxNQUFNLGlCQUFPLENBQzNDLE1BQU0sRUFDTixnQkFBZ0IsRUFDaEIsRUFBRSxFQUNGLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUNaLENBQUM7SUFDRixDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2YsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqQixvRUFBb0U7SUFDcEUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3hCLG9FQUFvRTtJQUNwRSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBTyxDQUFDO0lBQ3hCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSwyQ0FBMkMsQ0FBQyxDQUFDO0lBRWpFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsTUFBTSxpQkFBTyxDQUFDLE1BQU0sRUFBRSxhQUFhLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDOUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUN6QyxDQUFDLENBQUMsQ0FBQztBQUVILGFBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxLQUFLLEVBQUMsQ0FBQyxFQUFDLEVBQUU7SUFDL0MsTUFBTSxJQUFJLEdBQUcsNENBQW1CLENBQUM7UUFDL0IsZUFBZSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUU7S0FDL0IsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxNQUFNLEdBQUcsb0NBQWUsQ0FDNUIsb0NBQW9CLENBQUM7UUFDbkIsU0FBUyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFO1FBQzlDLFFBQVEsRUFBRSw4QkFBOEI7S0FDekMsQ0FBQyxFQUNGLHVCQUFNLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FDNUQsQ0FBQztJQUVGLE1BQU0sR0FBRyxHQUFHLE1BQU0saUJBQU8sQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDckUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFFMUMsTUFBTSxJQUFJLEdBQUcsTUFBTSxpQkFBTyxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN0RSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuQixDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0QixvRUFBb0U7SUFDcEUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM3QixvRUFBb0U7SUFDcEUsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFPLENBQUM7SUFDN0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLDJDQUEyQyxDQUFDLENBQUM7SUFFakUsTUFBTSxJQUFJLEdBQUcsTUFBTSxpQkFBTyxDQUFDLE1BQU0sRUFBRSxhQUFhLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDbkUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFDN0MsQ0FBQyxDQUFDLENBQUM7QUFFSCxhQUFJLENBQUMsbUNBQW1DLEVBQUUsS0FBSyxFQUFDLENBQUMsRUFBQyxFQUFFO0lBQ2xELE1BQU0sV0FBVyxHQUFHLGdEQUFxQixDQUFDO1FBQ3hDLGVBQWUsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0tBQy9CLENBQUMsQ0FBQztJQUNILE1BQU0sTUFBTSxHQUFHLG9DQUFvQixDQUFDO1FBQ2xDLFNBQVMsRUFBRTtZQUNULEtBQUssRUFBRTtnQkFDTCxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFO29CQUMxQyxNQUFNLEVBQUUsWUFBWSxFQUFFLEdBQUcsTUFBTSxXQUFXLENBQ3hDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQy9CLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQ3pCLENBQUM7b0JBQ0YsSUFBSSxZQUFZO3dCQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7b0JBQ2hELE9BQU8sUUFBUSxDQUFDO2dCQUNsQixDQUFDO2FBQ0Y7U0FDRjtRQUNELFFBQVEsRUFBRSw4QkFBOEI7S0FDekMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxHQUFHLEdBQUcsTUFBTSxpQkFBTyxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNyRSxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztJQUUxQyxNQUFNLElBQUksR0FBRyxNQUFNLGlCQUFPLENBQUMsTUFBTSxFQUFFLGdCQUFnQixFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3RFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25CLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3RCLG9FQUFvRTtJQUNwRSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzdCLG9FQUFvRTtJQUNwRSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU8sQ0FBQztJQUM3QixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsMkNBQTJDLENBQUMsQ0FBQztJQUVqRSxNQUFNLElBQUksR0FBRyxNQUFNLGlCQUFPLENBQUMsTUFBTSxFQUFFLGFBQWEsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNuRSxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUM3QyxDQUFDLENBQUMsQ0FBQyJ9