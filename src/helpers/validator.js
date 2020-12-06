import {
  REQUIRED_EMAIL,
  REQUIRED_FIRST_NAME,
  REQUIRED_LAST_NAME,
  REQUIRED_PASSWORD,
  PASSWORD_NOT_MATCH,
} from "../constants/messages";

export const validatorRegister = (user) => {
  const { firstName, lastName, email, password, passwordConfirm } = user;
  let errors = [];

  if (!firstName) {
    errors.push({ message: REQUIRED_FIRST_NAME });
  }
  if (!lastName) {
    errors.push({ message: REQUIRED_LAST_NAME });
  }
  if (!email) {
    errors.push({ message: REQUIRED_EMAIL });
  }
  if (!password || !passwordConfirm) {
    errors.push({ message: REQUIRED_PASSWORD });
  }
  if (password !== passwordConfirm) {
    errors.push({ message: PASSWORD_NOT_MATCH });
  }
  return errors;
};
