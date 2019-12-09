import { GraphQLResolveInfo } from 'graphql';
import get from 'lodash.get';
import ms from 'ms';
import { InMemoryStore } from './in-memory-store';
import {
  FormatErrorInput,
  GraphQLRateLimitConfig,
  GraphQLRateLimitDirectiveArgs,
  Identity
} from './types';

// Default field options
const DEFAULT_WINDOW = 60 * 1000;
const DEFAULT_MAX = 5;
const DEFAULT_FIELD_IDENTITY_ARGS: readonly string[] = [];

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
const getFieldIdentity = (
  fieldName: string,
  identityArgs: readonly string[],
  resolveArgs: any
) => {
  const argsKey = identityArgs.map(arg => get(resolveArgs, arg));
  return [fieldName, ...argsKey].join(':');
};

/**
 * This is the core rate limiting logic function, APIs (directive, sheild etc.)
 * can wrap this or it can be used directly in resolvers.
 * @param userConfig - global (usually app-wide) rate limiting config
 */
const getGraphQLRateLimiter = (
  // Main config (e.g. the config passed to the createRateLimitDirective func)
  userConfig: GraphQLRateLimitConfig
) => {
  // Default directive config
  const defaultConfig = {
    formatError: ({ fieldName }: FormatErrorInput) => {
      return `You are trying to access '${fieldName}' too often`;
    },
    // Required
    identifyContext: () => {
      throw new Error(
        'You must implement a createRateLimitDirective.config.identifyContext'
      );
    },
    store: new InMemoryStore()
  };

  const { identifyContext, formatError, store } = {
    ...defaultConfig,
    ...userConfig
  };

  /**
   * Field level rate limiter function that returns the error message or undefined
   * @param args - pass the resolver args as an object
   * @param config - field level config
   */
  const rateLimiter = async (
    // Resolver args
    {
      args,
      context,
      info
    }: {
      parent: any;
      args: Record<string, any>;
      context: any;
      info: GraphQLResolveInfo;
    },
    // Field level config (e.g. the directive parameters)
    {
      arrayLengthField,
      identityArgs,
      max,
      window,
      message
    }: GraphQLRateLimitDirectiveArgs
  ): Promise<{
    errorMessage: string | undefined;
    reset: () => void | Promise<void>;
  }> => {
    // Identify the user or client on the context
    const contextIdentity = identifyContext(context);
    // User defined window in ms that this field can be accessed for before the call is expired
    const windowMs = (window ? ms(window) : DEFAULT_WINDOW) as number;
    // String key for this field
    const fieldIdentity = getFieldIdentity(
      info.fieldName,
      identityArgs || DEFAULT_FIELD_IDENTITY_ARGS,
      args
    );

    // User configured maximum calls to this field
    const maxCalls = max || DEFAULT_MAX;
    // Call count could be determined by the lenght of the array value, but most commonly 1
    const callCount =
      (arrayLengthField && get(args, [arrayLengthField, 'length'])) || 1;
    // Allinclusive 'identity' for this resolver call
    const identity: Identity = { contextIdentity, fieldIdentity };
    // Retrieve all the timestamps to the field for the context identity
    const accessTimestamps = await store.getForIdentity(identity);
    // Timestamp of this call to be save for future ref
    const timestamp = Date.now();
    // Create an array of callCount length, filled with the current timestamp
    const newTimestamps = [...new Array(callCount || 1)].map(() => timestamp);
    // Get all the timestamps that havent expired
    const filteredAccessTimestamps: readonly any[] = [
      ...newTimestamps,
      ...accessTimestamps.filter(t => {
        return t + windowMs > Date.now();
      })
    ];

    // Save these access timestamps
    await store.setForIdentity(identity, filteredAccessTimestamps, windowMs);

    // Field level custom message or a global formatting function
    const errorMessage =
      message ||
      formatError({
        contextIdentity,
        fieldIdentity,
        fieldName: info.fieldName,
        max: maxCalls,
        window: windowMs
      });

    // Returns an error message or undefined if no error
    return {
      errorMessage:
        filteredAccessTimestamps.length > maxCalls ? errorMessage : undefined,
      reset: () =>
        store.setForIdentity(
          identity,
          accessTimestamps.length ? accessTimestamps : [timestamp + windowMs],
          windowMs
        )
    };
  };

  return rateLimiter;
};

export { getGraphQLRateLimiter, getFieldIdentity };
