"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line import/no-extraneous-dependencies
const ava_1 = __importDefault(require("ava"));
const get_graphql_rate_limiter_1 = require("./get-graphql-rate-limiter");
const in_memory_store_1 = require("./in-memory-store");
ava_1.default('getFieldIdentity with no identity args', t => {
    t.is(get_graphql_rate_limiter_1.getFieldIdentity('myField', [], {}), 'myField');
    t.is(get_graphql_rate_limiter_1.getFieldIdentity('random', [], {}), 'random');
});
ava_1.default('getFieldIdentity with identity args', t => {
    t.is(get_graphql_rate_limiter_1.getFieldIdentity('myField', ['id'], { id: 2, name: 'Foo' }), 'myField:2');
    t.is(get_graphql_rate_limiter_1.getFieldIdentity('myField', ['name', 'id'], { id: 2, name: 'Foo' }), 'myField:Foo:2');
    t.is(get_graphql_rate_limiter_1.getFieldIdentity('myField', ['name', 'bool'], { bool: true, name: 'Foo' }), 'myField:Foo:true');
    t.is(get_graphql_rate_limiter_1.getFieldIdentity('myField', ['name', 'bool'], {}), 'myField::');
    t.is(get_graphql_rate_limiter_1.getFieldIdentity('myField', ['name', 'bool'], { name: null }), 'myField::');
});
ava_1.default('getFieldIdentity with nested identity args', t => {
    t.is(get_graphql_rate_limiter_1.getFieldIdentity('myField', ['item.id'], { item: { id: 2 }, name: 'Foo' }), 'myField:2');
    t.is(get_graphql_rate_limiter_1.getFieldIdentity('myField', ['item.foo'], { item: { id: 2 }, name: 'Foo' }), 'myField:');
    const obj = { item: { subItem: { id: 9 } }, name: 'Foo' };
    t.is(get_graphql_rate_limiter_1.getFieldIdentity('myField', ['item.subItem.id'], obj), 'myField:9');
    const objTwo = { item: { subItem: { id: 1 } }, name: 'Foo' };
    t.is(get_graphql_rate_limiter_1.getFieldIdentity('myField', ['name', 'item.subItem.id'], objTwo), 'myField:Foo:1');
});
ava_1.default('getGraphQLRateLimiter with an empty store passes, but second time fails', async (t) => {
    const rateLimit = get_graphql_rate_limiter_1.getGraphQLRateLimiter({
        store: new in_memory_store_1.InMemoryStore(),
        identifyContext: context => context.id
    });
    const config = { max: 1, window: '1s' };
    const field = {
        parent: {},
        args: {},
        context: { id: '1' },
        info: { fieldName: 'myField' }
    };
    t.falsy((await rateLimit(field, config)).errorMessage);
    t.is((await rateLimit(field, config)).errorMessage, `You are trying to access 'myField' too often`);
});
ava_1.default('getGraphQLRateLimiter timestamps should expire', async (t) => {
    const rateLimit = get_graphql_rate_limiter_1.getGraphQLRateLimiter({
        store: new in_memory_store_1.InMemoryStore(),
        identifyContext: context => context.id
    });
    const config = { max: 1, window: '0.5s' };
    const field = {
        parent: {},
        args: {},
        context: { id: '1' },
        info: { fieldName: 'myField' }
    };
    t.falsy((await rateLimit(field, config)).errorMessage);
    t.is((await rateLimit(field, config)).errorMessage, `You are trying to access 'myField' too often`);
    setTimeout(async () => {
        t.falsy((await rateLimit(field, config)).errorMessage);
    }, 500);
});
ava_1.default('getGraphQLRateLimiter should limit by callCount if arrayLengthField is passed', async (t) => {
    const rateLimit = get_graphql_rate_limiter_1.getGraphQLRateLimiter({
        store: new in_memory_store_1.InMemoryStore(),
        identifyContext: context => context.id
    });
    const config = {
        max: 4,
        window: '1s',
        arrayLengthField: 'items'
    };
    const field = {
        parent: {},
        args: {
            items: [1, 2, 3, 4, 5]
        },
        context: { id: '1' },
        info: { fieldName: 'listOfItems' }
    };
    t.is((await rateLimit(field, config)).errorMessage, `You are trying to access 'listOfItems' too often`);
});
ava_1.default('getGraphQLRateLimiter should allow multiple calls to a field if the identityArgs change', async (t) => {
    const rateLimit = get_graphql_rate_limiter_1.getGraphQLRateLimiter({
        store: new in_memory_store_1.InMemoryStore(),
        identifyContext: context => context.id
    });
    const config = {
        max: 1,
        window: '1s',
        identityArgs: ['id']
    };
    const field = {
        parent: {},
        args: {
            id: '1'
        },
        context: { id: '1' },
        info: { fieldName: 'listOfItems' }
    };
    t.falsy((await rateLimit(field, config)).errorMessage);
    t.is((await rateLimit(field, config)).errorMessage, `You are trying to access 'listOfItems' too often`);
    t.falsy((await rateLimit(Object.assign({}, field, { args: { id: '2' } }), config)).errorMessage);
    t.is((await rateLimit(field, config)).errorMessage, `You are trying to access 'listOfItems' too often`);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWdyYXBocWwtcmF0ZS1saW1pdGVyLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2dldC1ncmFwaHFsLXJhdGUtbGltaXRlci5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNkRBQTZEO0FBQzdELDhDQUF1QjtBQUV2Qix5RUFHb0M7QUFDcEMsdURBQWtEO0FBR2xELGFBQUksQ0FBQyx3Q0FBd0MsRUFBRSxDQUFDLENBQUMsRUFBRTtJQUNqRCxDQUFDLENBQUMsRUFBRSxDQUFDLDJDQUFnQixDQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDckQsQ0FBQyxDQUFDLEVBQUUsQ0FBQywyQ0FBZ0IsQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3JELENBQUMsQ0FBQyxDQUFDO0FBRUgsYUFBSSxDQUFDLHFDQUFxQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0lBQzlDLENBQUMsQ0FBQyxFQUFFLENBQ0YsMkNBQWdCLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUMzRCxXQUFXLENBQ1osQ0FBQztJQUNGLENBQUMsQ0FBQyxFQUFFLENBQ0YsMkNBQWdCLENBQUMsU0FBUyxFQUFFLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFDbkUsZUFBZSxDQUNoQixDQUFDO0lBQ0YsQ0FBQyxDQUFDLEVBQUUsQ0FDRiwyQ0FBZ0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUMxRSxrQkFBa0IsQ0FDbkIsQ0FBQztJQUNGLENBQUMsQ0FBQyxFQUFFLENBQUMsMkNBQWdCLENBQUMsU0FBUyxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ3JFLENBQUMsQ0FBQyxFQUFFLENBQ0YsMkNBQWdCLENBQUMsU0FBUyxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQzdELFdBQVcsQ0FDWixDQUFDO0FBQ0osQ0FBQyxDQUFDLENBQUM7QUFFSCxhQUFJLENBQUMsNENBQTRDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7SUFDckQsQ0FBQyxDQUFDLEVBQUUsQ0FDRiwyQ0FBZ0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFDMUUsV0FBVyxDQUNaLENBQUM7SUFDRixDQUFDLENBQUMsRUFBRSxDQUNGLDJDQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUMzRSxVQUFVLENBQ1gsQ0FBQztJQUVGLE1BQU0sR0FBRyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDO0lBQzFELENBQUMsQ0FBQyxFQUFFLENBQUMsMkNBQWdCLENBQUMsU0FBUyxFQUFFLENBQUMsaUJBQWlCLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUV6RSxNQUFNLE1BQU0sR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQztJQUM3RCxDQUFDLENBQUMsRUFBRSxDQUNGLDJDQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDLE1BQU0sRUFBRSxpQkFBaUIsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxFQUNoRSxlQUFlLENBQ2hCLENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQztBQUVILGFBQUksQ0FBQyx5RUFBeUUsRUFBRSxLQUFLLEVBQUMsQ0FBQyxFQUFDLEVBQUU7SUFDeEYsTUFBTSxTQUFTLEdBQUcsZ0RBQXFCLENBQUM7UUFDdEMsS0FBSyxFQUFFLElBQUksK0JBQWEsRUFBRTtRQUMxQixlQUFlLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRTtLQUN2QyxDQUFDLENBQUM7SUFDSCxNQUFNLE1BQU0sR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDO0lBQ3hDLE1BQU0sS0FBSyxHQUFHO1FBQ1osTUFBTSxFQUFFLEVBQUU7UUFDVixJQUFJLEVBQUUsRUFBRTtRQUNSLE9BQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUU7UUFDcEIsSUFBSSxFQUFHLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBZ0M7S0FDOUQsQ0FBQztJQUNGLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLFNBQVMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUN2RCxDQUFDLENBQUMsRUFBRSxDQUNGLENBQUMsTUFBTSxTQUFTLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUM3Qyw4Q0FBOEMsQ0FDL0MsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDO0FBRUgsYUFBSSxDQUFDLGdEQUFnRCxFQUFFLEtBQUssRUFBQyxDQUFDLEVBQUMsRUFBRTtJQUMvRCxNQUFNLFNBQVMsR0FBRyxnREFBcUIsQ0FBQztRQUN0QyxLQUFLLEVBQUUsSUFBSSwrQkFBYSxFQUFFO1FBQzFCLGVBQWUsRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFO0tBQ3ZDLENBQUMsQ0FBQztJQUNILE1BQU0sTUFBTSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUM7SUFDMUMsTUFBTSxLQUFLLEdBQUc7UUFDWixNQUFNLEVBQUUsRUFBRTtRQUNWLElBQUksRUFBRSxFQUFFO1FBQ1IsT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRTtRQUNwQixJQUFJLEVBQUcsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFnQztLQUM5RCxDQUFDO0lBQ0YsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sU0FBUyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3ZELENBQUMsQ0FBQyxFQUFFLENBQ0YsQ0FBQyxNQUFNLFNBQVMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQzdDLDhDQUE4QyxDQUMvQyxDQUFDO0lBQ0YsVUFBVSxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ3BCLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLFNBQVMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUN6RCxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDVixDQUFDLENBQUMsQ0FBQztBQUVILGFBQUksQ0FBQywrRUFBK0UsRUFBRSxLQUFLLEVBQUMsQ0FBQyxFQUFDLEVBQUU7SUFDOUYsTUFBTSxTQUFTLEdBQUcsZ0RBQXFCLENBQUM7UUFDdEMsS0FBSyxFQUFFLElBQUksK0JBQWEsRUFBRTtRQUMxQixlQUFlLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRTtLQUN2QyxDQUFDLENBQUM7SUFDSCxNQUFNLE1BQU0sR0FBa0M7UUFDNUMsR0FBRyxFQUFFLENBQUM7UUFDTixNQUFNLEVBQUUsSUFBSTtRQUNaLGdCQUFnQixFQUFFLE9BQU87S0FDMUIsQ0FBQztJQUNGLE1BQU0sS0FBSyxHQUFHO1FBQ1osTUFBTSxFQUFFLEVBQUU7UUFDVixJQUFJLEVBQUU7WUFDSixLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3ZCO1FBQ0QsT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRTtRQUNwQixJQUFJLEVBQUcsRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFnQztLQUNsRSxDQUFDO0lBQ0YsQ0FBQyxDQUFDLEVBQUUsQ0FDRixDQUFDLE1BQU0sU0FBUyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLFlBQVksRUFDN0Msa0RBQWtELENBQ25ELENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQztBQUVILGFBQUksQ0FBQyx5RkFBeUYsRUFBRSxLQUFLLEVBQUMsQ0FBQyxFQUFDLEVBQUU7SUFDeEcsTUFBTSxTQUFTLEdBQUcsZ0RBQXFCLENBQUM7UUFDdEMsS0FBSyxFQUFFLElBQUksK0JBQWEsRUFBRTtRQUMxQixlQUFlLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRTtLQUN2QyxDQUFDLENBQUM7SUFDSCxNQUFNLE1BQU0sR0FBa0M7UUFDNUMsR0FBRyxFQUFFLENBQUM7UUFDTixNQUFNLEVBQUUsSUFBSTtRQUNaLFlBQVksRUFBRSxDQUFDLElBQUksQ0FBQztLQUNyQixDQUFDO0lBQ0YsTUFBTSxLQUFLLEdBQUc7UUFDWixNQUFNLEVBQUUsRUFBRTtRQUNWLElBQUksRUFBRTtZQUNKLEVBQUUsRUFBRSxHQUFHO1NBQ1I7UUFDRCxPQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFO1FBQ3BCLElBQUksRUFBRyxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQWdDO0tBQ2xFLENBQUM7SUFDRixDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxTQUFTLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDdkQsQ0FBQyxDQUFDLEVBQUUsQ0FDRixDQUFDLE1BQU0sU0FBUyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLFlBQVksRUFDN0Msa0RBQWtELENBQ25ELENBQUM7SUFDRixDQUFDLENBQUMsS0FBSyxDQUNMLENBQUMsTUFBTSxTQUFTLG1CQUFNLEtBQUssSUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQ3hFLENBQUM7SUFDRixDQUFDLENBQUMsRUFBRSxDQUNGLENBQUMsTUFBTSxTQUFTLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUM3QyxrREFBa0QsQ0FDbkQsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDIn0=