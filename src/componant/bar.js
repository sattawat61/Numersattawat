import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
//import './style.css';
import home from '../page/home';
import Bisection from '../page/Rootof/Bisection';
import FalsePosition from '../page/Rootof/False_position';
import Onepoint from '../page/Rootof/Onepoint';
import secant from '../page/Rootof/Secant';
import Newton from '../page/Rootof/Newton-raphson';
import Cramer from '../page/Linear Algebra/Cramer';
import Cholesky from '../page/Linear Algebra/Cholesky';
import Gauss from '../page/Linear Algebra/Gauss';
import Gradient from '../page/Linear Algebra/Gradient';
import Jordan from '../page/Linear Algebra/Jordan';
import LU from '../page/Linear Algebra/LU';
import Jacobi from '../page/Linear Algebra/jacobi';
import Seidel from '../page/Linear Algebra/Seidal';
import Linear from '../page/Regression/Linear';
import MultipleLinear from '../page/Regression/MultipleLinear';
import Polynomial from '../page/Regression/Polynomial';
import Lagrange from '../page/Interpolation/Lagrange';
import Newton1 from '../page/Interpolation/Newton';
import Spline from '../page/Interpolation/Spline';



function Bar() {
    return (
        <Router>
        <Navbar className ="navbar" expand="lg">
            <Navbar.Brand className="home"><Link to="/home">Home</Link></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <NavDropdown title="ROOTS OF EQUATIONS" id="basic-nav-dropdown">
                        <NavDropdown.Item ><Link to="/Bisection" id="H">Bisection</Link></NavDropdown.Item>
                        <NavDropdown.Item ><Link to="/FalsePosition" id="H">False Position</Link></NavDropdown.Item>
                        <NavDropdown.Item ><Link to="/OnePointIteration" id="H">One Point Iteration</Link></NavDropdown.Item>
                        <NavDropdown.Item ><Link to="/NewtonRaphson" id="H">Newton Raphson</Link></NavDropdown.Item>
                        <NavDropdown.Item ><Link to="/SecentMethod" id="H">Secent Method</Link></NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown title="LINEAR EQUATION" id="basic-nav-dropdown">
                        <NavDropdown.Item> <Link to="/Cramer" id="H">Cramer</Link></NavDropdown.Item>             
                        <NavDropdown.Item> <Link to="/Cholesky" id="H">Cholesky</Link></NavDropdown.Item>
                        <NavDropdown.Item> <Link to="/GaussElimination" id="H">Gauss Elimination</Link></NavDropdown.Item>
                        <NavDropdown.Item> <Link to="/GaussJordan" id="H">Gauss-Jordan</Link></NavDropdown.Item>
                        <NavDropdown.Item> <Link to="/LUDecomposition" id="H">LU Decomposition</Link></NavDropdown.Item>
                        <NavDropdown.Item> <Link to="/JacobiIteration" id="H">Jacobi Iteration</Link></NavDropdown.Item>
                        <NavDropdown.Item> <Link to="/GaussSeidelIteration" id="H">Gauss-Seidel Iteration</Link></NavDropdown.Item>
                        <NavDropdown.Item> <Link to="/CojugateGradirnt" id="H">Cojugate Gradirnt</Link></NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown title="INTERPOLATION TECHNIQUES" id="basic-nav-dropdown">
                            <NavDropdown.Item ><Link to="/Newton's-Divided-Differences" id="H">Newton's-Divided-Differences</Link></NavDropdown.Item>
                            <NavDropdown.Item ><Link to="/Lagrange-Polynomials" id="H">Lagrange-Polynomials</Link></NavDropdown.Item>
                            <NavDropdown.Item ><Link to="/Spline-Interpolation" id="H">Spline-Interpolation</Link></NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown title="SQUARES REGRESSION" id="basic-nav-dropdown">
                        <NavDropdown.Item ><Link to="/linearRegression" id="H">linear Regression</Link></NavDropdown.Item>
                        <NavDropdown.Item ><Link to="/PolynomialsRegression" id="H">Polynomials Regression</Link></NavDropdown.Item>
                        {/* <NavDropdown.Item ><Link to="/Mutipleregression" id="H">Mutiple Regression</Link></NavDropdown.Item> */}
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
        <Switch>
            <Route exact path="/home" component={home} ></Route>
            <Route exact path="/Bisection" component={Bisection} ></Route>
            <Route exact path="/FalsePosition" component={FalsePosition} ></Route>
            <Route exact path="/OnepointIteration" component={Onepoint} ></Route>
            <Route exact path="/SecentMethod" component={secant} ></Route>
            <Route exact path="/NewtonRaphson" component={Newton} ></Route>
            <Route exact path="/linearRegression" component={Linear} ></Route>
            <Route exact path="/Cramer" component={Cramer} ></Route>
            <Route exact path="/Cholesky" component={Cholesky} ></Route>
            <Route exact path="/GaussElimination" component={Gauss} ></Route>
            <Route exact path="/CojugateGradirnt" component={Gradient} ></Route>
            <Route exact path="/GaussJordan" component={Jordan} ></Route>
            <Route exact path="/LUDecomposition" component={LU} ></Route>
            <Route exact path="/JacobiIteration" component={Jacobi} ></Route>
            <Route exact path="/GaussSeidelIteration" component={Seidel} ></Route>
            <Route exact path="/Mutipleregression" component={MultipleLinear} ></Route>
            <Route exact path="/PolynomialsRegression" component={Polynomial} ></Route>
            <Route exact path="/Newton's-Divided-Differences" component={Newton1} ></Route>
            <Route exact path="/Lagrange-Polynomials" component={Lagrange} ></Route>
            <Route exact path="/Spline-Interpolation" component={Spline} ></Route>
        </Switch>
        </Router>
    );
}
export default Bar;