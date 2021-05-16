import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { Input, Typography, Button, Table } from 'antd';
import { range, compile, evaluate, simplify, parse, abs } from 'mathjs'
// import createPlotlyComponent from 'react-plotlyjs'
// import Plotly from 'plotly.js/dist/plotly-cartesian'
//import api from '../api'
//import Title from 'antd/lib/skeleton/Title';
// const PlotlyComponent = createPlotlyComponent(Plotly)
import 'antd/dist/antd.css';
import './style.css'
const axios = require("axios")


// var dataGraph = []

const { Title } = Typography;
var api;
const columns = [
    {
        title: 'Iteration',
        dataIndex: 'iteration',
        key: 'iteration'
    },
    {
        title: 'XL',
        dataIndex: 'xl',
        key: 'xl'
    },
    {
        title: 'XR',
        dataIndex: 'xr',
        key: 'xr'
    },
    {
        title: 'XM',
        dataIndex: 'xm',
        key: 'xm'
    },
    {
        title: 'Error',
        dataIndex: 'error',
        key: 'error'
    },
];

var dataTable = [];

class Bisection extends Component {
    constructor() {
        super();
        this.state = {
            size: 'large',
            fx: "",
            xl: 0,
            xr: 0,
            showTable: true
        };


        this.onInputChange = this.onInputChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    // !! API
    // componentDidMount = async() => { 
    //   await api.getFunctionByName("Bisection").then(db => {
    //   this.setState({
    //       fx:db.data.data.fx,
    //       xr:db.data.data.xr,
    //       xl:db.data.data.xl,
    //   })
    //   console.log(this.state.fx);
    //   console.log(this.state.xl);
    //   console.log(this.state.xr);
    //   })
    // }

    // Graph(xl, xr)
    // {
    //       dataGraph = [
    //       {
    //         type: 'scatter',  
    //         x: xl,        
    //         marker: {         
    //           color: '#a32f0f'
    //         },
    //         name:'XL'
    //       },
    //       {
    //       type: 'scatter',  
    //       x: xr,        
    //       marker: {         
    //         color: '#3c753c'
    //       },
    //       name:'XR'
    //     }];

    //   }
    ////////////////
    func(x) {
        let scope = { x: parseFloat(x) };
        var expr = compile(this.state.fx);
        return expr.evaluate(scope)
    }

    error(xo, xm) {
        return Math.abs((xm - xo) / xm);
    }


    createTable(xl, xr, xm, error) {
        dataTable = []
        var i = 0;
        for (i = 1; i < error.length; i++) {
            dataTable.push({
                key: i,
                iteration: i,
                xl: xl[i],
                xr: xr[i],
                xm: xm[i],
                error: error[i],
            });
        }

    }
    ///////////////////

    // !!!!!!!!!
    onInputChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
        console.log(this.state);
    }
    // !!!!!!! Bisection
    onSubmit() {
        var fx = this.state.fx;
        var xl = this.state.xl;
        var xr = this.state.xr;
        var xo = 0;
        var xm = 0;
        var i = 0;
        var error = 1;
        var data = []
        data['xl'] = []
        data['xr'] = []
        data['xm'] = []
        data['error'] = []
        data['iteration'] = []

        while (error >= 0.000001) {
            xm = (parseFloat(xl) + parseFloat(xr)) / 2;
            console.log(xm)
            ////
            if (this.func(xm) == 0) {
                break;
            } else if (this.func(xm) * this.func(xr) < 0) {
                xl = xm;
                console.log(this.func(xl) + " " + this.func(xr) + " " + this.func(xm));
            } else {
                xr = xm;
            }
            console.log(this.func(xl) + " " + this.func(xr) + " " + this.func(xm));
            ////
            error = this.error(xo, xm);

            //console.log(data['xl']+" "+data['xr']);
            data['iteration'][i] = i;
            data['xl'][i] = parseFloat(xl).toFixed(6);
            data['xr'][i] = parseFloat(xr).toFixed(6);
            data['xm'][i] = parseFloat(xm).toFixed(6);
            data['error'][i] = error.toFixed(6);
            xo = xm;
            i++;

        }
        console.log(this.state);
        ////
        this.createTable(data['xl'], data['xr'], data['xm'], data['error']);
        this.setState({ showTable: true, showGrap: true })
        // !!!!!!!!!!!!!!!!!!
        // this.Graph(data['xl'], data['xr'])

        //this.bisection(parseFloat(this.state.xl),parseFloat(this.state.xr));
    }
    async ex() {
        await axios({ method: "get", url: "http://localhost:5000/database/bisection", }).then((response) => { console.log("response: ", response.data); api = response.data; });
        await this.setState({
            fx: api.fx,
            xl: api.xl,
            xr: api.xr
        })
    }
    render() {

        let layout = {
            title: 'Bisection',
            xaxis: {
                title: 'X'
            }
        };
        let config = {
            showLink: false,
            displayModeBar: true
        };

        const { size } = this.state;
        return (
            <div id="content" style={{ padding: 21, background: '#f5f5dc', minHeight: 710 }}>
                <div className="header_area">
                    <h1>Bisection Method</h1>
                </div>
                <form style={{ textAlign: 'center' }}
                    onSubmit={this.onInputChange}
                >
                    <h4 style={{ color: '#000000' }}>Equation  : &nbsp;&nbsp;
                <Input size="Default" placeholder="Input your Function" name="fx" value={this.state.fx} style={{ width: 285 }}
                            onChange={this.onInputChange}
                        />
                    </h4>
                    <br></br>
                    <h4>XL&nbsp;&nbsp;
                <Input size="Default" placeholder="Input XL" name="xl" value={this.state.xl} style={{ width: 160 }}
                            onChange={this.onInputChange}
                        />
                XR  &nbsp;&nbsp;
                <Input size="Default" placeholder="Input XR" name="xr" value={this.state.xr} style={{ width: 160 }}
                            onChange={this.onInputChange}
                        />
                    </h4>
                    { <Button type="submit" size={100}
                        style={{ color: '#CCFFFF', background: '#cc0000' }}
                        onClick={this.onSubmit}
                    >
                        Submit
              </Button> }
                    <Button type="submit" size={100}
                        style={{ color: '#CCFFFF', background: '#66cc00' }}
                        onClick={() => this.ex()}>
                        api
              </Button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {/* <Button type="submit"   size={size}
              style={{ color:'#ffffff',background:'#f7c602'}}
              onClick={this.onSubmit}
              >
                Function
              </Button> */}
                </form>

                <div>
                    <br></br>
                    <br></br>
                    <br></br>

                    {this.state.showTable === true ?
                        <div>
                            {/* <h2 style = {{textAlign: 'center'}}>Table of Bisection</h2>

       <h4 style = {{textAlign: 'center'}}> FX = {this.state.fx}
       <br></br> XL = {this.state.xl} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; XR = {this.state.xr}
      <br></br>
      <br></br> */}
                            <Table columns={columns} dataSource={dataTable} size="middle" />
                            {/* </h4> */}

                        </div>
                        : ''
                    }


                    {/* {this.state.showGrap === true ? 
        <PlotlyComponent  data={dataGraph} Layout={layout} config={config} /> : ''
    } */}

                </div>

            </div>

        );
    }
}


export default Bisection;