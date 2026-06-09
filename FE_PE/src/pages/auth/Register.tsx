import { ROUTES } from "../../routes";
import { BaseAuth } from "./BaseAuth";

const descNav = {
  textNav: "Уже есть аккаунт?",
  labelLink: "Войти",
  path: ROUTES.login,
};

const registerFields = {
  name: {
    label: "Имя",
    initialValue: "",
    placeholder: "username",
  },
  email: {
    label: "Email",
    initialValue: "",
    placeholder: "user@mail.com",
  },
  password: {
    label: "Пароль",
    initialValue: "",
  },
  repeatPassword: {
    label: "Повторите пароль",
    initialValue: "",
  },
};

const Register = () => {
  return (
    <BaseAuth
      pageLabel="Регистрация в NOTES"
      submitLabel="Регистрация"
      descNav={descNav}
      fields={registerFields}
    />
  );
};

export default Register;
