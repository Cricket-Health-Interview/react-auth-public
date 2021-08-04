import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import Home from './Home';
import CocaColaRecipe from './CocaColaRecipe';
import Login from './Login';
import Logout from './Logout';

const App = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/secret">Secret</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/logout">Logout</Link>
        </li>
      </ul>
      <Switch>
        <Route path="/" exact render={(props) => <Home {...props} />} />
        <Route path="/secret" render={(props) => <CocaColaRecipe {...props} />} />
        <Route path="/login" render={(props) => <Login {...props} />} />
        <Route path="/logout" render={(props) => <Logout {...props} />} />
      </Switch>
    </div>
  );
};

export default App;
