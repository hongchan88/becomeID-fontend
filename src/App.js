import { ApolloProvider, useReactiveVar } from "@apollo/client";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { client, isLoggedInVar } from "./apollo";
import Findconnect from "./findconnect";
import Home from "./home";
import Login from "./login";
import Profile from "./profile";
import Register from "./register";
import Signup from "./signup";
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
          <Route path="/profile" exact>
            {isLoggedIn ? <Profile /> : <Login />}
          </Route>
        </Switch>
      </Router>
    </ApolloProvider>
  );
}

export default App;
