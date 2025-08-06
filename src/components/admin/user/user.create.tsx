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
        message: "Thêm người dùng",
        description: "Thêm người dùng thành công!",
      });
    } else {
      notification.error({
        message: "Thêm người dùng!",
        description: res.message,
      });
    }
  };

  return (
    <>
      <Modal
        title="Add new user"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
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
            label="Họ tên"
            name="fullName"
            rules={[{ required: true, message: "Họ tên không được để trống" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldAddType>
            labelCol={{ span: 24 }}
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email không được để trống" },
              { type: "email", message: "Email không đúng định dạng" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldAddType>
            labelCol={{ span: 24 }}
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Password không được để trống" },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                message:
                  "Password phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<FieldAddType>
            labelCol={{ span: 24 }}
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "SĐT không được để trống" },
              {
                pattern: /^0\d{9}$/,
                message: "SĐT phải bắt đầu bằng số 0 và gồm 10 chữ số",
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
