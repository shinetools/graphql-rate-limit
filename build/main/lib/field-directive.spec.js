"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line import/no-extraneous-dependencies
const ava_1 = __importDefault(require("ava"));
const graphql_tools_1 = require("graphql-tools");
const field_directive_1 = require("./field-directive");
ava_1.default('createRateLimitDirective', t => {
    const RateLimiter = field_directive_1.createRateLimitDirective();
    t.true(new RateLimiter({}) instanceof graphql_tools_1.SchemaDirectiveVisitor);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGQtZGlyZWN0aXZlLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2ZpZWxkLWRpcmVjdGl2ZS5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNkRBQTZEO0FBQzdELDhDQUF1QjtBQUN2QixpREFBdUQ7QUFDdkQsdURBQTZEO0FBRTdELGFBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDLENBQUMsRUFBRTtJQUNuQyxNQUFNLFdBQVcsR0FBRywwQ0FBd0IsRUFBRSxDQUFDO0lBQy9DLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxXQUFXLENBQUMsRUFBRSxDQUFDLFlBQVksc0NBQXNCLENBQUMsQ0FBQztBQUNoRSxDQUFDLENBQUMsQ0FBQyJ9