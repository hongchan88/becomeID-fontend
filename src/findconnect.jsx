import React, { useEffect } from "react";
import styled from "styled-components";
import NavigationBase from "./components/navigation";

import SearchField from "react-search-field";
import Search from "./components/search";
import { gql, useQuery } from "@apollo/client";
import useMe from "./hook/useMe";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120%;
`;

const GET_ALL_USER = gql`
  query allCarPlate {
    allCarPlate {
      car_plates
      email
      id
    }
  }
`;
const Findconnect = (props) => {
  const { data: meData } = useMe();
  const { loading, error, data, refetch } = useQuery(GET_ALL_USER);

  useEffect(() => {
    refetch();
    console.log("refetched");
  }, []);

  const onChange = () => {
    console.log("changed");
  };
  return (
    <NavigationBase>
      <Wrapper>
        {!loading ? (
          <Search data={data.allCarPlate} myId={meData?.me?.id} />
        ) : null}
      </Wrapper>
    </NavigationBase>
  );
};

export default Findconnect;
