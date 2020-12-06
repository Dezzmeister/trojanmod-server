import bcrypt from "bcryptjs";
import { Role, User } from "../entity/User";
import {
	BadPasswordError,
	UserDoesNotExistError,
	UserExistsError
} from "../errors/user_errors";
import { createEntityManager } from "./database";
import { bannedNames } from "./names";

export interface UserData {
	username: string;
	password: string;
	firstName: string;
	lastName: string;
}

const SALT_ROUNDS = 12;

export async function createUser(data: UserData): Promise<User> {
	const { username, password, firstName, lastName } = data;

	const salt = bcrypt.genSaltSync(SALT_ROUNDS);
	const hash = bcrypt.hashSync(password, salt);

	const userData = {
		username,
		firstName,
		lastName,
		passwordHash: hash,
		role: Role.USER
	};

	const em = await createEntityManager();

	const existingUser = await em.getRepository(User).findOne({ username });
	if (existingUser || bannedNames.includes(username)) {
		throw new UserExistsError();
	}

	const user = await em.getRepository(User).save(userData);

	return user;
}

export async function checkLogin(
	username: string,
	password: string
): Promise<User> {
	const em = await createEntityManager();
	const existingUser = await em.getRepository(User).findOne({ username });

	if (!existingUser) {
		throw new UserDoesNotExistError();
	}

	if (bcrypt.compareSync(password, existingUser.passwordHash)) {
		return existingUser;
	}

	throw new BadPasswordError();
}

export async function getUserByUsername(
	username: string
): Promise<User | undefined> {
	const em = await createEntityManager();
	const user = await em
		.getRepository(User)
		.createQueryBuilder("user")
		.where("user.username = :username", { username })
		.getOne();

	return user;
}
