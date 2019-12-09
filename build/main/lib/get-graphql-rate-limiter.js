"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_get_1 = __importDefault(require("lodash.get"));
const ms_1 = __importDefault(require("ms"));
const in_memory_store_1 = require("./in-memory-store");
// Default field options
const DEFAULT_WINDOW = 60 * 1000;
const DEFAULT_MAX = 5;
const DEFAULT_FIELD_IDENTITY_ARGS = [];
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
const getFieldIdentity = (fieldName, identityArgs, resolveArgs) => {
    const argsKey = identityArgs.map(arg => lodash_get_1.default(resolveArgs, arg));
    return [fieldName, ...argsKey].join(':');
};
exports.getFieldIdentity = getFieldIdentity;
/**
 * This is the core rate limiting logic function, APIs (directive, sheild etc.)
 * can wrap this or it can be used directly in resolvers.
 * @param userConfig - global (usually app-wide) rate limiting config
 */
const getGraphQLRateLimiter = (
// Main config (e.g. the config passed to the createRateLimitDirective func)
userConfig) => {
    // Default directive config
    const defaultConfig = {
        formatError: ({ fieldName }) => {
            return `You are trying to access '${fieldName}' too often`;
        },
        // Required
        identifyContext: () => {
            throw new Error('You must implement a createRateLimitDirective.config.identifyContext');
        },
        store: new in_memory_store_1.InMemoryStore()
    };
    const { identifyContext, formatError, store } = Object.assign({}, defaultConfig, userConfig);
    /**
     * Field level rate limiter function that returns the error message or undefined
     * @param args - pass the resolver args as an object
     * @param config - field level config
     */
    const rateLimiter = async (
    // Resolver args
    { args, context, info }, 
    // Field level config (e.g. the directive parameters)
    { arrayLengthField, identityArgs, max, window, message }) => {
        // Identify the user or client on the context
        const contextIdentity = identifyContext(context);
        // User defined window in ms that this field can be accessed for before the call is expired
        const windowMs = (window ? ms_1.default(window) : DEFAULT_WINDOW);
        // String key for this field
        const fieldIdentity = getFieldIdentity(info.fieldName, identityArgs || DEFAULT_FIELD_IDENTITY_ARGS, args);
        // User configured maximum calls to this field
        const maxCalls = max || DEFAULT_MAX;
        // Call count could be determined by the lenght of the array value, but most commonly 1
        const callCount = (arrayLengthField && lodash_get_1.default(args, [arrayLengthField, 'length'])) || 1;
        // Allinclusive 'identity' for this resolver call
        const identity = { contextIdentity, fieldIdentity };
        // Retrieve all the timestamps to the field for the context identity
        const accessTimestamps = await store.getForIdentity(identity);
        // Timestamp of this call to be save for future ref
        const timestamp = Date.now();
        // Create an array of callCount length, filled with the current timestamp
        const newTimestamps = [...new Array(callCount || 1)].map(() => timestamp);
        // Get all the timestamps that havent expired
        const filteredAccessTimestamps = [
            ...newTimestamps,
            ...accessTimestamps.filter(t => {
                return t + windowMs > Date.now();
            })
        ];
        // Save these access timestamps
        await store.setForIdentity(identity, filteredAccessTimestamps, windowMs);
        // Field level custom message or a global formatting function
        const errorMessage = message ||
            formatError({
                contextIdentity,
                fieldIdentity,
                fieldName: info.fieldName,
                max: maxCalls,
                window: windowMs
            });
        // Returns an error message or undefined if no error
        return {
            errorMessage: filteredAccessTimestamps.length > maxCalls ? errorMessage : undefined,
            reset: () => store.setForIdentity(identity, accessTimestamps.length ? accessTimestamps : [timestamp + windowMs], windowMs)
        };
    };
    return rateLimiter;
};
exports.getGraphQLRateLimiter = getGraphQLRateLimiter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWdyYXBocWwtcmF0ZS1saW1pdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9nZXQtZ3JhcGhxbC1yYXRlLWxpbWl0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSw0REFBNkI7QUFDN0IsNENBQW9CO0FBQ3BCLHVEQUFrRDtBQVFsRCx3QkFBd0I7QUFDeEIsTUFBTSxjQUFjLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQztBQUNqQyxNQUFNLFdBQVcsR0FBRyxDQUFDLENBQUM7QUFDdEIsTUFBTSwyQkFBMkIsR0FBc0IsRUFBRSxDQUFDO0FBRTFEOzs7Ozs7Ozs7Ozs7R0FZRztBQUNILE1BQU0sZ0JBQWdCLEdBQUcsQ0FDdkIsU0FBaUIsRUFDakIsWUFBK0IsRUFDL0IsV0FBZ0IsRUFDaEIsRUFBRTtJQUNGLE1BQU0sT0FBTyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxvQkFBRyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQy9ELE9BQU8sQ0FBQyxTQUFTLEVBQUUsR0FBRyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM0MsQ0FBQyxDQUFDO0FBeUg4Qiw0Q0FBZ0I7QUF2SGhEOzs7O0dBSUc7QUFDSCxNQUFNLHFCQUFxQixHQUFHO0FBQzVCLDRFQUE0RTtBQUM1RSxVQUFrQyxFQUNsQyxFQUFFO0lBQ0YsMkJBQTJCO0lBQzNCLE1BQU0sYUFBYSxHQUFHO1FBQ3BCLFdBQVcsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFvQixFQUFFLEVBQUU7WUFDL0MsT0FBTyw2QkFBNkIsU0FBUyxhQUFhLENBQUM7UUFDN0QsQ0FBQztRQUNELFdBQVc7UUFDWCxlQUFlLEVBQUUsR0FBRyxFQUFFO1lBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQ2Isc0VBQXNFLENBQ3ZFLENBQUM7UUFDSixDQUFDO1FBQ0QsS0FBSyxF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