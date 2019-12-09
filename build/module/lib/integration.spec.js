// eslint-disable-next-line import/no-extraneous-dependencies
import test from 'ava';
import { makeExecutableSchema } from 'graphql-tools';
import { graphql } from 'graphql';
import { applyMiddleware } from 'graphql-middleware';
import { shield } from 'graphql-shield';
import { createRateLimitDirective } from './field-directive';
import { createRateLimitRule } from './rate-limit-shield-rule';
import { getGraphQLRateLimiter } from './get-graphql-rate-limiter';
test('rate limit with schema directive', async (t) => {
    const directive = createRateLimitDirective({
        identifyContext: ctx => ctx.id
    });
    const schema = makeExecutableSchema({
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
    const { data } = await graphql(schema, 'query { test }', {}, { id: '1' });
    t.deepEqual(data, { test: 'Result' });
    const { data: data2, errors } = await graphql(schema, 'query { test }', {}, { id: '1' });
    t.falsy(data2);
    t.truthy(errors);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    t.is(errors.length, 1);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const [error] = errors;
    t.is(error.message, "You are trying to access 'test' too often");
    const { data: data3 } = await graphql(schema, 'query{test}', {}, { id: '2' });
    t.deepEqual(data3, { test: 'Result' });
});
test('rate limit with graphql shield', async (t) => {
    const rule = createRateLimitRule({
        identifyContext: ctx => ctx.id
    });
    const schema = applyMiddleware(makeExecutableSchema({
        resolvers: { Query: { test: () => 'Result' } },
        typeDefs: 'type Query { test: String! }'
    }), shield({ Query: { test: rule({ max: 1, window: '1s' }) } }));
    const res = await graphql(schema, 'query { test }', {}, { id: '1' });
    t.deepEqual(res.data, { test: 'Result' });
    const res2 = await graphql(schema, 'query { test }', {}, { id: '1' });
    t.falsy(res2.data);
    t.truthy(res2.errors);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    t.is(res2.errors.length, 1);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const [error] = res2.errors;
    t.is(error.message, "You are trying to access 'test' too often");
    const res3 = await graphql(schema, 'query{test}', {}, { id: '2' });
    t.deepEqual(res3.data, { test: 'Result' });
});
test('rate limit with base rate limiter', async (t) => {
    const rateLimiter = getGraphQLRateLimiter({
        identifyContext: ctx => ctx.id
    });
    const schema = makeExecutableSchema({
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
    const res = await graphql(schema, 'query { test }', {}, { id: '1' });
    t.deepEqual(res.data, { test: 'Result' });
    const res2 = await graphql(schema, 'query { test }', {}, { id: '1' });
    t.falsy(res2.data);
    t.truthy(res2.errors);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    t.is(res2.errors.length, 1);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const [error] = res2.errors;
    t.is(error.message, "You are trying to access 'test' too often");
    const res3 = await graphql(schema, 'query{test}', {}, { id: '2' });
    t.deepEqual(res3.data, { test: 'Result' });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWdyYXRpb24uc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvaW50ZWdyYXRpb24uc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw2REFBNkQ7QUFDN0QsT0FBTyxJQUFJLE1BQU0sS0FBSyxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ2xDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDeEMsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDN0QsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDL0QsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFFbkUsSUFBSSxDQUFDLGtDQUFrQyxFQUFFLEtBQUssRUFBQyxDQUFDLEVBQUMsRUFBRTtJQUNqRCxNQUFNLFNBQVMsR0FBRyx3QkFBd0IsQ0FBQztRQUN6QyxlQUFlLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRTtLQUMvQixDQUFDLENBQUM7SUFDSCxNQUFNLE1BQU0sR0FBRyxvQkFBb0IsQ0FBQztRQUNsQyxnQkFBZ0IsRUFBRTtZQUNoQixTQUFTLEVBQUUsU0FBUztTQUNyQjtRQUNELFNBQVMsRUFBRTtZQUNULEtBQUssRUFBRTtnQkFDTCxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsUUFBUTthQUNyQjtTQUNGO1FBQ0QsUUFBUSxFQUFFOzs7Ozs7Ozs7O0tBVVQ7S0FDRixDQUFDLENBQUM7SUFDSCxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsTUFBTSxPQUFPLENBQUMsTUFBTSxFQUFFLGdCQUFnQixFQUFFLEVB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