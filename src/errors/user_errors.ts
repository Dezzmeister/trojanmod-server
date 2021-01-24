export class UserExistsError extends Error {
	constructor(message: string) {
		super();
		this.name = "User exists";
		this.message = message;
	}
}

export class UserDoesNotExistError extends Error {
	constructor(message: string) {
		super();
		this.name = "User does not exist";
		this.message = message;
	}
}

export class BadPasswordError extends Error {
	constructor(message: string) {
		super();
		this.name = "Bad password";
		this.message = message;
	}
}
