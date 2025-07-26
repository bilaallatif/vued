import User from "../types/user";

export class UserService {
  public get(): User {
    return { name: "test" };
  }
}
