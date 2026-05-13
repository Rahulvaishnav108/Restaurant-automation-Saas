// src/modules/users/users.model.ts

import { model } from "mongoose";
import { IUser, userSchema } from "./users.schema";

export const UserModel = model<IUser>("User", userSchema);