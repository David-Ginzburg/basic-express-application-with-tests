import { inject, injectable } from "inversify";
import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-register.dto";
import { User } from "./user.entity";
import { IUserService } from "./user.service.interface";
import { IConfigService } from "../config/config.service.interface";
import { TYPES } from "../types";

@injectable()
export class UserService implements IUserService {
	constructor(@inject(TYPES.ConfigService) private configService: IConfigService) {}
	async createUser({ email, name, password }: UserRegisterDto): Promise<User | null> {
		const newUser = new User(email, name);
		const salt = this.configService.get<number>("SALT");
		await newUser.setPassword(password, salt);
		// check if it exist?
		// if exists - return null
		// if not - create User
		return newUser;
	}
	async validateUser(dto: UserLoginDto): Promise<boolean> {
		return true;
	}
}
