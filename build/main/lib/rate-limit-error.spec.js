"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-extraneous-dependencies */
const ava_1 = __importDefault(require("ava"));
const rate_limit_error_1 = require("./rate-limit-error");
ava_1.default('RateLimitError is an Error', t => {
    t.true(new rate_limit_error_1.RateLimitError('Some message') instanceof Error);
});
ava_1.default('RateLimitError.isRateLimitError is true', t => {
    t.true(new rate_limit_error_1.RateLimitError('Some message').isRateLimitError);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmF0ZS1saW1pdC1lcnJvci5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9yYXRlLWxpbWl0LWVycm9yLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxzREFBc0Q7QUFDdEQsOENBQXVCO0FBQ3ZCLHlEQUFvRDtBQUVwRCxhQUFJLENBQUMsNEJBQTRCLEVBQUUsQ0FBQyxDQUFDLEVBQUU7SUFDckMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLGlDQUFjLENBQUMsY0FBYyxDQUFDLFlBQVksS0FBSyxDQUFDLENBQUM7QUFDOUQsQ0FBQyxDQUFDLENBQUM7QUFFSCxhQUFJLENBQUMseUNBQXlDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7SUFDbEQsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLGlDQUFjLENBQUMsY0FBYyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUM5RCxDQUFDLENBQUMsQ0FBQyJ9