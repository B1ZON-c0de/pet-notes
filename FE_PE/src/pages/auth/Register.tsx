import axios from "axios";
import { ROUTES } from "../../routes";
import { BaseAuth, type FormValues } from "../../components/BaseAuth";
import { useNavigate } from "react-router";
import { ROUTES_BACKEND } from "../../routesBackend";
import type { RespondBackend } from "../../types";

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
  const navigate = useNavigate();
  const registerFn = async (values: FormValues) => {
    try {
      const res = await axios.post<RespondBackend<null>>(
        ROUTES_BACKEND.register,
        values,
      );

      if (res.data.success) navigate(ROUTES.notes, { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error(err.response?.data);
      }
    }
  };
  return (
    <BaseAuth
      pageLabel="Регистрация в NOTES"
      submitLabel="Регистрация"
      descNav={descNav}
      fields={registerFields}
      submitFn={registerFn}
    />
  );
};

export default Register;
