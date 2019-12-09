import { defaultFieldResolver, DirectiveLocation, GraphQLDirective, GraphQLInt, GraphQLList, GraphQLString } from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';
import { RateLimitError } from './rate-limit-error';
import { getGraphQLRateLimiter } from './get-graphql-rate-limiter';
/**
 * Returns the Directive to be passed to your GraphQL server.
 *
 * TODO: Fix `any` return type;
 * @param customConfig
 */
const createRateLimitDirective = (customConfig = {}) => {
    const rateLimiter = getGraphQLRateLimiter(customConfig);
    class GraphQLRateLimit extends SchemaDirectiveVisitor {
        static getDirectiveDeclaration(directiveName) {
            return new GraphQLDirective({
                args: {
                    arrayLengthField: {
                        type: GraphQLString
                    },
                    identityArgs: {
                        type: new GraphQLList(GraphQLString)
                    },
                    max: {
                        type: GraphQLInt
                    },
                    message: {
                        type: GraphQLString
                    },
                    window: {
                        type: GraphQLString
                    }
                },
                locations: [DirectiveLocation.FIELD_DEFINITION],
                name: directiveName
            });
        }
        visitFieldDefinition(field) {
            const { resolve = defaultFieldResolver } = field;
            // eslint-disable-next-line no-param-reassign
            field.resolve = async (parent, args, context, info) => {
                const { errorMessage, reset } = await rateLimiter({
                    parent,
                    args,
                    context,
                    info
                }, this.args);
                if (errorMessage) {
                    throw new RateLimitError(errorMessage);
                }
                return resolve(parent, args, { ...context, resetRateLimit: reset }, info);
            };
        }
    }
    return GraphQLRateLimit;
};
export { createRateLimitDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQtZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9maWVsZC1kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLG9CQUFvQixFQUNwQixpQkFBaUIsRUFDakIsZ0JBQWdCLEVBRWhCLFVBQVUsRUFDVixXQUFXLEVBQ1gsYUFBYSxFQUNkLE1BQU0sU0FBUyxDQUFDO0FBQ2pCLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN2RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFcEQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFFbkU7Ozs7O0dBS0c7QUFDSCxNQUFNLHdCQUF3QixHQUFHLENBQy9CLGVBQXVDLEVBQUUsRUFDcEMsRUFBRTtJQUNQLE1BQU0sV0FBVyxHQUFHLHFCQUFxQixDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3hELE1BQU0sZ0JBQWlCLFNBQVEsc0JBQXNCO1FBQzVDLE1BQU0sQ0FBQyx1QkFBdUIsQ0FDbkMsYUFBcUI7WUFFckIsT0FBTyxJQUFJLGdCQUFnQixDQUFDO2dCQUMxQixJQUFJLEVBQUU7b0JBQ0osZ0JBQWdCLEVBQUU7d0JBQ2hCLElBQUksRUFBRSxhQUFhO3FCQUNwQjtvQkFDRCxZQUFZLEVBQUU7d0JBQ1osSUFBSSxFQUFFLElBQUksV0FBVyxDQUFDLGFBQWEsQ0FBQztxQkFDckM7b0JBQ0QsR0FBRyxFQUFFO3dCQUNILElBQUksRUFBRSxVQUFVO3FCQUNqQjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1AsSUFBSSxFQUFFLGFBQWE7cUJBQ3BCO29CQUNELE1BQU0sRUFBRTt3QkFDTixJQUFJLEVBQUUsYUFBYTtxQkFDcEI7aUJBQ0Y7Z0JBQ0QsU0FBUyxFQUFFLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUM7Z0JBQy9DLElBQUksRUFBRSxhQUFhO2FBQ3BCLENBQUMsQ0FBQztRQUNMLENBQUM7UUFJTSxvQkFBb0IsQ0FBQyxLQUE2QjtZQUN2RCxNQUFNLEVBQUUsT0FBTyxHQUFHLG9CQUFvQixFQUFFLEdBQUcsS0FBSyxDQUFDO1lBQ2pELDZDQUE2QztZQUM3QyxLQUFLLENBQUMsT0FBTyxHQUFHLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRTtnQkFDcEQsTUFBTSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsR0FBRyxNQUFNLFdBQVcsQ0FDL0M7b0JBQ0UsTUFBTTtvQkFDTixJQUFJO29CQUNKLE9BQU87b0JBQ1AsSUFBSTtpQkFDTCxFQUNELElBQUksQ0FBQyxJQUFJLENBQ1YsQ0FBQztnQkFFRixJQUFJLFlBQVksRUFBRTtvQkFDaEIsTUFBTSxJQUFJLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztpQkFDeEM7Z0JBRUQsT0FBTyxPQUFPLENBQ1osTUFBTSxFQUNOLElBQUksRUFDSixFQUFFLEdBQUcsT0FBTyxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsRUFDckMsSUFBSSxDQUNMLENBQUM7WUFDSixDQUFDLENBQUM7UUFDSixDQUFDO0tBQ0Y7SUFDRCxPQUFPLGdCQUFnQixDQUFDO0FBQzFCLENBQUMsQ0FBQztBQUVGLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxDQUFDIn0=