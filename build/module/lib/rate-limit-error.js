class RateLimitError extends Error {
    constructor(message) {
        super(message);
        this.isRateLimitError = true;
        Object.setPrototypeOf(this, RateLimitError.prototype);
    }
}
export { RateLimitError };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmF0ZS1saW1pdC1lcnJvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvcmF0ZS1saW1pdC1lcnJvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLGNBQWUsU0FBUSxLQUFLO0lBR2hDLFlBQW1CLE9BQWU7UUFDaEMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBSEQscUJBQWdCLEdBQUcsSUFBSSxDQUFDO1FBSXRDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN4RCxDQUFDO0NBQ0Y7QUFFRCxPQUFPLEVBQUUsY0FBYyxFQUFFLENBQUMifQ==