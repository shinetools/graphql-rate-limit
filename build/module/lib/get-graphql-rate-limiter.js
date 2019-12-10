import get from 'lodash.get';
import ms from 'ms';
import { InMemoryStore } from './in-memory-store';
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
    { args, context, info }, 
    // Field level config (e.g. the directive parameters)
    { arrayLengthField, identityArgs, max, window, message }) => {
        // Identify the user or client on the context
        const contextIdentity = identifyContext(context);
        // User defined window in ms that this field can be accessed for before the call is expired
        const windowMs = (window ? ms(window) : DEFAULT_WINDOW);
        // String key for this field
        const fieldIdentity = getFieldIdentity(info.fieldName, identityArgs || DEFAULT_FIELD_IDENTITY_ARGS, args);
        // User configured maximum calls to this field
        const maxCalls = max || DEFAULT_MAX;
        // Call count could be determined by the lenght of the array value, but most commonly 1
        const callCount = (arrayLengthField && get(args, [arrayLengthField, 'length'])) || 1;
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
            reset: async () => {
                const timestamps = await store.getForIdentity(identity);
                const remainingTimestamps = timestamps.filter(t => t !== timestamp);
                return store.setForIdentity(identity, remainingTimestamps.length
                    ? remainingTimestamps
                    : [timestamp + windowMs], windowMs);
            }
        };
    };
    return rateLimiter;
};
export { getGraphQLRateLimiter, getFieldIdentity };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWdyYXBocWwtcmF0ZS1saW1pdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9nZXQtZ3JhcGhxbC1yYXRlLWxpbWl0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxHQUFHLE1BQU0sWUFBWSxDQUFDO0FBQzdCLE9BQU8sRUFBRSxNQUFNLElBQUksQ0FBQztBQUNwQixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFRbEQsd0JBQXdCO0FBQ3hCLE1BQU0sY0FBYyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFDakMsTUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDO0FBQ3RCLE1BQU0sMkJBQTJCLEdBQXNCLEVBQUUsQ0FBQztBQUUxRDs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxNQUFNLGdCQUFnQixHQUFHLENBQ3ZCLFNBQWlCLEVBQ2pCLFlBQStCLEVBQy9CLFdBQWdCLEVBQ2hCLEVBQUU7SUFDRixNQUFNLE9BQU8sR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQy9ELE9BQU8sQ0FBQyxTQUFTLEVBQUUsR0FBRyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM0MsQ0FBQyxDQUFDO0FBRUY7Ozs7R0FJRztBQUNILE1BQU0scUJBQXFCLEdBQUc7QUFDNUIsNEVBQTRFO0FBQzVFLFVBQWtDLEVBQ2xDLEVBQUU7SUFDRiwyQkFBMkI7SUFDM0IsTUFBTSxhQUFhLEdBQUc7UUFDcEIsV0FBVyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQW9CLEVBQUUsRUFBRTtZQUMvQyxPQUFPLDZCQUE2QixTQUFTLGFBQWEsQ0FBQztRQUM3RCxDQUFDO1FBQ0QsV0FBVztRQUNYLGVBQWUsRUFBRSxHQUFHLEVBQUU7WUFDcEIsTUFBTSxJQUFJLEtBQUssQ0FDYixzRUFBc0UsQ0FDdkUsQ0FBQztRQUNKLENBQUM7UUFDRCxLQUFLLEVBQUUsSUFBSSxhQUFhLEVBQUU7S0FDM0IsQ0FBQztJQUVGLE1BQU0sRUFBRSxlQUFlLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxHQUFHO1FBQzlDLEdBQUcsYUFBYTtRQUNoQixHQUFHLFVBQVU7S0FDZCxDQUFDO0lBRUY7Ozs7T0FJRztJQUNILE1BQU0sV0FBVyxHQUFHLEtBQUs7SUFDdkIsZ0JBQWdCO0lBQ2hCLEVBQ0UsSUFBSSxFQUNKLE9BQU8sRUFDUCxJQUFJLEVBTUw7SUFDRCxxREFBcUQ7SUFDckQsRUFDRSxnQkFBZ0IsRUFDaEIsWUFBWSxFQUNaLEdBQUcsRUFDSCxNQUFNLEVBQ04sT0FBTyxFQUN1QixFQUkvQixFQUFFO1FBQ0gsNkNBQTZDO1FBQzdDLE1BQU0sZUFBZSxHQUFHLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNqRCwyRkFBMkY7UUFDM0YsTUFBTSxRQUFRLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFXLENBQUM7UUFDbEUsNEJBQTRCO1FBQzVCLE1BQU0sYUFBYSxHQUFHLGdCQUFnQixDQUNwQyxJQUFJLENBQUMsU0FBUyxFQUNkLFlBQVksSUFBSSwyQkFBMkIsRUFDM0MsSUFBSSxDQUNMLENBQUM7UUFFRiw4Q0FBOEM7UUFDOUMsTUFBTSxRQUFRLEdBQUcsR0FBRyxJQUFJLFdBQVcsQ0FBQztRQUNwQyx1RkFBdUY7UUFDdkYsTUFBTSxTQUFTLEdBQ2IsQ0FBQyxnQkFBZ0IsSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyRSxpREFBaUQ7UUFDakQsTUFBTSxRQUFRLEdBQWEsRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUFFLENBQUM7UUFDOUQsb0VBQW9FO1FBQ3BFLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxLQUFLLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlELG1EQUFtRDtRQUNuRCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDN0IseUVBQXlFO1FBQ3pFLE1BQU0sYUFBYSxHQUFHLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDMUUsNkNBQTZDO1FBQzdDLE1BQU0sd0JBQXdCLEdBQW1CO1lBQy9DLEdBQUcsYUFBYTtZQUNoQixHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDN0IsT0FBTyxDQUFDLEdBQUcsUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNuQyxDQUFDLENBQUM7U0FDSCxDQUFDO1FBRUYsK0JBQStCO1FBQy9CLE1BQU0sS0FBSyxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsd0JBQXdCLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFekUsNkRBQTZEO1FBQzdELE1BQU0sWUFBWSxHQUNoQixPQUFPO1lBQ1AsV0FBVyxDQUFDO2dCQUNWLGVBQWU7Z0JBQ2YsYUFBYTtnQkFDYixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7Z0JBQ3pCLEdBQUcsRUFBRSxRQUFRO2dCQUNiLE1BQU0sRUFBRSxRQUFRO2FBQ2pCLENBQUMsQ0FBQztRQUVMLG9EQUFvRDtRQUNwRCxPQUFPO1lBQ0wsWUFBWSxFQUNWLHdCQUF3QixDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsU0FBUztZQUN2RSxLQUFLLEVBQUUsS0FBSyxJQUFJLEVBQUU7Z0JBQ2hCLE1BQU0sVUFBVSxHQUFHLE1BQU0sS0FBSyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDeEQsTUFBTSxtQkFBbUIsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDO2dCQUNwRSxPQUFPLEtBQUssQ0FBQyxjQUFjLENBQ3pCLFFBQVEsRUFDUixtQkFBbUIsQ0FBQyxNQUFNO29CQUN4QixDQUFDLENBQUMsbUJBQW1CO29CQUNyQixDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLEVBQzFCLFFBQVEsQ0FDVCxDQUFDO1lBQ0osQ0FBQztTQUNGLENBQUM7SUFDSixDQUFDLENBQUM7SUFFRixPQUFPLFdBQVcsQ0FBQztBQUNyQixDQUFDLENBQUM7QUFFRixPQUFPLEVBQUUscUJBQXFCLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQyJ9