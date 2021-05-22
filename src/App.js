import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Bar from './componant/bar';
import {BrowserRouter as Router, Switch,Route,Link} from "react-router-dom";
import Bisection from '../src/page/Rootof/Bisection';

export default function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/">
            <Bar />
          </Route>
           <Route path="/Bisection">
            <Bisection />
          </Route>
          {/* <Route path="/FalsePosition">
            <FalsePosition />
          </Route>
          <Route path="/OnePointIteration">
            <OnePointIteration />
          </Route>
          <Route path="/NewtonRaphson">
            <NewtonRaphson />
          </Route>  */}
        </Switch>
      </div>
    </Router>
  )
  }