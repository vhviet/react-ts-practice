import { useCurrentApp } from "@/components/context/app.context";
import { loginAPI } from "@/services/api";
import { App, Button, Divider, Form, FormProps, Input } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'styles/login.scss'

type FieldLoginType = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { setIsAuthenticated, setUser } = useCurrentApp();
  const [formLogin] = Form.useForm();

  const onFinish: FormProps<FieldLoginType>["onFinish"] = async (values) => {
    setLoading(true);
    const res = await loginAPI(values.username || "", values.password || "");
    if (res?.data) {
      setIsAuthenticated(true);
      setUser(res.data.user);
      localStorage.setItem('access_token', res.data.access_token);
      formLogin.resetFields();
      message.success("Login successfully!", 2);
      navigate("/");
    } else {
      message.error(res.message, 2);
    }
    setLoading(false);
  };
  return (
    <div className="login-page">
      <main className="main">
        <div className="container">
          <section className="wrapper">
            <div className="heading">
              <h2 className="text text-large">Login</h2>
              <Divider />
            </div>
            <Form
              name="form-login"
              onFinish={onFinish}
              autoComplete="off"
              layout="vertical"
              form={formLogin}
            >
              <Form.Item<FieldLoginType>
                labelCol={{ span: 24 }}
                label="Email"
                name="username"
                rules={[
                  { required: true, message: "Email cannot be empty!" },
                  { type: "email", message: "Invalid email format!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldLoginType>
                labelCol={{ span: 24 }}
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Password cannot be empty!" },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Login now
                </Button>
              </Form.Item>

              <Divider>Or</Divider>

              <p className="text text-normal" style={{ textAlign: "center" }}>
                Not have account ? <Link to={"/register"}>Register</Link>
              </p>
            </Form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
