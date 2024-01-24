import { injectable } from "inversify";
import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-register.dto";
import { User } from "./user.entity";
import { IUserService } from "./user.service.interface";

@injectable()
export class UserService implements IUserService {
	async createUser({ email, name, password }: UserRegisterDto): Promise<User | null> {
		const newUser = new User(email, name);
		await newUser.setPassword(password);
		// check if it exist?
		// if exists - return null
		// if not - create User
		return newUser;
	}
	async validateUser(dto: UserLoginDto): Promise<boolean> {
		return true;
	}
}
