import { ConfigService } from "./../config/config.service";
import { NextFunction, Request, Response } from "express";
import { BaseController } from "../common/base.controller";
import { HTTPError } from "../errors/http-error.class";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { ILogger } from "../logger/logger.interface";
import { IUserController } from "./users.controller.interface";
import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-register.dto";
import { UserService } from "./users.service";
import "reflect-metadata";
import { ValidateMiddleware } from "../common/validate.middleware";
import { sign } from "jsonwebtoken";
import { AuthGuard } from "../common/auth.guard";

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: UserService,
		@inject(TYPES.ConfigService) private configService: ConfigService
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: "/register",
				method: "post",
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)]
			},
			{
				path: "/login",
				method: "post",
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)]
			},
			{
				path: "/info",
				method: "get",
				func: this.info,
				middlewares: [new AuthGuard()]
			}
		]);
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const result = await this.userService.createUser(body);

		if (!result) {
			return next(new HTTPError(422, "Такой пользователь уже существует", "register"));
		}

		this.ok(res, { email: result.email, id: result.id });
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const result = await this.userService.validateUser(body);

		if (!result) {
			return next(new HTTPError(401, "ошибка авторизации", "login"));
		}

		const jwt = await this.signJWT(body.email, this.configService.get("SECRET"));
		this.ok(res, { jwt });
	}

	async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		const userInfo = await this.userService.getUserInfo(user);
		this.ok(res, { email: userInfo?.email, id: userInfo?.id });
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000)
				},
				secret,
				{ algorithm: "HS256" },
				(err, token) => {
					if (err) {
						reject(err);
					}
					resolve(token as string);
				}
			);
		});
	}
}
