import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
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
  width: 30%;
  margin-left: 0.8em;
  margin-right: 0.4em;


  border-radius: 3px;
  padding: 7px;
  background-color: #fafafa;
  border: 0.5px solid rgb(219, 219, 219);

  box-sizing: border-box;
`;

const SuccessMsg = styled.span`
  height: 2em;
  
`;

const RegisterForm = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Button = styled.button`
  border: none;
  border-radius: 3px;
 
  color: white;
  background: #0095f6;
  text-align: center;
  padding: 8px 0px;
  font-weight: 600;
  width: 7em;
`;
const LabelText = styled.div`
  display: flex;
  align-items: center;

`
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
    getValues,
  } = useForm({
    mode: "onChange",
  });

  const onCompleted = (data) => {
    const {
      editProfile: { error, ok },
    } = data;
    if (!ok) {
      setError(`result`, { message: error });
    }
    console.log(ok);
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
  const [carPlates, setCarPlates] = useState(data?.getprofile?.car_plates);
  const [email, setEmail] = useState(data?.getprofile?.email);




  const inputValueChange = (e) => {
    setCarPlates(e.target.value);
  };

  const onSubmit = (data, e) => {
    if (editProfileLoading) {
      return;
    }
    console.log(data);
    if (e.target.id === "email") {
      editProfile({
        variables: {
          email: data.email,
        },
      });
    } else if (e.target.id === "car_plates") {
      editProfile({
        variables: {
          car_plates: data.car_plates,
        },
      });
    }
  };
  console.log(errors);
  return (
    <NavigationBase>
      <div>
        Your car plate
        {!getProfileLoading ? data?.getprofile?.car_plates : "not registered"}
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
    
      <form id="car_plates" onSubmit={handleSubmit(onSubmit)}>
          <RegisterForm>
         <LabelText><span>Your car plate</span></LabelText>
            <Input
              type="text"
              placeholder={carPlates}
              defaultValue={data?.getprofile?.car_plates}
              onChange={() => {
                setSuccessmsgShow(false);
                clearErrors();
              }}
              {...register("car_plates", { minLength: 3 })}
              // onChange={inputValueChange}
            />
            <Button type="submit">
              {data?.getprofile?.car_plates ? "Change" : "Register"}
            </Button>
          </RegisterForm>
        </form> 
        {errors?.car_plates?.type === "minLength" ? (
          <FormError message="Car plate must be more than 3 letter" />
        ) : null}
        {errors?.car_plates?.type === "required" ? (
          <FormError message="Please put car plate number" />
        ) : null}
        <FormError message={errors?.result?.message} />
  
        <form id="email" onSubmit={handleSubmit(onSubmit)}>
          <RegisterForm>
          <LabelText><span>Email</span></LabelText>
            <Input
         style={{width:'70%'}}
              type="text"
              placeholder={email}
              defaultValue={data?.getprofile?.email}
              {...register("email", { minLength: 3 })}
              onChange={() => {
                setSuccessmsgShow(false);
                clearErrors();
              }}
            />
            <Button type="submit">
              {data?.getprofile?.email ? "Change" : "Register"}
            </Button>
          </RegisterForm>
        </form> 

        {errors?.email?.type === "minLength" ? (
          <FormError message="email must be more than 3 letter" />
        ) : null}
        {errors?.email?.type === "required" ? (
          <FormError message="Please put email address" />
        ) : null}
      </Wrapper>
      <Wrapper></Wrapper>
    </NavigationBase>
  );
};

export default Register;
