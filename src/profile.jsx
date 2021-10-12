import React, { useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useLocation } from "react-router-dom";
import NavigationBase from "./components/navigation";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { storeValueIsStoreObject } from "@apollo/client/cache/inmemory/helpers";
import useMe from "./hook/useMe";

const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage($payload: String!, $roomId: Int, $userId: Int) {
    sendMessage(payload: $payload, roomId: $roomId, userId: $userId) {
      ok
      id
    }
  }
`;

const SEE_ROOM_QUERY = gql`
  query seeRoom($id: Int!) {
    seeRoom(id: $id) {
      id
      messages {
        payload
        user {
          id
          car_plates
        }
      }
    }
  }
`;
const InputContainer = styled.div`
  width: 100%;
  margin-bottom: 50px;
  margin-top: 25px;
  flex-direction: row;
  align-items: center;
`;

const TextInput = styled.input`
  border: 1px solid black;
  padding: 10px 20px;
  color: black;
  border-radius: 10px;
  width: 70%;
  margin-right: 10px;
`;

const MessageContainer = styled.div`
  padding: 5px 10px;
  display: flex;
  justify-content: ${(props) => (props.outGoing ? "flex-end" : "flex-start")};
  width: 100%;
`;

const Message = styled.div`
  display: flex;
  color: black;
  background-color: gray;
  padding: 5px 10px;
  overflow: hidden;
  border-radius: 10px;
  font-size: 16px;
  margin: 0px 10px;
`;

const Profile = (props) => {
  const { data: meData } = useMe();
  const location = useLocation();
  const { register, reset, setValue, handleSubmit, getValues } = useForm();
  const updateSendMessage = (cache, result) => {
    const {
      data: {
        sendMessage: { ok, id },
      },
    } = result;
    console.log(result);

    if (ok && meData) {
      const { message } = getValues();
      setValue("message", "");
      const messageObj = {
        id,
        messages: {
          payload: message,
          user: {
            id: meData.me.id,
            car_plates: meData.me.car_plates,
          },
        },
        __typename: "Message",
      };
      const messageFragment = cache.writeFragment({
        fragment: gql`
          fragment NewMessage on Message {
            id
            messages {
              payload
              user {
                id
                car_plates
              }
            }
          }
        `,
        data: messageObj,
      });
      cache.modify({
        id: `Room:${seeRoomData?.seeRoom?.id}`,
        fields: {
          messages(prev) {
            return [...prev, messageFragment];
          },
        },
      });
    }
  };
  const [sendMessageMutation, { loading: sendingMessage }] = useMutation(
    SEND_MESSAGE_MUTATION,
    {
      update: updateSendMessage,
    }
  );
  const onValid = (data) => {
    if (!sendingMessage) {
      sendMessageMutation({
        variables: {
          payload: data.message,
          roomId: seeRoomData?.seeRoom.id,
        },
      });
    }
    reset();
  };

  const {
    data: seeRoomData,
    error,
    loading,
  } = useQuery(SEE_ROOM_QUERY, {
    variables: {
      id: location?.state?.id,
    },
  });

  if (!loading) {
    console.log(seeRoomData.seeRoom.messages);
  }
  return (
    <NavigationBase>
      {!loading &&
        seeRoomData.seeRoom.messages.map((message) => {
          return (
            <MessageContainer
              outGoing={message.user.id !== location?.state?.id}
            >
              <Message>
                {location?.state?.id == message.user.id
                  ? message.user.car_plates
                  : "You"}
                : {message.payload}
              </Message>
            </MessageContainer>
          );
        })}
      <InputContainer>
        <form onSubmit={handleSubmit(onValid)}>
          <TextInput {...register("message", { required: true })} type="text" />
          <button>SEND</button>
        </form>
      </InputContainer>
      <div>This is Profile</div>
    </NavigationBase>
  );
};

export default Profile;
