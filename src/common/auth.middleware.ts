import { Response, NextFunction, Request } from "express";
import { IMiddleWare } from "./middleware.interface";
import { verify } from "jsonwebtoken";

export class AuthMiddleware implements IMiddleWare {
	constructor(private secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			verify(req.headers.authorization.split(" ")[1], this.secret, (err, payload) => {
				if (err) {
					next();
				} else if (payload) {
					if (typeof payload !== "string") {
						req.user = payload.email;
						next();
					} else {
						next();
					}
				}
			});
		} else {
			next();
		}
	}
}
