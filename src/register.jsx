import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import Basicbutton from "./components/basicbutton";
import FormSuccess from "./components/formsuccess";
import NavigationBase from "./components/navigation";
import Textfield from "./components/textfields";
import FormError from "./formerror";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;

  border-radius: 3px;
  padding: 7px;
  background-color: #fafafa;
  border: 0.5px solid rgb(219, 219, 219);
  margin-top: 20px;
  box-sizing: border-box;
`;

const SuccessMsg = styled.span`
  height: 2em;
`;

const RegisterForm = styled.div`
  display: flex;
`;

const EDIT_PROFILE = gql`
  mutation editProfile($car_plates: String, $email: String) {
    editProfile(car_plates: $car_plates, email: $email) {
      ok

      error
    }
  }
`;
const GET_PLATE = gql`
  query getprofile {
    getprofile {
      car_plates
      email
    }
  }
`;

const Register = (props) => {
  const [successMsgShow, setSuccessmsgShow] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    reset,
    clearErrors,
  } = useForm({
    mode: "onChange",
  });

  const onCompleted = (data) => {
    const {
      editProfile: { error, ok },
    } = data;
    if (!ok) {
      setError("result", { message: error });
    }
    if (ok) {
      refetch();
      reset();
      setSuccessmsgShow(true);
    }
  };

  const [editProfile, { editProfileLoading }] = useMutation(EDIT_PROFILE, {
    onCompleted,
  });
  const { getProfileLoading, error, data, refetch } = useQuery(GET_PLATE);

  const onSubmit = (data) => {
    if (editProfileLoading) {
      return;
    }
    editProfile({
      variables: {
        ...data,
      },
    });
  };
  console.log(errors);
  return (
    <NavigationBase>
      <div>
        Registered car plate :
        {!getProfileLoading ? data?.getprofile?.car_plates : null}
      </div>
      <div>
        Contact Email:
        <span> {!getProfileLoading ? data?.getprofile?.email : null} </span>
      </div>
      <Wrapper>
        <SuccessMsg>
          {successMsgShow ? (
            <FormSuccess message="Succeessfully updated" />
          ) : null}
        </SuccessMsg>
        <form onSubmit={handleSubmit(onSubmit)}>
          <RegisterForm>
            <Input
              type="text"
              placeholder="Car plate"
              {...register("car_plates", { minLength: 3, required: true })}
              onChange={() => {
                setSuccessmsgShow(false);
                clearErrors();
              }}
            />
            <button type="submit">Register</button>
          </RegisterForm>
        </form>
        {errors?.car_plates?.type === "minLength" ? (
          <FormError message="Car plate must be more than 3 letter" />
        ) : null}
        {errors?.car_plates?.type === "required" ? (
          <FormError message="Please put car plate number" />
        ) : null}
        <FormError message={errors?.result?.message} />
      </Wrapper>
      <Wrapper></Wrapper>
    </NavigationBase>
  );
};

export default Register;
