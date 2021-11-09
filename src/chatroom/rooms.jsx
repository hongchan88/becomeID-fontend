import React, { useEffect, useMemo, useState } from "react";
import NavigationBase from "../components/navigation";
import { gql, useMutation, useQuery } from "@apollo/client";
import styled from "styled-components";
import useMe from "../hook/useMe";
import Pagination from "./pagination";
import { AiFillMessage, AiTwotoneDelete } from "react-icons/ai";
import { Link, useHistory } from "react-router-dom";

const DELETE_ROOM = gql`
  mutation deleteroom($id: Int!) {
    deleteroom(id: $id) {
      ok
      error
      roomId
    }
  }
`;

const SEE_ROOMS_QUERY = gql`
  query seeRooms {
    seeRooms {
      id
      totalPayloads
      users {
        id
        email
        car_plates
      }
    }
  }
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: space-evenly;
  align-items: center;
`;
const InfoBox = styled.div`
  display: flex;
  flex-direction: column;

  p:last-child {
    margin-top: 5px;
    font-size: 0.6rem;
  }
`;

const Container = styled.div`
  display: flex;

  width: 60%;

  border: solid 1px grey;
  padding: 10px 15px;
  margin-bottom: 15px;
  border-radius: 10px;
`;

const ContainerBox = styled.div`
  display: flex;
  width: 90%;
`;

const DeleteBox = styled.div`
  display: flex;
  flex-direction: row;
  width: 10%;
`;

let PageSize = 4;
const Rooms = (props) => {
  const { data, error, loading, refetch } = useQuery(SEE_ROOMS_QUERY);
  const { data: meData } = useMe();
  const [filtered, setFiltered] = useState();

  const [currentPage, setcurrentPage] = useState(1);
  const history = useHistory();
  useEffect(() => {
    refetch();
    console.log("refetched");
  }, []);

  const updatedDeleteRoom = (cache, result) => {
    const {
      deleteroom: { ok, error, roomId },
    } = result.data;
    if (!ok) {
      alert("room is not exist");
    } else {
      const arrayData = cache.data.data[`Room:${roomId}`].messages;
      cache.evict({ id: `Room:${roomId}` }); // delete chat room
      arrayData.forEach((message) => {
        cache.evict({ id: message.__ref }); // delete message cache foreach loop
      });
    }
  };

  const [deleteRoomMutation, { loading: deleteRoomLoading }] = useMutation(
    DELETE_ROOM,
    { update: updatedDeleteRoom }
  );
  const deleteRoom = (roomId) => {
    console.log(deleteRoomLoading);
    if (deleteRoomLoading) {
      return;
    }

    deleteRoomMutation({ variables: { id: roomId } });
  };

  const currentTableData = useMemo(() => {
    if (!loading) {
      const firstPageIndex = (currentPage - 1) * PageSize;
      const lastPageIndex = firstPageIndex + PageSize;

      const filteredData = data?.seeRooms?.filter(
        (room) => room.totalPayloads > 0
      );
      setFiltered(filteredData);

      return filteredData.slice(firstPageIndex, lastPageIndex);
    }
  }, [currentPage, data]);

  console.log(currentTableData);

  return (
    <NavigationBase>
      <Wrapper>
        {currentTableData?.map((room) => (
          <Container>
            <ContainerBox>
              <div>
                <AiFillMessage
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    history.push("/room", {
                      id:
                        meData?.me?.id === room.users[0].id
                          ? room.users[1].id
                          : room.users[0].id,
                    });
                  }}
                  size="35"
                />
              </div>
              <InfoBox>
                <p>
                  {room.users[0].car_plates === meData.me.car_plates
                    ? room.users[1].car_plates
                    : room.users[0].car_plates}
                </p>
                <p>total {room.totalPayloads} messages</p>
              </InfoBox>
            </ContainerBox>
            <DeleteBox>
              <AiTwotoneDelete
                onClick={() => deleteRoom(room.id)}
                style={{ cursor: "pointer" }}
                size="25"
              />
            </DeleteBox>
          </Container>
        ))}
        {filtered ? (
          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={filtered?.length}
            pageSize={PageSize}
            onPageChange={(page) => setcurrentPage(page)}
          />
        ) : (
          "loading"
        )}
      </Wrapper>
    </NavigationBase>
  );
};

export default Rooms;
