import {
  Button,
  Fieldset,
  PasswordInput,
  Space,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, type FormValidateInput } from "@mantine/form";
import { Link } from "react-router";
import { ROUTES } from "../../routes";
import { useState } from "react";

interface BaseField {
  label: string;
  initialValue: string;
  placeholder?: string;
}

interface DescNav {
  textNav: string;
  labelLink: string;
  path: (typeof ROUTES)[keyof typeof ROUTES];
}

export interface FormValues {
  name?: string;
  email: string;
  password: string;
  repeatPassword?: string;
}

interface Props {
  pageLabel: string;
  submitLabel: string;
  descNav: DescNav;
  submitFn: (values: FormValues) => Promise<void>;
  fields: {
    name?: BaseField;
    email: BaseField;
    password: BaseField;
    repeatPassword?: BaseField;
  };
}

const PASSWORD_LENGTH = 6;
const NAME_LENGTH = 2;
const ERR_INVALID_EMAIL = "Неверный email";
const ERR_INVALID_NAME = `Длина имени должна быть минимум ${NAME_LENGTH} символа`;
const ERR_INVALID_PASSWORD = `Длина пароля должна быть минимум ${PASSWORD_LENGTH} символов`;
const ERR_INVALID_REPEAT_PASSWORD = "Пароли должны совпадать";

export const BaseAuth = ({
  pageLabel,
  descNav,
  submitLabel,
  fields,
  submitFn,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const initialFieldsVal: FormValues = Object.entries(fields).reduce(
    (acc, [key, field]) => {
      if (!field) return acc;
      acc[key as keyof FormValues] = field.initialValue;
      return acc;
    },
    {} as FormValues,
  );

  const validateFields: FormValidateInput<FormValues> = {
    password: (value: string) =>
      value.length < 6 ? ERR_INVALID_PASSWORD : null,
    email: (value: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : ERR_INVALID_EMAIL,
  };
  if (fields.repeatPassword) {
    validateFields.repeatPassword = (value, values) =>
      value !== values.password ? ERR_INVALID_REPEAT_PASSWORD : null;
  }
  if (fields.name) {
    validateFields.name = (value) =>
      value && value.length < 2 ? ERR_INVALID_NAME : null;
  }

  const form = useForm({
    mode: "uncontrolled",
    initialValues: initialFieldsVal,
    validate: validateFields,
  });

  return (
    <>
      <Stack h="100vh" align="center" justify="center" gap="md">
        <Title order={1}>{pageLabel}</Title>
        <form
          onSubmit={form.onSubmit(async (values) => {
            setIsLoading(true);
            try {
              await submitFn(values);
              form.reset();
            } catch (err) {
              console.error(err);
            } finally {
              setIsLoading(false);
            }
          })}
        >
          <Fieldset variant="filled" w={350}>
            <Stack gap="md">
              {Object.entries(fields).map(([key, { label, placeholder }]) =>
                key.toLowerCase().includes("password") ? (
                  <PasswordInput
                    label={label}
                    size="md"
                    key={form.key(key)}
                    {...form.getInputProps(key)}
                    disabled={isLoading}
                  />
                ) : (
                  <TextInput
                    label={label}
                    size="md"
                    placeholder={placeholder}
                    key={form.key(key)}
                    {...form.getInputProps(key)}
                    disabled={isLoading}
                  />
                ),
              )}
            </Stack>
          </Fieldset>
          <Space h="md" />
          <Button
            disabled={isLoading}
            variant="filled"
            fullWidth
            size="md"
            type="submit"
          >
            {submitLabel}
          </Button>
        </form>
        <Text c="dimmed" size="md">
          {descNav.textNav}{" "}
          <Link className="auth-link" replace to={descNav.path}>
            {descNav.labelLink}
          </Link>
        </Text>
      </Stack>
    </>
  );
};
