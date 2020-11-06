import bcrypt from "bcrypt";
import { Role, User } from "../entity/User";
import { createEntityManager } from "./database";

export interface UserData {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
}

const SALT_ROUNDS = 20;

export async function createUser(data: UserData): Promise<User> {
	const { email, password, firstName, lastName } = data;

	const userData = {
		email,
		firstName,
		lastName,
		passwordHash: "",
		passwordSalt: "",
		role: Role.USER
	};

	const em = await createEntityManager();
	const user = await em.getRepository(User).save(userData);

	bcrypt.genSalt(SALT_ROUNDS, function (err: Error, salt: string) {
		bcrypt.hash(password, salt, async function (err: Error, hash: string) {
			const userData = {
				email,
				passwordHash: hash,
				passwordSalt: salt
			};

			await em.getRepository(User).save(userData);
		});
	});

	return user;
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
