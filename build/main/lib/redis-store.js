"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RedisStore {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(redisStoreInstance) {
        this.nameSpacedKeyPrefix = 'redis-store-id::';
        this.generateNamedSpacedKey = (identity) => {
            return `${this.nameSpacedKeyPrefix}${identity.contextIdentity}:${identity.fieldIdentity}`;
        };
        this.store = redisStoreInstance;
    }
    setForIdentity(identity, timestamps, windowMs) {
        return new Promise((res, rej) => {
            const expiry = windowMs
                ? [
                    'EX',
                    Math.ceil((Date.now() + windowMs - Math.max(...timestamps)) / 1000)
                ]
                : [];
            this.store.set([
                this.generateNamedSpacedKey(identity),
                JSON.stringify([...timestamps]),
                ...expiry
            ], (err) => {
                if (err)
                    return rej(err);
                return res();
            });
        });
    }
    async getForIdentity(identity) {
        return new Promise((res, rej) => {
            this.store.get(this.generateNamedSpacedKey(identity), 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (err, obj) => {
                if (err) {
                    return rej(err);
                }
                return res(obj ? JSON.parse(obj) : []);
            });
        });
    }
}
exports.RedisStore = RedisStore;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkaXMtc3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3JlZGlzLXN0b3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0EsTUFBTSxVQUFVO0lBTWQsOERBQThEO0lBQzlELFlBQW1CLGtCQUF1QjtRQUh6Qix3QkFBbUIsR0FBVyxrQkFBa0IsQ0FBQztRQXNEakQsMkJBQXNCLEdBQUcsQ0FBQyxRQUFrQixFQUFVLEVBQUU7WUFDdkUsT0FBTyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxRQUFRLENBQUMsZUFBZSxJQUMzRCxRQUFRLENBQUMsYUFDWCxFQUFFLENBQUM7UUFDTCxDQUFDLENBQUM7UUF0REEsSUFBSSxDQUFDLEtBQUssR0FBRyxrQkFBa0IsQ0FBQztJQUNsQyxDQUFDO0lBRU0sY0FBYyxDQUNuQixRQUFrQixFQUNsQixVQUE2QixFQUM3QixRQUFpQjtRQUVqQixPQUFPLElBQUksT0FBTyxDQUNoQixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQVEsRUFBRTtZQUNqQixNQUFNLE1BQU0sR0FBRyxRQUFRO2dCQUNyQixDQUFDLENBQUM7b0JBQ0UsSUFBSTtvQkFDSixJQUFJLENBQUMsSUFBSSxDQUNQLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQ3pEO2lCQUNGO2dCQUNILENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDUCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FDWjtnQkFDRSxJQUFJLENBQUMsc0JBQXNCLENBQUMsUUFBUSxDQUFDO2dCQUNyQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQztnQkFDL0IsR0FBRyxNQUFNO2FBQ1YsRUFDRCxDQUFDLEdBQWlCLEVBQVEsRUFBRTtnQkFDMUIsSUFBSSxHQUFHO29CQUFFLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN6QixPQUFPLEdBQUcsRUFBRSxDQUFDO1lBQ2YsQ0FBQyxDQUNGLENBQUM7UUFDSixDQUFDLENBQ0YsQ0FBQztJQUNKLENBQUM7SUFFTSxLQUFLLENBQUMsY0FBYyxDQUFDLFFBQWtCO1FBQzVDLE9BQU8sSUFBSSxPQUFPLENBQ2hCLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBUSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUNaLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLENBQUM7WUFDckMsOERBQThEO1lBQzlELENBQUMsR0FBaUIsRUFBRSxHQUFRLEVBQVEsRUFBRTtnQkFDcEMsSUFBSSxHQUFHLEVBQUU7b0JBQ1AsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ2pCO2dCQUNELE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDekMsQ0FBQyxDQUNGLENBQUM7UUFDSixDQUFDLENBQ0YsQ0FBQztJQUNKLENBQUM7Q0FPRjtBQUVRLGdDQUFVIn0=