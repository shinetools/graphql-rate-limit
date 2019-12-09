import { GraphQLResolveInfo } from 'graphql';
import { GraphQLRateLimitConfig, GraphQLRateLimitDirectiveArgs } from './types';
/**
 * Returns a string key for the given field + args. With no identityArgs are provided, just the fieldName
 * will be used for the key. If an array of resolveArgs are provided, the values of those will be built
 * into the key.
 *
 * Example:
 * 	(fieldName = 'books', identityArgs: ['id', 'title'], resolveArgs: { id: 1, title: 'Foo', subTitle: 'Bar' })
 *  	=> books:1:Foo
 *
 * @param fieldName
 * @param identityArgs
 * @param resolveArgs
 */
declare const getFieldIdentity: (fieldName: string, identityArgs: readonly string[], resolveArgs: any) => string;
/**
 * This is the core rate limiting logic function, APIs (directive, sheild etc.)
 * can wrap this or it can be used directly in resolvers.
 * @param userConfig - global (usually app-wide) rate limiting config
 */
declare const getGraphQLRateLimiter: (userConfig: GraphQLRateLimitConfig) => ({ args, context, info }: {
    parent: any;
    args: Record<string, any>;
    context: any;
    info: GraphQLResolveInfo;
}, { arrayLengthField, identityArgs, max, window, message }: GraphQLRateLimitDirectiveArgs) => Promise<{
    errorMessage: string | undefined;
    reset: () => void | Promise<void>;
}>;
export { getGraphQLRateLimiter, getFieldIdentity };
