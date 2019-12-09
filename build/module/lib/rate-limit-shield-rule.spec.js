// eslint-disable-next-line import/no-extraneous-dependencies
import test from 'ava';
import { createRateLimitRule } from './rate-limit-shield-rule';
test('createRateLimitRule', t => {
    const rule = createRateLimitRule({
        identifyContext: ctx => ctx.id
    });
    t.true(typeof rule === 'function');
    const fieldRule = rule({ max: 1, window: '1s' });
    t.true(fieldRule.cache === 'no_cache');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmF0ZS1saW1pdC1zaGllbGQtcnVsZS5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9yYXRlLWxpbWl0LXNoaWVsZC1ydWxlLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsNkRBQTZEO0FBQzdELE9BQU8sSUFBSSxNQUFNLEtBQUssQ0FBQztBQUN2QixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUUvRCxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLEVBQUU7SUFDOUIsTUFBTSxJQUFJLEdBQUcsbUJBQW1CLENBQUM7UUFDL0IsZUFBZSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUU7S0FDL0IsQ0FBQyxDQUFDO0lBQ0gsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksS0FBSyxVQUFVLENBQUMsQ0FBQztJQUNuQyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ2pELENBQUMsQ0FBQyxJQUFJLENBQUUsU0FBaUIsQ0FBQyxLQUFLLEtBQUssVUFBVSxDQUFDLENBQUM7QUFDbEQsQ0FBQyxDQUFDLENBQUMifQ==