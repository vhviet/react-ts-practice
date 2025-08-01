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
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const { message } = App.useApp();
  const onFinish: FormProps<FieldLoginType>["onFinish"] = async (values) => {
    setIsSubmit(true);
    const res = await loginAPI(values.username, values.password);
    if (res?.data) {
      localStorage.setItem('access_token', res.data.access_token);
      message.success("Đăng nhập thành công!");
      navigate("/");
    } else {
      message.error(res.message);
    }
    setIsSubmit(false);
  };
  return (
    <div className="login-page">
      <main className="main">
        <div className="container">
          <section className="wrapper">
            <div className="heading">
              <h2 className="text text-large">Đăng nhập</h2>
              <Divider />
            </div>
            <Form name="form-register" onFinish={onFinish} autoComplete="off">
              <Form.Item<FieldLoginType>
                labelCol={{ span: 24 }}
                label="Email"
                name="username"
                rules={[
                  { required: true, message: "Email không được để trống!" },
                  { type: "email", message: "Email sai định dạng!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldLoginType>
                labelCol={{ span: 24 }}
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Password không được để trống!" }
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={isSubmit}>
                  Đăng nhập
                </Button>
              </Form.Item>

              <Divider>Or</Divider>

              <p className="text text-normal" style={{ textAlign: "center" }}>
                Chưa có tài khoản ? <Link to={"/register"}>Đăng kí</Link>
              </p>
            </Form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
