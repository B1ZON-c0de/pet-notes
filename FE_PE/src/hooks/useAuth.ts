import { useMemo, useState } from "react";
import type { FormValidateInput, UseFormReturnType } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import axios from "axios";

interface BaseField {
  label: string;
  initialValue: string;
  placeholder?: string;
}

export interface FormValues {
  name?: string;
  email: string;
  password: string;
  repeatPassword?: string;
}

export interface FormFields {
  name?: BaseField;
  email: BaseField;
  password: BaseField;
  repeatPassword?: BaseField;
}

interface Props {
  submitFn: (values: FormValues) => Promise<void>;
  fields: FormFields;
}

const PASSWORD_LENGTH = 6;
const NAME_LENGTH = 2;
const ERR_INVALID_EMAIL = "Неверный email";
const ERR_INVALID_NAME = `Длина имени должна быть минимум ${NAME_LENGTH} символа`;
const ERR_INVALID_PASSWORD = `Длина пароля должна быть минимум ${PASSWORD_LENGTH} символов`;
const ERR_INVALID_REPEAT_PASSWORD = "Пароли должны совпадать";

export function useAuth({ fields, submitFn }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const initialFieldsVal: FormValues = useMemo(() => {
    return Object.entries(fields).reduce((acc, [key, field]) => {
      if (!field) return acc;
      acc[key as keyof FormValues] = field.initialValue;
      return acc;
    }, {} as FormValues);
  }, [fields]);

  const validateFields: FormValidateInput<FormValues> = useMemo(() => {
    return {
      password: (value: string) =>
        value.length < 6 ? ERR_INVALID_PASSWORD : null,
      email: (value: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : ERR_INVALID_EMAIL,
    };
  }, [fields]);

  if (fields.repeatPassword) {
    validateFields.repeatPassword = (value, values) =>
      value !== values.password ? ERR_INVALID_REPEAT_PASSWORD : null;
  }
  if (fields.name) {
    validateFields.name = (value) =>
      value && value.length < 2 ? ERR_INVALID_NAME : null;
  }

  const submitForm = async (
    values: FormValues,
    form: UseFormReturnType<FormValues>,
  ) => {
    notifications.clean();
    setIsLoading(true);
    try {
      await submitFn(values);
      form.reset();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        notifications.show({
          title: "Ошибка",
          message: err.response?.data.error.message,
          color: "red",
          className: "notif-error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, submitForm, initialFieldsVal, validateFields };
}
