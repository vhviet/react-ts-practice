import { App, Button, Divider, Form, Input } from "antd";
import type { FormProps } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "styles/register.scss";
import { registerAPI } from "@/services/api";
import { useForm } from "antd/es/form/Form";

type FieldType = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
};

const RegisterPage = () => {
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [formRegister] = useForm();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmit(true)
    const res = await registerAPI(
      values.fullName,
      values.email,
      values.password,
      values.phone,
    )
    if (res.data) {
      message.success("Đăng ký thành công!")
      formRegister.resetFields();
      navigate("/login")
    } else {
      message.error(res.message)
    }
    setIsSubmit(false)
  };

  return (
    <div className="register-page">
      <main className="main">
        <div className="container">
          <section className="wrapper">
            <div className="heading">
              <h2 className="text text-large">Đăng ký tài khoản</h2>
              <Divider />
            </div>
            <Form
              name="form-register"
              onFinish={onFinish}
              autoComplete="off"
              form={formRegister}
            >
              <Form.Item<FieldType>
                labelCol={{ span: 24 }}
                label="Họ tên"
                name="fullName"
                rules={[
                  { required: true, message: "Họ tên không được để trống" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
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

              <Form.Item<FieldType>
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

              <Form.Item<FieldType>
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

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={isSubmit}>
                  Đăng ký
                </Button>
              </Form.Item>

              <Divider>Or</Divider>

              <p className="text text-normal" style={{ textAlign: "center" }}>
                Đã có tài khoản ? <Link to={"/login"}>Đăng nhập</Link>
              </p>
            </Form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
