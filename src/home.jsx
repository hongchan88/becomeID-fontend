import { isLoggedInVar, logUserOut } from "./apollo";
import BasicMenu from "./basicmenu";
import styled from "styled-components";
import NavigationBase from "./components/navigation";

const HomeText = styled.div`
  text-align: center;
`;
const Home = (props) => (
  <NavigationBase>
    <HomeText>
      <p>Register your ID </p>
      <p>Allowing people to reach you by registered ID </p>
    </HomeText>
  </NavigationBase>
);

export default Home;
