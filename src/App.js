import { ApolloProvider, useReactiveVar } from "@apollo/client";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { client, isLoggedInVar } from "./apollo";
import Room from "./chatroom/room";
import Rooms from "./chatroom/rooms";

import Findconnect from "./menu/findconnect";
import Home from "./home";
import Login from "./loginSignup/login";

import Register from "./menu/register";
import Signup from "./loginSignup/signup";
import { GlobalStyles } from "./styles";

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return (
    <ApolloProvider client={client}>
      <GlobalStyles />
      <Router>
        <Switch>
          <Route path="/" exact>
            {isLoggedIn ? <Home /> : <Login />}
          </Route>
          <Route path="/signup" exact>
            <Signup />
          </Route>
          <Route path="/home" exact>
            {isLoggedIn ? <Home /> : <Login />}
          </Route>
          <Route path="/register" exact>
            {isLoggedIn ? <Register /> : <Login />}
          </Route>
          <Route path="/findconnect" exact>
            {isLoggedIn ? <Findconnect /> : <Login />}
          </Route>
          <Route path="/room" exact>
            {isLoggedIn ? <Room /> : <Login />}
          </Route>
          <Route path="/rooms" exact>
            {isLoggedIn ? <Rooms /> : <Login />}
          </Route>
        </Switch>
      </Router>
    </ApolloProvider>
  );
}

export default App;
