import { Box, Group, PasswordInput, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Button } from "@mui/material";
import bgImage from "../../assets/bg-sign-in-basic.jpeg";

import React from "react";
import { loginAPI } from "../../redux/reducer/user.slice";
import { useAppDispatch } from "../../redux/hook";
import { messageError, messageSuccess } from "../../utils/GlobalFunction";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },

    validate: {
      password: (value, values) => (value ? null : "vui lòng nhập mật khẩu"),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    const data = {
      username: values.username,
      password: values.password,
      flgAdm: true,
    };
    dispatch(loginAPI(data))
      .unwrap()
      .then((result: any) => {
        if (result) {
          switch (result.code) {
            case 200:
              messageSuccess(result.success);
              navigate("/", { replace: true });
              break;
            case 201:
              messageError(result.error);
              break;
            default:
              return;
          }
        }
      });
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: 500,
          background: "white",
          padding: 20,
          borderRadius: 10,
          verticalAlign: "middle",
        }}
        mx="auto"
      >
        <Text size="lg" align="center" weight={"bold"} sx={{ fontSize: 30 }}>
          Đăng nhập
        </Text>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Username"
            placeholder=""
            required
            size="md"
            {...form.getInputProps("username")}
          />

          <PasswordInput
            mt="sm"
            label="Password"
            required
            size="md"
            placeholder=""
            {...form.getInputProps("password")}
          />

          <Group position="right" mt="md">
            <Button type="submit" color="success" variant="contained">
              Đăng nhập
            </Button>
          </Group>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
