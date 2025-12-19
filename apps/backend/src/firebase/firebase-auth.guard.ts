import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import * as admin from "firebase-admin";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject('FIREBASE_ADMIN')
        private readonly firebaseAdmin: typeof admin
    ) {}
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const authHeader = req.headers['authorization'];

        if(!authHeader){
            throw new UnauthorizedException('Missing Authorization header');
        }

        const [type, token] = authHeader.split(' ');

        if(type !== 'Bearer' || !token){
            throw new UnauthorizedException('Invalid Authorization header');
        }

        try{
            const decoded = await this.firebaseAdmin
            .auth()
            .verifyIdToken(token);

            req.user = {
                uid: decoded.uid,
                email: decoded.email,
            };

            return true
        }
        catch{
            throw new UnauthorizedException('Invalid Firebase token');
        }
    }
}