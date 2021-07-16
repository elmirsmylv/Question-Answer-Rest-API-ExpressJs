import bcrypt from "bcrypt";

export const validateUserinputs = (email, password) => {
  return email && password;
};

export const comparePasswords = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};
