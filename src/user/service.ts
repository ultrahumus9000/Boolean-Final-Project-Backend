import db from "../database";
import { hash } from "bcrypt";

const { user } = db;

type NewHost = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  bio?: string;
  hostRole: "host";
};

type NewGuest = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  bio?: string;
  guestRole: "guest";
};

async function createNewUserWithHash(newUser: NewHost | NewGuest) {
  const plainPassword = newUser.password;

  const hashedPasseword = await hash(plainPassword, 10);

  delete newUser.bio;

  const savedUser = await user.create({
    data: { ...newUser, password: hashedPasseword },
  });

  return savedUser;
}

export default createNewUserWithHash;
