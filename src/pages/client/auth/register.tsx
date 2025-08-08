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
      message.success("Register successfully!", 1)
      formRegister.resetFields();
      navigate("/login")
    } else {
      message.error(res.message, 2)
    }
    setIsSubmit(false)
  };

  return (
    <div className="register-page">
      <main className="main">
        <div className="container">
          <section className="wrapper">
            <div className="heading">
              <h2 className="text text-large">Register user</h2>
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
                label="Full name"
                name="fullName"
                rules={[
                  { required: true, message: "Full name cannot be empty!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
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

              <Form.Item<FieldType>
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

              <Form.Item<FieldType>
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

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={isSubmit}>
                  Register
                </Button>
              </Form.Item>

              <Divider>Or</Divider>

              <p className="text text-normal" style={{ textAlign: "center" }}>
                Have account ? <Link to={"/login"}>Login here</Link>
              </p>
            </Form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
