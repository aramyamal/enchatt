import { HttpError } from "../errors/HttpError";
import { User } from "../model/user.interface";

export class UserService {

    private users: Map<string, User> = new Map();
    private currentId: number = 0;

    async createUser(username: string, password: string): Promise<User> {
        if (this.users.has(username)) {
            throw new HttpError(400, "Username already exists");
        }
        const newUser: User = {
            id: this.currentId++,
            username: username,
            password: password
        }
        this.users.set(username, newUser);
        return newUser;
    }
    async findUser(username: string, password?: string): Promise<User> {
        if (!password) {
            const user = this.users.get(username);
            if (!user) {
                throw new HttpError(400, "Username does not match");
            }
            return user;
        }

        const verifiedUser = this.users.get(username);
        if (!(verifiedUser?.password === password)) {
            throw new HttpError(400, "Username or password does not match")
        }
        return verifiedUser;
    }
}
