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
import { useForm } from "@mantine/form";
import { Link } from "react-router";
import type { ROUTES } from "../routes";
import { useAuth, type FormFields, type FormValues } from "../hooks/useAuth";

interface DescNav {
  textNav: string;
  labelLink: string;
  path: (typeof ROUTES)[keyof typeof ROUTES];
}

interface Props {
  pageLabel: string;
  submitLabel: string;
  descNav: DescNav;
  submitFn: (values: FormValues) => Promise<void>;
  fields: FormFields;
}

export const BaseAuth = ({
  pageLabel,
  descNav,
  submitLabel,
  fields,
  submitFn,
}: Props) => {
  const { isLoading, initialFieldsVal, submitForm, validateFields } = useAuth({
    submitFn,
    fields,
  });

  const form = useForm({
    mode: "uncontrolled",
    initialValues: initialFieldsVal,
    validate: validateFields,
  });

  return (
    <>
      <Stack h="100vh" align="center" justify="center" gap="md">
        <Title order={1}>{pageLabel}</Title>
        <form onSubmit={form.onSubmit((values) => submitForm(values, form))}>
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
