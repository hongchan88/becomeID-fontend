import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import NavigationBase from "../components/navigation";
import useMe from "../hook/useMe";

const ROOM_UPDATES = gql`
  subscription roomUpdates($id: Int!) {
    roomUpdates(id: $id) {
      id
      payload
      user {
        id
        car_plates
      }
    }
  }
`;

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
        id
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
  visibility: ${(props) => (props.hidden ? "hidden" : "visible")};
  display: flex;
  color: black;
  border: solid 0.2px grey;
  background-color: ${(props) => (props.outGoing ? "white" : "grey")};
  padding: 5px 10px;

  border-radius: 10px;
  font-size: 16px;
  margin: 0px 10px;
`;

const Room = (props) => {
  const MessageScroll = useRef();
  const { data: meData } = useMe();
  const location = useLocation();
  const [hiddenMsg, setHiddenMsg] = useState(true);

  const {
    data: seeRoomData,
    error,
    loading,
    subscribeToMore,
  } = useQuery(SEE_ROOM_QUERY, {
    variables: {
      id: location?.state?.id,
    },
  });

  const { register, reset, setValue, handleSubmit, getValues } = useForm();
  const { message } = getValues();
  const updateSendMessage = (cache, result) => {
    const {
      data: {
        sendMessage: { ok, id },
      },
    } = result;

    if (ok && meData) {
      console.log(message);
      setValue("message", "");

      const messageObj = {
        id,
        payload: message,
        user: {
          id: meData.me.id,
          car_plates: meData.me.car_plates,
        },

        __typename: "Message",
      };
      console.log(message, "update send message");

      const messageFragment = cache.writeFragment({
        fragment: gql`
          fragment NewMessage on Message {
            id
            payload
            user {
              id
              car_plates
            }
          }
        `,
        data: messageObj,
      });

      cache.modify({
        id: `Room:${seeRoomData?.seeRoom?.id}`,
        fields: {
          messages(prev) {
            console.log(prev);
            const existingMessages = prev.find(
              (aMessage) => aMessage.__ref === messageFragment.__ref
            );
            if (existingMessages) {
              return prev;
            }
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

  const client = useApolloClient();
  const updateQuery = (preQuery, options) => {
    const {
      subscriptionData: {
        data: { roomUpdates: messageData },
      },
    } = options;

    console.log(messageData);

    if (messageData.id) {
      const incomingMessage = client.cache.writeFragment({
        fragment: gql`
          fragment NewMessage on Message {
            id
            payload
            user {
              id
              car_plates
            }
          }
        `,
        data: messageData,
      });
      client.cache.modify({
        id: `Room:${seeRoomData?.seeRoom?.id}`,
        fields: {
          messages(prev) {
            const existingMessages = prev.find(
              (aMessage) => aMessage.__ref === incomingMessage.__ref
            );
            if (existingMessages) {
              console.log(existingMessages, "existing messages");
              return prev;
            }
            return [...prev, incomingMessage];
          },
        },
      });
    }
  };
  useEffect(() => {
    if (seeRoomData?.seeRoom) {
      subscribeToMore({
        document: ROOM_UPDATES,
        variables: {
          id: seeRoomData?.seeRoom.id,
        },
        updateQuery,
      });
    }
    if (hiddenMsg === true) {
      setHiddenMsg(false);
    }
  }, [seeRoomData]);

  // run after loading finished ( !loading)
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
            seeRoomData?.seeRoom?.messages.map((message) => {
              return (
                <MessageContainer
                  outGoing={message.user.id !== location?.state?.id}
                  ref={MessageScroll}
                >
                  <Message
                    hidden={hiddenMsg}
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

export default Room;
