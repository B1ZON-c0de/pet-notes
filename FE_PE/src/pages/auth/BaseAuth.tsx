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

interface FormValues {
  name?: string;
  email: string;
  password: string;
  repeatPassword?: string;
}

interface Props {
  pageLabel: string;
  submitLabel: string;
  descNav: DescNav;
  fields: {
    name?: BaseField;
    email: BaseField;
    password: BaseField;
    repeatPassword?: BaseField;
  };
}

export const BaseAuth = ({
  pageLabel,
  descNav,
  submitLabel,
  fields,
}: Props) => {
  const initialFieldsVal: FormValues = Object.entries(fields).reduce(
    (acc, [key, field]) => {
      if (!field) return acc;
      acc[key] = field.initialValue;
      return acc;
    },
    {} as FormValues,
  );

  const validateFields: FormValidateInput<FormValues> = {
    password: (value: string) =>
      value.length < 6 ? "Длина пароля должна быть минимум 6 символа" : null,
    email: (value: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : "Неверный email",
  };
  if (fields.repeatPassword) {
    validateFields.repeatPassword = (value, values) =>
      value !== values.password ? "Пароли должны совпадать" : null;
  }
  if (fields.name) {
    validateFields.name = (value) =>
      value.length < 2 ? "Длина имени должна быть минимум 2 символа" : null;
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
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <Fieldset variant="filled" w={350}>
            <Stack gap="md">
              {Object.entries(fields).map(([key, { label, placeholder }]) =>
                key.toLowerCase().includes("password") ? (
                  <PasswordInput
                    label={label}
                    size="md"
                    key={form.key(key)}
                    {...form.getInputProps(key)}
                  />
                ) : (
                  <TextInput
                    label={label}
                    size="md"
                    placeholder={placeholder}
                    key={form.key(key)}
                    {...form.getInputProps(key)}
                  />
                ),
              )}
            </Stack>
          </Fieldset>
          <Space h="md" />
          <Button variant="filled" fullWidth size="md" type="submit">
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
