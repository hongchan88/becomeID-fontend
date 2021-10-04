import React from "react";
import { isLoggedInVar } from "./apollo";
import styled from "styled-components";
import { useForm, useFormState } from "react-hook-form";
import Button from "./Button";

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

const Signup = (props) => {
  const { register, handleSubmit, formState } = useForm({ mode: "onChange" });

  const onSubmitValid = (data) => {
    console.log(data);
  };
  const onSubmitInValid = (data) => {
    console.log(data);
  };
  return (
    <Container>
      <Wrapper>
        <TopBox>
          <div>Sign up</div>

          <form onSubmit={handleSubmit(onSubmitValid, onSubmitInValid)}>
            <input type="text" placeholder="email" />
            {/* <input
              {...register("carPlate", {
                required: "carPlate is required",
                minLength: {
                  value: 5,
                  message: "Plates must be more than 5 chars",
                },
              })}
              name="carPlate"
              type="text"
              placeholder="car plate number"
            /> */}
            <input type="password" placeholder="Password" />
            <input type="password" placeholder="Password Confirm" />
            <Button
              type="submit"
              value="Sign up"
              disabled={!formState.isValid}
            />
          </form>
        </TopBox>
      </Wrapper>
    </Container>
  );
};

export default Signup;
