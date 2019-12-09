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
export { RedisStore };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkaXMtc3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3JlZGlzLXN0b3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBLE1BQU0sVUFBVTtJQU1kLDhEQUE4RDtJQUM5RCxZQUFtQixrQkFBdUI7UUFIekIsd0JBQW1CLEdBQVcsa0JBQWtCLENBQUM7UUFzRGpELDJCQUFzQixHQUFHLENBQUMsUUFBa0IsRUFBVSxFQUFFO1lBQ3ZFLE9BQU8sR0FBRyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsUUFBUSxDQUFDLGVBQWUsSUFDM0QsUUFBUSxDQUFDLGFBQ1gsRUFBRSxDQUFDO1FBQ0wsQ0FBQyxDQUFDO1FBdERBLElBQUksQ0FBQyxLQUFLLEdBQUcsa0JBQWtCLENBQUM7SUFDbEMsQ0FBQztJQUVNLGNBQWMsQ0FDbkIsUUFBa0IsRUFDbEIsVUFBNkIsRUFDN0IsUUFBaUI7UUFFakIsT0FBTyxJQUFJLE9BQU8sQ0FDaEIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFRLEVBQUU7WUFDakIsTUFBTSxNQUFNLEdBQUcsUUFBUTtnQkFDckIsQ0FBQyxDQUFDO29CQUNFLElBQUk7b0JBQ0osSUFBSSxDQUFDLElBQUksQ0FDUCxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUN6RDtpQkFDRjtnQkFDSCxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQ1AsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQ1o7Z0JBQ0UsSUFBSSxDQUFDLHNCQUFzQixDQUFDLFFBQVEsQ0FBQztnQkFDckMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUM7Z0JBQy9CLEdBQUcsTUFBTTthQUNWLEVBQ0QsQ0FBQyxHQUFpQixFQUFRLEVBQUU7Z0JBQzFCLElBQUksR0FBRztvQkFBRSxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDekIsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNmLENBQUMsQ0FDRixDQUFDO1FBQ0osQ0FBQyxDQUNGLENBQUM7SUFDSixDQUFDO0lBRU0sS0FBSyxDQUFDLGNBQWMsQ0FBQyxRQUFrQjtRQUM1QyxPQUFPLElBQUksT0FBTyxDQUNoQixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQVEsRUFBRTtZQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FDWixJQUFJLENBQUMsc0JBQXNCLENBQUMsUUFBUSxDQUFDO1lBQ3JDLDhEQUE4RDtZQUM5RCxDQUFDLEdBQWlCLEVBQUUsR0FBUSxFQUFRLEVBQUU7Z0JBQ3BDLElBQUksR0FBRyxFQUFFO29CQUNQLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUNqQjtnQkFDRCxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3pDLENBQUMsQ0FDRixDQUFDO1FBQ0osQ0FBQyxDQUNGLENBQUM7SUFDSixDQUFDO0NBT0Y7QUFFRCxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMifQ==