
import React, { Component } from 'react'
import { Card, Input, Button, Table,Layout } from 'antd';
import 'antd/dist/antd.css';
import { lusolve, squeeze, sum } from 'mathjs';
import axios from 'axios';
var api;
const InputStyle = {
    background: "#1890ff",
    color: "white",
    fontWeight: "bold",
    fontSize: "24px"

};
var columns = [
    {
        title: "No.",
        dataIndex: "no",
        key: "no"
    },
    {
        title: "X",
        dataIndex: "x",
        key: "x"
    },
    {
        title: "Y",
        dataIndex: "y",
        key: "y"
    }
];
var x, y, tableTag, regressionMatrixX, regressionMatrixY, matrixA, matrixB, answer

class Polynomial extends Component {

    constructor() {
        super();
        x = []
        y = []

        tableTag = []
        this.state = {
            nPoints: 0,
            m: 0,
            interpolatePoint: 0,
            showInputForm: true,
            showTableInput: false,
            showOutputCard: false
        }
        this.handleChange = this.handleChange.bind(this);


    }

    createTableInput(n, m) {
        for (var i = 1; i <= n; i++) {
            x.push(<Input style={{
                width: "50%",
                height: "40%",
                // backgroundColor: "black",
                marginInlineEnd: "5%",
                marginBlockEnd: "5%",
                color: "black",
                fontSize: "18px",
                fontWeight: "bold",
                justifyContent: "center"
            }}
                id={"x" + i} key={"x" + i} placeholder={"x" + i} />);
            y.push(<Input style={{
                width: "50%",
                height: "40%",
                // backgroundColor: "black",
                marginInlineEnd: "5%",
                marginBlockEnd: "5%",
                color: "black",
                fontSize: "18px",
                fontWeight: "bold"
            }}
                id={"y" + i} key={"y" + i} placeholder={"y" + i} />);
            tableTag.push({
                no: i,
                x: x[i - 1],
                y: y[i - 1]
            })

        }
        regressionMatrixX = new Array(m + 1)
        regressionMatrixY = new Array(m + 1)
        for (i = 1; i <= m + 1; i++) {
            regressionMatrixX[i] = []
            for (var j = 1; j <= m + 1; j++) {
                regressionMatrixX[i][j] = []
            }
        }

        this.setState({
            showInputForm: true,
            showTableInput: true
        })
    }

    initialValue(n, m) {
        x = new Array(m + 1)
        y = []
        for (var i = 1; i <= n; i++) {
            x[i] = parseFloat(document.getElementById("x" + i).value);

        }
        for (i = 1; i <= n; i++) {
            y[i] = parseFloat(document.getElementById("y" + i).value);
        }
    }

    polynomial(n, m) {
        var exponent = 1
        //find matrix X
        for (var i = 1; i <= m + 1; i++) {
            for (var j = 1; j <= m + 1; j++) {
                if (i === 1 && j === 1) {
                    regressionMatrixX[i][j] = n
                    continue
                }
                regressionMatrixX[i][j] = this.summation(x, exponent)
                exponent++

            }
            exponent = i
        }
        //find matrix Y
        regressionMatrixY[1] = sum(y)
        for (i = 2; i <= m + 1; i++) {
            regressionMatrixY[i] = this.summationOfTwo(x, y, i - 1)
        }
        console.log(regressionMatrixY)
        this.findX(m)

    }

    findX(m) {
        matrixA = new Array(m + 1)
        matrixB = new Array(m + 1)
        for (var i = 0; i < m + 1; i++) {
            matrixA[i] = []
            for (var j = 0; j < m + 1; j++) {
                matrixA[i][j] = regressionMatrixX[i + 1][j + 1]
            }
            matrixB[i] = regressionMatrixY[i + 1]
        }
        answer = squeeze(lusolve(matrixA, matrixB))
        console.log(answer)
        this.setState({
            showOutputCard: true
        })
    }

    async dataapi() {
        await axios({
          method: "get",
          url: "http://localhost:5000/database/polynomial",
        }).then((response) => {
          console.log("response: ", response.data);
          api = response.data;
        });
        await this.setState({
            m:api.ordernumber,
            nPoints:api.numberpoint
        })
        
        await this.createTableInput(this.state.nPoints, this.state.m);
        await this.initialValue(parseInt(this.state.nPoints), parseInt(this.state.m));
        await this.polynomial(parseInt(this.state.nPoints), parseInt(this.state.m));
        for (let i = 1; i <= api.numberpoint; i++) {
          document.getElementById("x" + i).value = api.arrayX[i - 1];
          document.getElementById("y" + i).value = api.arrayY[i - 1];
        }
        this.initialValue(parseInt(this.state.nPoints), parseInt(this.state.m));
        this.polynomial(parseInt(this.state.nPoints), parseInt(this.state.m));
      }
      

    summation(A, exponent) {
        var sum = 0
        for (var i = 1; i < A.length; i++) {
            sum += Math.pow(A[i], exponent)
        }
        return sum
    }

    summationOfTwo(x, y, exponent) {
        var sum = 0
        for (var i = 1; i < y.length; i++) {
            sum += Math.pow(x[i], exponent) * y[i]
        }
        return sum
    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    render() {
        const { Header, Content, Footer } = Layout;
        return (
            <Content className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
            <div style={{ background: "#f5f5dc", padding: 200 }}>
                <h1 style={{ textAlign: 'center',fontSize:'30px' }}>Polynomial Regression</h1>
                <div>
                    <div className="col"onChange={this.handleChange}style = {{textAlign: 'center',fontSize:'21px'}}>
                        
                            {this.state.showInputForm &&
                                <div>
                                    <h4>Number of points(n) : &nbsp;&nbsp;<Input size="large" name="nPoints" value={this.state.nPoints} style={{ width: 300 }}></Input></h4><br />
                                    <h4>Order(m) : &nbsp;&nbsp;<Input size="large" name="m" value={this.state.m} style={ { width: 300 }}></Input></h4><br />
                                    <Button id="dimention_button" size="large"onClick={
                                        () => this.createTableInput(parseInt(this.state.nPoints), parseInt(this.state.m))}
                                        style={{ background: "#008080", color: "white"}}>
                                        Submit<br></br>
                                    </Button>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <Button type="submit"   size="large"
                                        style={{ color:'black',background:'#f7c602'}}
                                        onClick={() => this.dataapi()}>
                                            Function
                                        </Button>
                                </div>
                            }

                            {this.state.showTableInput &&
                                <div>
                                    <br />
                                    <Table columns={columns} dataSource={tableTag} pagination={false} bordered={true} bodyStyle={{ fontWeight: "bold", fontSize: "18px", color: "white", overflowY: "scroll", minWidth: 120, maxHeight: 300 }}></Table><br />
                                    <Button
                                        id="matrix_button"size="large"
                                        style={{width: 150 , background: "#f7c602", color: "black" }}
                                        onClick={() => {
                                            this.initialValue(parseInt(this.state.nPoints), parseInt(this.state.m));
                                            this.polynomial(parseInt(this.state.nPoints), parseInt(this.state.m))
                                        }}
                                    >
                                        Submit
                                </Button>
                                </div>
                            }

                    </div>
                    <br />
                    <div className="col">
                        {this.state.showOutputCard &&
                            <Card
                                title={"Output"}
                                bordered={true}
                                style={{  background: "white", color: "black" }}
                            >
                                <p style={{ fontSize: "24px", fontWeight: "bold" }}>x = {JSON.stringify(answer).replace(',', '\n')}</p>
                            </Card>
                        }
                    </div>
                </div>
            </div>
            </Content>
        );
    }
}
export default Polynomial;