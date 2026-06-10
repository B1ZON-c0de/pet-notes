import { Button, Flex, Title } from "@mantine/core";
import { Form } from "react-router";

export default function DeleteModal({
  closeModal,
}: {
  closeModal: () => void;
}) {
  return (
    <Flex direction="column" gap="xl" align="center" justify="center">
      <Title order={2} ta="center">
        Вы действительно хотите удалить запись?
      </Title>
      <Form method="delete">
        <Flex gap="md" justify="space-between" align="center">
          <Button size="md" variant="filled" color="blue" onClick={closeModal}>
            Отмена
          </Button>
          <Button size="md" variant="filled" color="red">
            Удалить
          </Button>
        </Flex>
      </Form>
    </Flex>
  );
}
