import React, { useEffect, useRef } from "react";
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
  display: flex;
  width: 100%;
`;

const Button = styled.button`
  width: 30%;
`;

const TextInput = styled.input`
  border: 1px solid black;
  padding: 10px 20px;
  color: black;
  border-radius: 10px;
  width: 70%;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;

  height: 100%;
  width: 100%;
`;
const MessageWrapper = styled.div`
  display: flex;

  flex-direction: column;
  overflow-y: scroll;
  min-height: 80%;
`;

const MessageContainer = styled.div`
  padding: 5px 10px;
  display: flex;
  justify-content: ${(props) => (props.outGoing ? "flex-start" : "flex-end")};
  width: 100%;
`;

const Message = styled.div`
  display: flex;
  color: black;
  border: solid 0.2px grey;
  background-color: ${(props) => (props.outGoing ? "white" : "grey")};
  padding: 5px 10px;

  border-radius: 10px;
  font-size: 16px;
  margin: 0px 10px;
`;

const Profile = (props) => {
  const MessageScroll = useRef();
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

      console.log(MessageScroll.current);
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

  useEffect(() => {
    if (MessageScroll.current) {
      MessageScroll.current.scrollIntoView({
        block: "end",
      });
    }
  }, [seeRoomData]);

  return (
    <NavigationBase>
      <Container>
        <MessageWrapper>
          {!loading &&
            seeRoomData.seeRoom.messages.map((message) => {
              return (
                <MessageContainer
                  outGoing={message.user.id !== location?.state?.id}
                >
                  <Message
                    ref={MessageScroll}
                    outGoing={message.user.id !== location?.state?.id}
                  >
                    {location?.state?.id == message.user.id
                      ? message.user.car_plates
                      : "You"}
                    : {message.payload}
                  </Message>
                </MessageContainer>
              );
            })}
        </MessageWrapper>

        <form onSubmit={handleSubmit(onValid)}>
          <InputContainer>
            <TextInput
              {...register("message", { required: true })}
              type="text"
            />

            <Button>SEND</Button>
          </InputContainer>
        </form>
      </Container>
    </NavigationBase>
  );
};

export default Profile;
