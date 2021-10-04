import React from "react";
import styled from "styled-components";
import NavigationBase from "./components/navigation";

import SearchField from "react-search-field";
import Search from "./components/search";
import { gql, useQuery } from "@apollo/client";

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
    }
  }
`;
const Findconnect = (props) => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_USER);

  const onChange = () => {
    console.log("changed");
  };
  return (
    <NavigationBase>
      <div>Find connect</div>

      <Wrapper>{!loading ? <Search data={data.allCarPlate} /> : null}</Wrapper>
    </NavigationBase>
  );
};

export default Findconnect;
