"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InMemoryStore {
    constructor() {
        // The store is mutable.
        // tslint:disable-next-line readonly-keyword
        this.state = {};
    }
    setForIdentity(identity, timestamps) {
        // tslint:disable-next-line no-object-mutation
        this.state = Object.assign({}, (this.state || {}), { [identity.contextIdentity]: Object.assign({}, (this.state[identity.contextIdentity] || {}), { [identity.fieldIdentity]: [...timestamps] }) });
    }
    getForIdentity(identity) {
        const ctxState = this.state[identity.contextIdentity];
        return (ctxState && ctxState[identity.fieldIdentity]) || [];
    }
}
exports.InMemoryStore = InMemoryStore;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW4tbWVtb3J5LXN0b3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9pbi1tZW1vcnktc3RvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFXQSxNQUFNLGFBQWE7SUFBbkI7UUFDRSx3QkFBd0I7UUFDeEIsNENBQTRDO1FBQ3JDLFVBQUssR0FBYyxFQUFFLENBQUM7SUFvQi9CLENBQUM7SUFsQlEsY0FBYyxDQUNuQixRQUFrQixFQUNsQixVQUE2QjtRQUU3Qiw4Q0FBOEM7UUFDOUMsSUFBSSxDQUFDLEtBQUsscUJBQ0wsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxJQUNyQixDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsb0JBQ3JCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxDQUFDLElBQy9DLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsTUFFNUMsQ0FBQztJQUNKLENBQUM7SUFFTSxjQUFjLENBQUMsUUFBa0I7UUFDdEMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDdEQsT0FBTyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzlELENBQUM7Q0FDRjtBQUVRLHNDQUFhIn0=