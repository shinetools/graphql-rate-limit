import { Store } from './store';
import { Identity } from './types';
declare class RedisStore implements Store {
    store: any;
    private readonly nameSpacedKeyPrefix;
    constructor(redisStoreInstance: any);
    setForIdentity(identity: Identity, timestamps: readonly number[], windowMs?: number): Promise<void>;
    getForIdentity(identity: Identity): Promise<readonly number[]>;
    private readonly generateNamedSpacedKey;
}
export { RedisStore };
