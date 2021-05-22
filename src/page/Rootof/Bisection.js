import React, { Component } from 'react'
import {Card, Input, Button, Table, Layout} from 'antd';
import 'antd/dist/antd.css';
import { error, func } from '../../services/Services';
import axios from 'axios';

var api;
var dataInTable = []
const columns = [
    {
        title: "Iteration",
        dataIndex: "iteration",
        key: "iteration"
    },
    {
        title: "XL",
        dataIndex: "xl",
        key: "xl"
    },
    {
        title: "XR",
        dataIndex: "xr",
        key: "xr"
    },
    {
        title: "X",
        dataIndex: "x",
        key: "x"
    },
    {
        title: "Error",
        key: "error",
        dataIndex: "error"
    }
];

class Bisection extends Component {

    constructor() {
        super();
        this.state = {
            fx: "",
            xl: 0,
            xr: 0,
            showTable: true
        }
        this.handleChange = this.handleChange.bind(this);
        this.bisection = this.bisection.bind(this);
    }

    bisection(xl, xr) {
        var increaseFunction = false;
        var xm = 0;
        var sum = parseFloat(0.000000);
        var n = 0;
        var data = []
        data['xl'] = []
        data['xr'] = []
        data['x'] = []
        data['error'] = []
        if (func(this.state.fx, xl) < func(this.state.fx, xr)) {
            increaseFunction = true;
        }

        do {
            xm = (xl + xr) / 2;
            if (func(this.state.fx, xm) * func(this.state.fx, xr) < 0) {
                sum = error(xm, xr);
                if (increaseFunction) {
                    xl = xm;
                }
                else {
                    xr = xm;
                }

            }
            else {
                sum = error(xm, xl);
                if (increaseFunction) {
                    xr = xm;
                }
                else {
                    xl = xm;
                }
            }
            data['xl'][n] = xl;
            data['xr'][n] = xr;
            data['x'][n] = xm.toFixed(8);
            data['error'][n] = Math.abs(sum).toFixed(8);
            n++;
        } while (Math.abs(sum) > 0.000001);
        this.createTable(data['xl'], data['xr'], data['x'], data['error']);
        this.setState({
            showOutputCard: true,
        })


    }

    createTable(xl, xr, x, error) {
        dataInTable = []
        for (var i = 0; i < xl.length; i++) {
            dataInTable.push({
                key:i,
                iteration: i + 1,
                xl: xl[i],
                xr: xr[i],
                x: x[i],
                error: error[i]
            });
        }

    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });

    }
    
    async dataapi() {
        await axios({method: "get",url: "http://localhost:5000/database/bisection",}).then((response) => {console.log("response: ", response.data);api = response.data;});
        await this.setState({
            fx:api.fx,
          xl:api.xl,
          xr:api.xr
        })
        this.bisection(this.state.xl,this.state.xr)
      }
      
   
    render() {
        let { fx, xl, xr } = this.state;
        const { Header, Content, Footer } = Layout;
        return (
            <Content className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
            <div style={{padding: 100, background: '#f5f5dc' }}>
                <h1 style = {{textAlign: 'center',fontSize:'30px'}}>Bisection Method </h1>
                

                <form style = {{textAlign: 'center',fontSize:'21px'}} id="inputCard"
                >
                  <h4>Equation  : &nbsp;&nbsp;               
                    <Input size="large" placeholder="Input your Function" name ="fx" value={this.state.fx} style={{ width: 300 }}
                    onChange={this.handleChange}
                    />
                  </h4>
                  <br></br>
                  <h4>XL : &nbsp;&nbsp;
                    <Input size="large" placeholder="Input your Xl" name ="xl" value={this.state.xl} style={{ width: 200 }}
                    onChange={this.handleChange}
                    />
                  </h4>
                  <br></br>
                  <h4>XR : &nbsp;&nbsp;
                    <Input size="large" placeholder="Input your Xr" name = "xr" value={this.state.xr} style={{ width: 200 }}
                    onChange={this.handleChange}
                    />
                  </h4>
                  <br></br>
                  
                  <Button type="submit"   size="large"
                  style={{ color:'#ffffff',background:'#cc0000'}}
                  onClick={() => this.bisection(parseFloat(xl), parseFloat(xr))}
                  >
                    Submit
                  </Button>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <Button type="submit"   size="large"
                  style={{ color:'#ffffff',background:'#f7c602'}}
                  onClick={() => this.dataapi()}
                  >
                    Function
                  </Button>
                </form>
                <br></br>
                <div className="row">
                {this.state.showTable === true ?
                        <div>
                            <Table columns={columns} dataSource={dataInTable} size="middle" />
                        </div>
                        : ''
                    }
                </div>
            </div>
            </Content>

        );
    }
}

export default Bisection;