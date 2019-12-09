"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const graphql_tools_1 = require("graphql-tools");
const rate_limit_error_1 = require("./rate-limit-error");
const get_graphql_rate_limiter_1 = require("./get-graphql-rate-limiter");
/**
 * Returns the Directive to be passed to your GraphQL server.
 *
 * TODO: Fix `any` return type;
 * @param customConfig
 */
const createRateLimitDirective = (customConfig = {}) => {
    const rateLimiter = get_graphql_rate_limiter_1.getGraphQLRateLimiter(customConfig);
    class GraphQLRateLimit extends graphql_tools_1.SchemaDirectiveVisitor {
        static getDirectiveDeclaration(directiveName) {
            return new graphql_1.GraphQLDirective({
                args: {
                    arrayLengthField: {
                        type: graphql_1.GraphQLString
                    },
                    identityArgs: {
                        type: new graphql_1.GraphQLList(graphql_1.GraphQLString)
                    },
                    max: {
                        type: graphql_1.GraphQLInt
                    },
                    message: {
                        type: graphql_1.GraphQLString
                    },
                    window: {
                        type: graphql_1.GraphQLString
                    }
                },
                locations: [graphql_1.DirectiveLocation.FIELD_DEFINITION],
                name: directiveName
            });
        }
        visitFieldDefinition(field) {
            const { resolve = graphql_1.defaultFieldResolver } = field;
            // eslint-disable-next-line no-param-reassign
            field.resolve = async (parent, args, context, info) => {
                const { errorMessage, reset } = await rateLimiter({
                    parent,
                    args,
                    context,
                    info
                }, this.args);
                if (errorMessage) {
                    throw new rate_limit_error_1.RateLimitError(errorMessage);
                }
                return resolve(parent, args, Object.assign({}, context, { resetRateLimit: reset }), info);
            };
        }
    }
    return GraphQLRateLimit;
};
exports.createRateLimitDirective = createRateLimitDirective;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQtZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9maWVsZC1kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FRaUI7QUFDakIsaURBQXVEO0FBQ3ZELHlEQUFvRDtBQUVwRCx5RUFBbUU7QUFFbkU7Ozs7O0dBS0c7QUFDSCxNQUFNLHdCQUF3QixHQUFHLENBQy9CLGVBQXVDLEVBQUUsRUFDcEMsRUFBRTtJQUNQLE1BQU0sV0FBVyxHQUFHLGdEQUFxQixDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3hELE1BQU0sZ0JBQWlCLFNBQVEsc0NBQXNCO1FBQzVDLE1BQU0sQ0FBQyx1QkFBdUIsQ0FDbkMsYUFBcUI7WUFFckIsT0FBTyxJQUFJLDBCQUFnQixDQUFDO2dCQUMxQixJQUFJLEVBQUU7b0JBQ0osZ0JBQWdCLEVBQUU7d0JBQ2hCLElBQUksRUFBRSx1QkFBYTtxQkFDcEI7b0JBQ0QsWUFBWSxFQUFFO3dCQUNaLElBQUksRUFBRSxJQUFJLHFCQUFXLENBQUMsdUJBQWEsQ0FBQztxQkFDckM7b0JBQ0QsR0FBRyxFQUFFO3dCQUNILElBQUksRUFBRSxvQkFBVTtxQkFDakI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLElBQUksRUFBRSx1QkFBYTtxQkFDcEI7b0JBQ0QsTUFBTSxFQUFFO3dCQUNOLElBQUksRUFBRSx1QkFBYTtxQkFDcEI7aUJBQ0Y7Z0JBQ0QsU0FBUyxFQUFFLENBQUMsMkJBQWlCLENBQUMsZ0JBQWdCLENBQUM7Z0JBQy9DLElBQUksRUFBRSxhQUFhO2FBQ3BCLENBQUMsQ0FBQztRQUNMLENBQUM7UUFJTSxvQkFBb0IsQ0FBQyxLQUE2QjtZQUN2RCxNQUFNLEVBQUUsT0FBTyxHQUFHLDhCQUFvQixFQUFFLEdBQUcsS0FBSyxDQUFDO1lBQ2pELDZDQUE2QztZQUM3QyxLQUFLLENBQUMsT0FBTyxHQUFHLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRTtnQkFDcEQsTUFBTSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsR0FBRyxNQUFNLFdBQVcsQ0FDL0M7b0JBQ0UsTUFBTTtvQkFDTixJQUFJO29CQUNKLE9BQU87b0JBQ1AsSUFBSTtpQkFDTCxFQUNELElBQUksQ0FBQyxJQUFJLENBQ1YsQ0FBQztnQkFFRixJQUFJLFlBQVksRUFBRTtvQkFDaEIsTUFBTSxJQUFJLGlDQUFjLENBQUMsWUFBWSxDQUFDLENBQUM7aUJBQ3hDO2dCQUVELE9BQU8sT0FBTyxDQUNaLE1BQU0sRUFDTixJQUFJLG9CQUNDLE9BQU8sSUFBRSxjQUFjLEVBQUUsS0FBSyxLQUNuQyxJQUFJLENBQ0wsQ0FBQztZQUNKLENBQUMsQ0FBQztRQUNKLENBQUM7S0FDRjtJQUNELE9BQU8sZ0JBQWdCLENBQUM7QUFDMUIsQ0FBQyxDQUFDO0FBRU8sNERBQXdCIn0=