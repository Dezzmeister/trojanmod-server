import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export enum Role {
	OWNER = "owner",
	ADMIN = "admin",
	USER = "user"
}

@Entity("user")
export class User {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ unique: true })
	email!: string;

	@Column({ name: "first_name" })
	firstName!: string;

	@Column({ name: "last_name" })
	lastName!: string;

	@Column({ name: "password_hash" })
	passwordHash!: string;

	@Column({ name: "password_salt" })
	passwordSalt!: string;

	@Column({ type: "enum", enum: Role, default: Role.USER })
	role!: Role;
}
