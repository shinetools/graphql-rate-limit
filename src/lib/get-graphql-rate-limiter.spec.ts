// eslint-disable-next-line import/no-extraneous-dependencies
import test from 'ava';
import { GraphQLResolveInfo } from 'graphql';
import {
  getFieldIdentity,
  getGraphQLRateLimiter
} from './get-graphql-rate-limiter';
import { InMemoryStore } from './in-memory-store';
import { GraphQLRateLimitDirectiveArgs } from './types';

test('getFieldIdentity with no identity args', t => {
  t.is(getFieldIdentity('myField', [], {}), 'myField');
  t.is(getFieldIdentity('random', [], {}), 'random');
});

test('getFieldIdentity with identity args', t => {
  t.is(
    getFieldIdentity('myField', ['id'], { id: 2, name: 'Foo' }),
    'myField:2'
  );
  t.is(
    getFieldIdentity('myField', ['name', 'id'], { id: 2, name: 'Foo' }),
    'myField:Foo:2'
  );
  t.is(
    getFieldIdentity('myField', ['name', 'bool'], { bool: true, name: 'Foo' }),
    'myField:Foo:true'
  );
  t.is(getFieldIdentity('myField', ['name', 'bool'], {}), 'myField::');
  t.is(
    getFieldIdentity('myField', ['name', 'bool'], { name: null }),
    'myField::'
  );
});

test('getFieldIdentity with nested identity args', t => {
  t.is(
    getFieldIdentity('myField', ['item.id'], { item: { id: 2 }, name: 'Foo' }),
    'myField:2'
  );
  t.is(
    getFieldIdentity('myField', ['item.foo'], { item: { id: 2 }, name: 'Foo' }),
    'myField:'
  );

  const obj = { item: { subItem: { id: 9 } }, name: 'Foo' };
  t.is(getFieldIdentity('myField', ['item.subItem.id'], obj), 'myField:9');

  const objTwo = { item: { subItem: { id: 1 } }, name: 'Foo' };
  t.is(
    getFieldIdentity('myField', ['name', 'item.subItem.id'], objTwo),
    'myField:Foo:1'
  );
});

test('getGraphQLRateLimiter with an empty store passes, but second time fails', async t => {
  const rateLimit = getGraphQLRateLimiter({
    store: new InMemoryStore(),
    identifyContext: context => context.id
  });
  const config = { max: 1, window: '1s' };
  const field = {
    parent: {},
    args: {},
    context: { id: '1' },
    info: ({ fieldName: 'myField' } as any) as GraphQLResolveInfo
  };
  t.falsy((await rateLimit(field, config)).errorMessage);
  t.is(
    (await rateLimit(field, config)).errorMessage,
    `You are trying to access 'myField' too often`
  );
});

test('getGraphQLRateLimiter timestamps should expire', async t => {
  const rateLimit = getGraphQLRateLimiter({
    store: new InMemoryStore(),
    identifyContext: context => context.id
  });
  const config = { max: 1, window: '0.5s' };
  const field = {
    parent: {},
    args: {},
    context: { id: '1' },
    info: ({ fieldName: 'myField' } as any) as GraphQLResolveInfo
  };
  t.falsy((await rateLimit(field, config)).errorMessage);
  t.is(
    (await rateLimit(field, config)).errorMessage,
    `You are trying to access 'myField' too often`
  );
  setTimeout(async () => {
    t.falsy((await rateLimit(field, config)).errorMessage);
  }, 500);
});

test('getGraphQLRateLimiter should limit by callCount if arrayLengthField is passed', async t => {
  const rateLimit = getGraphQLRateLimiter({
    store: new InMemoryStore(),
    identifyContext: context => context.id
  });
  const config: GraphQLRateLimitDirectiveArgs = {
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
    info: ({ fieldName: 'listOfItems' } as any) as GraphQLResolveInfo
  };
  t.is(
    (await rateLimit(field, config)).errorMessage,
    `You are trying to access 'listOfItems' too often`
  );
});

test('getGraphQLRateLimiter should allow multiple calls to a field if the identityArgs change', async t => {
  const rateLimit = getGraphQLRateLimiter({
    store: new InMemoryStore(),
    identifyContext: context => context.id
  });
  const config: GraphQLRateLimitDirectiveArgs = {
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
    info: ({ fieldName: 'listOfItems' } as any) as GraphQLResolveInfo
  };
  t.falsy((await rateLimit(field, config)).errorMessage);
  t.is(
    (await rateLimit(field, config)).errorMessage,
    `You are trying to access 'listOfItems' too often`
  );
  t.falsy(
    (await rateLimit({ ...field, args: { id: '2' } }, config)).errorMessage
  );
  t.is(
    (await rateLimit(field, config)).errorMessage,
    `You are trying to access 'listOfItems' too often`
  );
});
