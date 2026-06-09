import axios from "axios";
import { ROUTES } from "../../routes";
import { BaseAuth } from "./BaseAuth";
import { ROUTES_BACKEND } from "../../routesBackend";
import type { RespondBackend } from "../../types";
import { useNavigate } from "react-router";

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
  const navigate = useNavigate();
  const loginFn = async (values) => {
    try {
      const res = await axios.post<RespondBackend<null>>(
        ROUTES_BACKEND.login,
        values,
      );

      if (res.data.success) {
        navigate(ROUTES.notes, { replace: true });
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error(err.response.data);
      }
    }
  };
  return (
    <BaseAuth
      pageLabel="Вход в NOTES"
      submitLabel="Войти"
      descNav={descNav}
      fields={loginFields}
      submitFn={loginFn}
    />
  );
};

export default Login;
