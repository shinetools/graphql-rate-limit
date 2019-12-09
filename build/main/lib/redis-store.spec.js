"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-extraneous-dependencies */
const ava_1 = __importDefault(require("ava"));
const redis_mock_1 = __importDefault(require("redis-mock"));
const redis_store_1 = require("./redis-store");
ava_1.default('RedisStore sets and gets correct timestamps', async (t) => {
    const storeInstance = new redis_store_1.RedisStore(redis_mock_1.default.createClient());
    await storeInstance.setForIdentity({ contextIdentity: 'foo', fieldIdentity: 'bar' }, [1, 2, 3]);
    t.deepEqual(await storeInstance.getForIdentity({
        contextIdentity: 'foo',
        fieldIdentity: 'bar'
    }), [1, 2, 3]);
    await storeInstance.setForIdentity({ contextIdentity: 'foo', fieldIdentity: 'bar2' }, [4, 5]);
    t.deepEqual(await storeInstance.getForIdentity({
        contextIdentity: 'foo',
        fieldIdentity: 'bar2'
    }), [4, 5]);
    await storeInstance.setForIdentity({ contextIdentity: 'foo', fieldIdentity: 'bar' }, [10, 20]);
    t.deepEqual(await storeInstance.getForIdentity({
        contextIdentity: 'foo',
        fieldIdentity: 'bar'
    }), [10, 20]);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkaXMtc3RvcmUuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvcmVkaXMtc3RvcmUuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHNEQUFzRDtBQUN0RCw4Q0FBdUI7QUFDdkIsNERBQStCO0FBQy9CLCtDQUEyQztBQUUzQyxhQUFJLENBQUMsNkNBQTZDLEVBQUUsS0FBSyxFQUFDLENBQUMsRUFBQyxFQUFFO0lBQzVELE1BQU0sYUFBYSxHQUFHLElBQUksd0JBQVUsQ0FBQyxvQkFBSyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7SUFFM0QsTUFBTSxhQUFhLENBQUMsY0FBYyxDQUNoQyxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxFQUNoRCxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQ1YsQ0FBQztJQUNGLENBQUMsQ0FBQyxTQUFTLENBQ1QsTUFBTSxhQUFhLENBQUMsY0FBYyxDQUFDO1FBQ2pDLGVBQWUsRUFBRSxLQUFLO1FBQ3RCLGFBQWEsRUFBRSxLQUFLO0tBQ3JCLENBQUMsRUFDRixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQ1YsQ0FBQztJQUVGLE1BQU0sYUFBYSxDQUFDLGNBQWMsQ0FDaEMsRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsRUFDakQsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQ1AsQ0FBQztJQUNGLENBQUMsQ0FBQyxTQUFTLENBQ1QsTUFBTSxhQUFhLENBQUMsY0FBYyxDQUFDO1FBQ2pDLGVBQWUsRUFBRSxLQUFLO1FBQ3RCLGFBQWEsRUFBRSxNQUFNO0tBQ3RCLENBQUMsRUFDRixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FDUCxDQUFDO0lBRUYsTUFBTSxhQUFhLENBQUMsY0FBYyxDQUNoQyxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxFQUNoRCxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FDVCxDQUFDO0lBQ0YsQ0FBQyxDQUFDLFNBQVMsQ0FDVCxNQUFNLGFBQWEsQ0FBQyxjQUFjLENBQUM7UUFDakMsZUFBZSxFQUFFLEtBQUs7UUFDdEIsYUFBYSxFQUFFLEtBQUs7S0FDckIsQ0FBQyxFQUNGLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUNULENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQyJ9