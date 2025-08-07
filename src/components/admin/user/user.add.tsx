import { addUserAPI } from "@/services/api";
import { App, Form, Divider, Input, Modal } from "antd";
import { useForm } from "antd/es/form/Form";
import { FormProps } from "antd/lib";

interface IProps {
  isModalOpen: boolean;
  setIsModalOpen: (v: boolean) => void;
  refreshTable: () => void;
}

type FieldAddType = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
};

const CreateUser = (props: IProps) => {
  const { isModalOpen, setIsModalOpen, refreshTable } = props;
  const { notification } = App.useApp();
  const [formAdd] = useForm();

  const onFinish: FormProps<FieldAddType>["onFinish"] = async (values) => {
    const res = await addUserAPI(
      values.fullName,
      values.email,
      values.password,
      values.phone
    );
    if (res.data) {
      formAdd.resetFields();
      refreshTable();
      setIsModalOpen(false);
      notification.success({
        message: "Add new user",
        description: "Add user successfully!",
      });
    } else {
      notification.error({
        message: "Add new user!",
        description: res.message,
      });
    }
  };

  return (
    <>
      <Modal
        title="Add new user"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          formAdd.resetFields();
        }}
        onOk={() => formAdd.submit()}
        okText={"Add"}
      >
        <Divider />
        <Form
          name="form-add"
          onFinish={onFinish}
          autoComplete="off"
          form={formAdd}
        >
          <Form.Item<FieldAddType>
            labelCol={{ span: 24 }}
            label="User name"
            name="fullName"
            rules={[{ required: true, message: "Fullname cannot be empty!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldAddType>
            labelCol={{ span: 24 }}
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email cannot be empty!" },
              { type: "email", message: "Invalid email format!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldAddType>
            labelCol={{ span: 24 }}
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Password cannot be empty!" },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                message:
                  "Password must be 8+ characters with upper/lowercase letters, numbers, and special characters!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<FieldAddType>
            labelCol={{ span: 24 }}
            label="Phone number"
            name="phone"
            rules={[
              { required: true, message: "Phone number cannot be empty!" },
              {
                pattern: /^0\d{9}$/,
                message:
                  "Phone number must start with 0 and contain 10 digits!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateUser;
