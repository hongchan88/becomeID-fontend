import React from "react";
import { isLoggedInVar, logUserIn } from "./apollo";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import Button from "./Button";
import { gql, useMutation } from "@apollo/client";
import FormError from "./formerror";

const Container = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const WhiteBox = styled.div`
  background-color: white;
  border: 1px solid rgb(219, 219, 219);
  width: 100%;
`;

const TopBox = styled(WhiteBox)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 35px 40px 25px 40px;
  margin-bottom: 10px;
  form {
    margin-top: 35px;
    width: 100%;
    display: flex;
    justify-items: center;
    flex-direction: column;
    align-items: center;
    input {
      width: 100%;
      border-radius: 3px;
      padding: 7px;
      background-color: #fafafa;
      border: 0.5px solid rgb(219, 219, 219);
      margin-top: 5px;
      box-sizing: border-box;
      &::placeholder {
        font-size: 12px;
      }
      &:last-child {
        border: none;
        margin-top: 12px;
        background-color: #0095f6;
        color: white;
        text-align: center;
        padding: 8px 0px;
        font-weight: 600;
      }
    }
  }
`;

const BottomBox = styled(WhiteBox)`
  padding: 20px 0px;
  text-align: center;

  a {
    font-weight: 600;
    color: #0095f6;
  }
`;

const Wrapper = styled.div`
  max-width: 350px;
  width: 100%;
`;

const Separator = styled.div`
  margin: 20px 0px 30px 0px;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
  div {
    width: 100%;
    height: 1px;
    background-color: rgb(219, 219, 219);
  }
  span {
    margin: 0px 10px;
    font-weight: 600;
    color: #8e8e8e;
  }
`;

const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      token
      error
    }
  }
`;

const Login = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    clearErrors,
  } = useForm({
    mode: "onChange",
  });

  const onCompleted = (data) => {
    const {
      login: { error, ok, token },
    } = data;
    if (!ok) {
      setError("result", { message: error });
    }
    if (token) {
      logUserIn(token);
    }
  };
  console.log(errors);
  const [login, { loading }] = useMutation(LOGIN_MUTATION, { onCompleted });

  const onSubmitValid = (data) => {
    if (loading) {
      return;
    }
    login({
      variables: {
        ...data,
      },
    });
  };

  return (
    <Container>
      <Wrapper>
        <TopBox>
          <div>BecomeID</div>
          <form onSubmit={handleSubmit(onSubmitValid)}>
            <input
              {...register("email", { required: "Email is required" })}
              name="email"
              type="text"
              placeholder="Email"
              onFocus={() => clearErrors("result")}
            />
            <input
              {...register("password", { required: "Password is required" })}
              name="password"
              type="password"
              placeholder="Password"
              onFocus={() => clearErrors("result")}
            />
            <FormError message={errors?.result?.message} />
            <Button
              type="submit"
              value={loading ? "Loading ..." : "Log in"}
              disabled={!isValid || loading}
            />
          </form>

          <Separator>
            <div></div>
            <span>Or</span>
            <div></div>
          </Separator>
        </TopBox>
        <BottomBox>
          <span>Don't have an account?</span> <a href="/signup">Sign up</a>
        </BottomBox>
      </Wrapper>
    </Container>
  );
};
export default Login;
