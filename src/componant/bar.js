import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
//import './style.css';
import home from '../page/home';
import Bisection from '../page/Bisection';
import FalsePosition from '../page/False_position';


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
                        <NavDropdown.Item> <Link to="/GaussElimination" id="H">Gauss Elimination</Link></NavDropdown.Item>
                        <NavDropdown.Item> <Link to="/GaussJordan" id="H">Gauss-Jordan</Link></NavDropdown.Item>
                        <NavDropdown.Item> <Link to="/LUDecomposition" id="H">LU Decomposition</Link></NavDropdown.Item>
                        <NavDropdown.Item> <Link to="/JacobiIteration" id="H">Jacobi Iteration</Link></NavDropdown.Item>
                        <NavDropdown.Item> <Link to="/GaussSeidelIteration" id="H">Gauss-Seidel Iteration</Link></NavDropdown.Item>
                        <NavDropdown.Item> <Link to="/CojugateGradirnt" id="H">Cojugate Gradirnt</Link></NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown title="INTERPOLATION TECHNIQUES" id="basic-nav-dropdown">
                        <NavDropdown title="Newton's-Divided-Differences" id="basic-nav-dropdown">
                            <NavDropdown.Item ><Link to="/Linear" id="H">Linear</Link></NavDropdown.Item>
                            <NavDropdown.Item ><Link to="/Quadratic" id="H">Quadratic</Link></NavDropdown.Item>
                            <NavDropdown.Item ><Link to="/Polynomials" id="H">Polynomials</Link></NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Lagrange-Polynomials" id="basic-nav-dropdown">
                            <NavDropdown.Item ><Link to="/Linear" id="H">Linear</Link></NavDropdown.Item>
                            <NavDropdown.Item ><Link to="/Quadratic" id="H">Quadratic</Link></NavDropdown.Item>
                            <NavDropdown.Item ><Link to="/Polynomials" id="H">Polynomials</Link></NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Spline-Interpolation" id="basic-nav-dropdown">
                            <NavDropdown.Item ><Link to="/Inearspline" id="H">Inear Spline</Link></NavDropdown.Item>
                            <NavDropdown.Item ><Link to="/PolynomialsRegression" id="H">Polynomials Regression</Link></NavDropdown.Item>
                            <NavDropdown.Item ><Link to="/MutipleRegression" id="H">Mutiple Regression</Link></NavDropdown.Item>
                        </NavDropdown>
                    </NavDropdown>

                    <NavDropdown title="SQUARES REGRESSION" id="basic-nav-dropdown">
                        <NavDropdown.Item ><Link to="/linearRegression" id="H">linear Regression</Link></NavDropdown.Item>
                        <NavDropdown.Item ><Link to="/PolynomialsRegression" id="H">Polynomials Regression</Link></NavDropdown.Item>
                        <NavDropdown.Item ><Link to="/Mutipleregression" id="H">Mutiple Regression</Link></NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
        <Switch>
            <Route exact path="/home" component={home} ></Route>
            <Route exact path="/Bisection" component={Bisection} ></Route>
            <Route exact path="/FalsePosition" component={FalsePosition} ></Route>
        </Switch>
        </Router>
    );
}
export default Bar;