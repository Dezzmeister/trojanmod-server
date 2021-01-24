import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("user")
export class User {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ unique: true })
	username!: string;

	@Column({ name: "first_name" })
	firstName!: string;

	@Column({ name: "last_name" })
	lastName!: string;

	@Column({ name: "password_hash" })
	passwordHash!: string;

	@Column("text", { name: "permissions", array: true })
	permissions!: string[];
}
