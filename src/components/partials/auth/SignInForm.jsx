import qs from "qs";
import Cookies from "js-cookie";
import { Button, Input, Radio, Form } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import Loading from "../../../components/common/Loading";
import { roleStore } from "../../../store/roleStroe";

const SignInForm = ({ apiUrl, apiToken }) => {
  const [loading, setLoading] = useState(false);

  const onfinish = async (values) => {
    setLoading(true);

    const identifier = values.email;
    const password = values.password;

    const urlParamsObject = {
      populate: {
        avatar: {
          populate: "*",
        },
        background: {
          populate: "*",
        },
        brand: {
          populate: "*",
        },
        services: {
          populate: "*",
        },
        role: {
          populate: "*",
        },
      },
    };

    const queryString = qs.stringify(urlParamsObject);
    const requestUrl = `${apiUrl}/api/auth/local?${queryString}`;

    try {
      const response = await fetch(`${requestUrl}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `bearer ${apiToken}`,
        },
        body: JSON.stringify({
          identifier,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.jwt) {
          const roles = data?.user?.employee_roles?.map((role) => role?.value)?.toString();

          if (roles?.indexOf("admin") > -1) {
            Cookies.set("reef_admin_token", data.jwt);
            roleStore.set("admin");

            setTimeout(() => {
              toast.success("Login as an admin successfully 😎", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              });

              setTimeout(() => {
                setLoading(false);
                location.href = "/";
              }, 1500);
            }, 1000);
          } else {
            if (data?.user.approvedAsEmployee) {
              roleStore.set(roles);
              Cookies.set("reef_admin_token", data.jwt);

              toast.success(`Login as ${roles?.replaceAll(",", ", ")} successfully 👌`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              });

              setTimeout(() => {
                setLoading(false);
                location.href = "/";
              }, 1500);
            } else {
              console.log("Login successful");

              setTimeout(() => {
                toast.info("Not allowed by admin yet", {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                });

                setTimeout(() => {
                  setLoading(false);
                }, 1500);
              }, 1000);
            }
          }
        }
      } else {
        toast.error("Invalid identifier or password", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        setLoading(false);
      }
    } catch (error) {
      toast.error("Not registered user", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      setLoading(false);
      console.error("Error occurred during login:", error);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <div className="max-w-[500px] w-full mx-auto min-h-screen flex items-center justify-center">
        <Form
          className="border p-10 rounded-xl shadow-2xl w-full"
          name="basic"
          layout="vertical"
          autoComplete="off"
          onFinish={onfinish}
        >
          <h3 className="text-3xl font-bold mb-6">Sign In</h3>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                type: "email",
                message: "Please input your email!",
              },
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
              {
                required: true,
                message: "Please input more than 6 characters",
                min: 6,
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <div className="mb-5">
            Don't have an account?{" "}
            <a href="/signup" className="font-semibold text-primary">
              Register today
            </a>
          </div>

          <Form.Item className="mb-0">
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default SignInForm;
