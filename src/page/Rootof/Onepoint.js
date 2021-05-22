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
    fontSize: "24px",

};
var dataInTable = []
const columns = [
    {
        title: "Iteration",
        dataIndex: "iteration",
        key: "iteration"
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

class Onepoint extends Component {

    constructor() {
        super();
        this.state = {
            fx: "",
            x0: 0,
            showOutputCard: false,
            showTable: true
        }
        this.handleChange = this.handleChange.bind(this);
        this.onepoint = this.onepoint.bind(this);
    }
    
    onepoint(xold) {
        var xnew = 0;
        var epsilon = parseFloat(0.000000);
        var n = 0;
        var data = []
        data['x'] = []
        data['error'] = []

        do {
            xnew = func(this.state.fx, xold);
            epsilon = error(xnew, xold)
            data['x'][n] = xnew.toFixed(8);
            data['error'][n] = Math.abs(epsilon).toFixed(8);
            n++;
            xold = xnew;

        } while (Math.abs(epsilon) > 0.000001);

        this.createTable(data['x'], data['error']);
        this.setState({
            showOutputCard: true,
            showGraph: true
        })
    }

    createTable(x, error) {
        dataInTable = []
        for (var i = 0; i < x.length; i++) {
            dataInTable.push({
                key:i,
                iteration: i + 1,
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
        await axios({method: "get",url: "http://localhost:5000/database/onepoint",}).then((response) => {console.log("response: ", response.data);api = response.data;});
        await this.setState({
            fx:api.fx,
          x0:api.x0
          
          
        })
        this.onepoint(this.state.x0)
      }
    render() {
        const { Header, Content, Footer } = Layout;
        let { fx, x0 } = this.state;
        return (
            <Content className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
            <div style={{padding: 143, background: '#f5f5dc' }}>
                {/* <h2>One Point Iteration</h2> */}
                <h1 style = {{textAlign: 'center',fontSize:'30px'}}>One Point Iteration </h1>


                <form style = {{textAlign: 'center',fontSize:'21px'}}
                  
                  >
                    <h4>Equation  : &nbsp;&nbsp;               
                      <Input size="large" placeholder="Input your Function" name ="fx" value={this.state.fx}style={{ width: 300 }}
                      onChange={this.handleChange}
                      />
                    </h4>
                    <br></br>
                    <h4>X0 : &nbsp;&nbsp;
                      <Input size="large" placeholder="Input your X0" name ="x0" value={this.state.x0}style={{ width: 200 }}
                      onChange={this.handleChange}
                      />
                    </h4>
                    <br></br>
                    
                    
                    <Button type="submit"   size="large"
                    style={{ color:'#ffffff',background:'#cc0000'}}
                    onClick={() => this.onepoint(parseFloat(x0))}
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
export default Onepoint;