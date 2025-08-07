import { Divider, Form, Input, Modal } from "antd";
import { useForm } from "antd/es/form/Form";

interface IProps {
  openModalUpdate: boolean;
  setOpenModalUpdate: (v: boolean) => void;
  refreshTable: () => void;
  dataUpdate: IUserTable | null;
  setDataUpdate: (v: IUserTable) => void;
}

interface FieldUpdateType{
  _id: string,
  email: string,
  fullName: string,
  phone: string
}

const UpdateUser = (props: IProps) => {
    const {
      openModalUpdate,
      setOpenModalUpdate,
      refreshTable,
      dataUpdate,
      setDataUpdate,
    } = props;
    console.log(
      openModalUpdate,
      setOpenModalUpdate,
      refreshTable,
      dataUpdate,
      setDataUpdate
    );
  const [formUpdate] = useForm();
  const onFinish = () => {};
  return (
    <>
      <Modal
        title="Update user"
        open={true}
        onCancel={() => {
          setOpenModalUpdate(false);
          formUpdate.resetFields();
        }}
        onOk={() => formUpdate.submit()}
        okText={"Update"}
      >
        <Divider />
        <Form
          name="form-update"
          onFinish={onFinish}
          autoComplete="off"
          form={formUpdate}
        >
          <Form.Item<FieldUpdateType>
            labelCol={{ span: 24 }}
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email cannot be empty!" },
              { type: "email", message: "Invalid email format!" },
            ]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item<FieldUpdateType>
            labelCol={{ span: 24 }}
            label="User name"
            name="fullName"
            rules={[{ required: true, message: "Fullname cannot be empty!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldUpdateType>
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

export default UpdateUser;