import { NextFunction, Request, Response } from "express";
import { BaseController } from "../common/base.controller";
import { HTTPError } from "../errors/http-error.class";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { ILogger } from "../logger/logger.interface";
import "reflect-metadata";
import { IUserController } from "./users.controller.interface";
import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-register.dto";
import { User } from "./user.entity";
import { UserService } from "./users.service";

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private UserService: UserService
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: "/register",
				method: "post",
				func: this.register
			},
			{
				path: "/login",
				method: "post",
				func: this.login
			}
		]);
	}

	login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
		console.log(req.body);
		next(new HTTPError(401, "ошибка авторизации", "login"));
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const result = await this.UserService.createUser(body);
		if (!result) {
			return next(new HTTPError(422, "Такой пользователь уже существует"));
		}
		this.ok(res, result);
	}
}
