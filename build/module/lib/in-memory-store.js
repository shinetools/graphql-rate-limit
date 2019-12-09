class InMemoryStore {
    constructor() {
        // The store is mutable.
        // tslint:disable-next-line readonly-keyword
        this.state = {};
    }
    setForIdentity(identity, timestamps) {
        // tslint:disable-next-line no-object-mutation
        this.state = {
            ...(this.state || {}),
            [identity.contextIdentity]: {
                ...(this.state[identity.contextIdentity] || {}),
                [identity.fieldIdentity]: [...timestamps]
            }
        };
    }
    getForIdentity(identity) {
        const ctxState = this.state[identity.contextIdentity];
        return (ctxState && ctxState[identity.fieldIdentity]) || [];
    }
}
export { InMemoryStore };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW4tbWVtb3J5LXN0b3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9pbi1tZW1vcnktc3RvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBV0EsTUFBTSxhQUFhO0lBQW5CO1FBQ0Usd0JBQXdCO1FBQ3hCLDRDQUE0QztRQUNyQyxVQUFLLEdBQWMsRUFBRSxDQUFDO0lBb0IvQixDQUFDO0lBbEJRLGNBQWMsQ0FDbkIsUUFBa0IsRUFDbEIsVUFBNkI7UUFFN0IsOENBQThDO1FBQzlDLElBQUksQ0FBQyxLQUFLLEdBQUc7WUFDWCxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDckIsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUU7Z0JBQzFCLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQy9DLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUM7YUFDMUM7U0FDRixDQUFDO0lBQ0osQ0FBQztJQUVNLGNBQWMsQ0FBQyxRQUFrQjtRQUN0QyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN0RCxPQUFPLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDOUQsQ0FBQztDQUNGO0FBRUQsT0FBTyxFQUFFLGFBQWEsRUFBRSxDQUFDIn0=