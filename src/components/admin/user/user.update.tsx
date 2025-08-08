import { updateUserAPI } from "@/services/api";
import { App, Divider, Form, Input, Modal } from "antd";
import { useForm } from "antd/es/form/Form";
import { FormProps } from "antd/lib";
import { useEffect, useState } from "react";

interface IProps {
  openModalUpdate: boolean;
  setOpenModalUpdate: (v: boolean) => void;
  refreshTable: () => void;
  dataUpdate: IUserTable | null;
  setDataUpdate: (v: IUserTable | null) => void;
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
  
  const [formUpdate] = useForm();
  const { notification, message } = App.useApp();
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  useEffect(() => {
    if (dataUpdate) {
      formUpdate.setFieldsValue({
        ...dataUpdate
       });
    }
  }, [dataUpdate])
  
  const onFinish: FormProps<FieldUpdateType>["onFinish"] = async (values) => {
    const { _id, fullName, phone } = values;
    if (fullName === dataUpdate?.fullName && phone === dataUpdate?.phone ) {
      message.error(
        "Please enter name/phone number different from the current info!", 1
      );
      return
    }
    setIsSubmit(true);
    const res = await updateUserAPI(_id, fullName, phone);
    if (res?.data) {
      formUpdate.resetFields();
      setDataUpdate(null);
      setOpenModalUpdate(false);
      refreshTable();
      notification.success({
        message: "Update user!",
        description: `You have updated user ${res.data._id} successfully!`,
      });
    } else {
      notification.error({
        message: "Update user!",
        description: JSON.stringify(res.message),
      });
    }
    setIsSubmit(false);
  };
  
  return (
    <>
      <Modal
        title="Update user"
        open={openModalUpdate}
        onCancel={() => {
          setOpenModalUpdate(false);
          setDataUpdate(null);
          formUpdate.resetFields();
        }}
        onOk={() => formUpdate.submit()}
        okText={"Update"}
        okButtonProps={
          {
            loading: isSubmit
          }
        }
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
            label="Id"
            name="_id"
            // hidden
          >
            <Input disabled />
          </Form.Item>
          <Form.Item<FieldUpdateType>
            labelCol={{ span: 24 }}
            label="Email"
            name="email"
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