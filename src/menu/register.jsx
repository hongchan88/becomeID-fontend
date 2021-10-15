import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import FormError from "../components/formerror";
import FormSuccess from "../components/formsuccess";
import NavigationBase from "../components/navigation";

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
`;
const ErrorSpan = styled.span`
  min-height: 2em;
`;

const EDIT_PROFILE = gql`
  mutation editProfile($car_plates: String, $email: String) {
    editProfile(car_plates: $car_plates, email: $email) {
      ok
      value
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
  const [successEmailMsgShow, setSuccessEmailmsgShow] = useState(false);
  const [successCarMsgShow, setSuccessCarmsgShow] = useState(false);
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
      editProfile: { error, ok, value },
    } = data;
    if (!ok) {
      if (value) {
        value === "email"
          ? setError("email", { message: error })
          : setError("car_plates", { message: error });
      }
    }

    if (ok) {
      refetch();
      reset();

      if (value === "car_plates") {
        setSuccessCarmsgShow(true);
      } else if (value === "email") {
        setSuccessEmailmsgShow(true);
      }
    }
  };

  const [editProfile, { editProfileLoading }] = useMutation(EDIT_PROFILE, {
    onCompleted,
  });
  const {
    loading: getProfileLoading,
    error,
    data,
    refetch,
  } = useQuery(GET_PLATE);
  const [carPlates, setCarPlates] = useState(data?.getprofile?.car_plates);
  const [email, setEmail] = useState(data?.getprofile?.email);

  const onSubmit = (data, e) => {
    if (editProfileLoading) {
      return;
    }

    if (e.target.id === "email" && data.email !== "") {
      setSuccessEmailmsgShow(false);
      editProfile({
        variables: {
          email: data.email,
        },
      });
    } else if (e.target.id === "car_plates" && data.car_plates !== "") {
      setSuccessCarmsgShow(false);

      editProfile({
        variables: {
          car_plates: data.car_plates,
        },
      });
    } else {
      if (e.target.id === "email") {
        setError("email", { message: "email/car_plates is already exist" });
        return;
      } else if (e.target.id === "car_plates") {
        setError("car_plates", {
          message: "email/car_plates is already exist",
        });
        return;
      }
    }
  };
  const clearSucMsg = (e) => {
    if (e.target.form.id === "car_plates") {
      setSuccessCarmsgShow(false);
    } else if (e.target.form.id === "email") {
      setSuccessEmailmsgShow(false);
    }
    clearErrors();
  };

  return (
    <NavigationBase>
      {/* <div>
        Your car plate
        {!getProfileLoading ? data?.getprofile?.car_plates : "not registered"}
      </div>
      <div>
        Contact Email:
        <span> {!getProfileLoading ? data?.getprofile?.email : null} </span>
      </div> */}
      <Wrapper>
        <form id="car_plates" onSubmit={handleSubmit(onSubmit)}>
          <RegisterForm>
            <LabelText>
              <span>Your car plate</span>
            </LabelText>
            <Input
              type="text"
              placeholder={carPlates}
              defaultValue={data?.getprofile?.car_plates}
              {...register("car_plates", { minLength: 3 })}
              onChange={clearSucMsg}
            />
            <Button type="submit">
              {data?.getprofile?.car_plates ? "Change" : "Register"}
            </Button>
          </RegisterForm>
        </form>

        <ErrorSpan>
          {successCarMsgShow ? (
            <FormSuccess message="Succeessfully updated" />
          ) : null}

          {errors?.car_plates?.type === "minLength" ? (
            <FormError message="Car plate must be more than 3 letter" />
          ) : null}
          {errors?.car_plates?.type === "required" ? (
            <FormError message="Please put car plate number" />
          ) : null}
          {errors?.result?.message ? (
            <FormError message={errors?.result?.message} />
          ) : null}
          {errors?.car_plates?.message ? (
            <FormError message={errors?.car_plates?.message} />
          ) : null}
        </ErrorSpan>
        <form id="email" onSubmit={handleSubmit(onSubmit)}>
          <RegisterForm>
            <LabelText>
              <span>Email</span>
            </LabelText>
            <Input
              style={{ width: "70%" }}
              type="text"
              placeholder={data?.getprofile?.email}
              defaultValue={data?.getprofile?.email}
              {...register("email", { minLength: 3 })}
              onChange={clearSucMsg}
            />
            <Button type="submit">
              {data?.getprofile?.email ? "Change" : "Register"}
            </Button>
          </RegisterForm>
        </form>
        <ErrorSpan>
          {successEmailMsgShow ? (
            <FormSuccess message="Succeessfully updated" />
          ) : null}

          <FormError message={errors?.email?.message} />

          {errors?.email?.type === "minLength" ? (
            <FormError message="email must be more than 3 letter" />
          ) : null}
          {errors?.email?.type === "required" ? (
            <FormError message="Please put email address" />
          ) : null}
        </ErrorSpan>
      </Wrapper>
      <Wrapper></Wrapper>
    </NavigationBase>
  );
};

export default Register;
