import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { logUserOut } from "../apollo";
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
  height: 80vh;
  font-size: 1.2rem;
  color: #808080;
  form {
    margin-top: 35px;
    width: 100%;

    display: flex;
    justify-items: center;
    flex-direction: column;
    align-items: center;
    input {
    }
  }
`;

const Wrapper = styled.div`
  max-width: 500px;
  width: 100%;
`;

const Navigation = styled.ul`
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 0.8em;
`;

const NavigationBase = (props) => (
  <Container>
    <Wrapper>
      <Navigation>
        <li>
          <Link to="/Home">Home</Link>
        </li>
        <li>
          <Link to="/register">Register ID</Link>
        </li>
        <li>
          <Link to="/findconnect">Find & Connect</Link>
        </li>
        <li>
          <Link to="/rooms">Messages</Link>
        </li>
        <li>
          <Link to="/" onClick={() => logUserOut()}>
            Log out
          </Link>
        </li>
      </Navigation>

      <TopBox>{props.children}</TopBox>
    </Wrapper>
  </Container>
);

export default NavigationBase;
