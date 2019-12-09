"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line import/no-extraneous-dependencies
const ava_1 = __importDefault(require("ava"));
const rate_limit_shield_rule_1 = require("./rate-limit-shield-rule");
ava_1.default('createRateLimitRule', t => {
    const rule = rate_limit_shield_rule_1.createRateLimitRule({
        identifyContext: ctx => ctx.id
    });
    t.true(typeof rule === 'function');
    const fieldRule = rule({ max: 1, window: '1s' });
    t.true(fieldRule.cache === 'no_cache');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmF0ZS1saW1pdC1zaGllbGQtcnVsZS5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9yYXRlLWxpbWl0LXNoaWVsZC1ydWxlLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw2REFBNkQ7QUFDN0QsOENBQXVCO0FBQ3ZCLHFFQUErRDtBQUUvRCxhQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLEVBQUU7SUFDOUIsTUFBTSxJQUFJLEdBQUcsNENBQW1CLENBQUM7UUFDL0IsZUFBZSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUU7S0FDL0IsQ0FBQyxDQUFDO0lBQ0gsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksS0FBSyxVQUFVLENBQUMsQ0FBQztJQUNuQyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ2pELENBQUMsQ0FBQyxJQUFJLENBQUUsU0FBaUIsQ0FBQyxLQUFLLEtBQUssVUFBVSxDQUFDLENBQUM7QUFDbEQsQ0FBQyxDQUFDLENBQUMifQ==