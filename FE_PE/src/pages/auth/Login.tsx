import { ROUTES } from "../../routes";
import { BaseAuth } from "./BaseAuth";

const descNav = {
  textNav: "Ёще нет аккаунта?",
  labelLink: "Регистрация",
  path: ROUTES.register,
};

const loginFields = {
  email: {
    label: "Email",
    initialValue: "",
    placeholder: "user@mail.com",
  },
  password: {
    label: "Пароль",
    initialValue: "",
  },
};

const Login = () => {
  return (
    <BaseAuth
      pageLabel="Вход в NOTES"
      submitLabel="Войти"
      descNav={descNav}
      fields={loginFields}
    />
  );
};

export default Login;
