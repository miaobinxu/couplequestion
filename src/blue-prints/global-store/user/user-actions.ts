import { UserData } from "./user";

export interface UserActions {
  updateUser: (user: Partial<UserData>) => void;
  resetUser: () => void;
}
