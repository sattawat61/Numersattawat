
import React, { Component } from 'react'
import { Card, Input, Button, Table,Layout } from 'antd';
import 'antd/dist/antd.css';
import { error, func } from '../../services/Services';
import axios from 'axios';
var api;
const InputStyle = {
    background: "#1890ff",
    color: "white",
    fontWeight: "bold",
    fontSize: "24px"

};
var dataInTable = []
const columns = [
    {
        title: "Iteration",
        dataIndex: "iteration",
        key: "iteration"
    },
    {
        title: "Y",
        dataIndex: "y",
        key: "y"
    },
    {
        title: "Error",
        key: "error",
        dataIndex: "error"
    }
];

class Secant extends Component {
    constructor() {
        super();
        this.state = {
            fx: "",
            x0: 0,
            x1: 0,
            showOutputCard: false,
            showTable: true
        }
        this.handleChange = this.handleChange.bind(this);
        this.secant = this.secant.bind(this);
    }

    secant(x0, x1) {
        var x = [], y = 0, epsilon = parseFloat(0.000000);
        var n = 1, i = 1;
        var data = []
        data['y'] = []
        data['error'] = []
        x.push(x0);
        x.push(x1);
        data['y'][0] = x0;
        data['error'][0] = "---";

        do {
            y = x[i] - (func(this.state.fx, x[i]) * ((x[i] - x[i - 1]))) / (func(this.state.fx, x[i]) - func(this.state.fx, x[i - 1]));
            x.push(y);
            epsilon = error(y, x[i]);
            data['y'][n] = y.toFixed(8);
            data['error'][n] = Math.abs(epsilon).toFixed(8);

            n++;
            i++;

        } while (Math.abs(epsilon) > 0.000001);
        this.createTable(data['y'], data['error']);
        this.setState({
            showOutputCard: true,
            showGraph: true
        })


    }

    createTable(y, error) {
        dataInTable = []
        for (var i = 0; i < y.length; i++) {
            dataInTable.push({
                key:i,
                iteration: i + 1,
                y: y[i],
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
        await axios({method: "get",url: "http://localhost:5000/database/secant",}).then((response) => {console.log("response: ", response.data);api = response.data;});
        await this.setState({
            fx:api.fx,
          xl:api.x0,
          x1:api.x1
          
        })
        this.secant(this.state.x0,this.state.x1)
      }
    render() {
        let { fx, x0, x1 } = this.state;
        const { Header, Content, Footer } = Layout;
        return (
            <Content className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
            <div style={{padding: 100, background: '#f5f5dc' }}>
                <h1 style = {{textAlign: 'center',fontSize:'30px'}}>Secant Method</h1>
                <form style = {{textAlign: 'center',fontSize:'21px'}}>
                    <h4>Equation  : &nbsp;&nbsp;               
                      <Input size="large" placeholder="Input your Function" name ="fx" value={this.state.fx}style={{ width: 300 }}
                      onChange={this.handleChange}
                      />
                    </h4>
                    <br></br>
                    <h4>X0 : &nbsp;&nbsp;
                      <Input size="large" placeholder="Input your Xl" name ="x0" value={this.state.x0}style={{ width: 200 }}
                      onChange={this.handleChange}
                      />
                    </h4>
                    <br></br>
                    <h4>X1 : &nbsp;&nbsp;
                      <Input size="large" placeholder="Input your Xr" name = "x1"value={this.state.x1}style={{ width: 200 }}
                      onChange={this.handleChange}
                      />
                    </h4>
                    <br></br>
                    
                    <Button type="submit"   size="large"
                    style={{ color:'#ffffff',background:'#cc0000'}}
                    onClick={() => this.secant(parseFloat(x0), parseFloat(x1))}
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
export default Secant;




