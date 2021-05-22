
import React, { Component } from 'react'
import { Card, Input, Button, Table,Layout } from 'antd';
import { det, add, subtract, multiply, transpose } from 'mathjs';
// import '../../screen.css';
import 'antd/dist/antd.css';
import axios from 'axios';
// const InputStyle = {
//     background: "#1890ff",
//     color: "white",
//     fontWeight: "bold",
//     fontSize: "24px"

// };
var api
var A = [], B = [], matrixA = [], matrixB = [], matrixX = [], x, epsilon, dataInTable = [], count = 1, output
var columns = [
    {
        title: "Iteration",
        dataIndex: "iteration",
        key: "iteration"
    },
    {
        title: "λ",
        dataIndex: "lambda",
        key: "lambda"
    },
    {
        title: "{X}",
        dataIndex: "X",
        key: "X"
    },
    {
        title: "Error",
        dataIndex: "error",
        key: "error"
    }
];
class Gradient extends Component {
    constructor() {
        super();
        this.state = {
            row: 0,
            column: 0,
            showDimentionForm: true,
            showMatrixForm: false,
            showOutputCard: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.conjugate_gradient = this.conjugate_gradient.bind(this);

    }
    positive_definite(dimention) {
        var tempMatrix = []
        for (var i = 0; i < dimention; i++) {
            tempMatrix[i] = []
            for (var j = 0; j < dimention; j++) {
                tempMatrix[i][j] = A[i][j];
            }
        }
        if (det(tempMatrix) <= 0) {
            return false;
        }
        if (dimention !== this.state.row - 1) {
            return this.positive_definite(++dimention);
        }
        return true;
    }

    conjugate_gradient() {
        this.initMatrix();
        if (!this.positive_definite(1)) {
            output = "This matrix doesn't positive definite"
            this.setState({
                showOutputCard: true
            });
            return false;
        }
        //find {R0}
        var R = subtract(multiply(A, x), B);
        console.log(R)
        //find D0
        var D = multiply(R, -1);
        console.log(D)
        do {
            //find λ
            var λ = (multiply(multiply(transpose(D), R), -1)) /
                (multiply(multiply(transpose(D), A), D))
            console.log(λ)
            /*------------------------------------------------------------------*/

            //find new {X}
            x = add(x, multiply(λ, D));
            console.log(x)
            //find new {R}
            R = subtract(multiply(A, x), B);
            console.log(R)
            //find epsilon
            epsilon = Math.sqrt(multiply(transpose(R), R)).toFixed(8);
            this.appendTable(λ, JSON.stringify(x).split(',').join(",\n"), epsilon);
            console.log(epsilon)
            var α = (multiply(multiply(transpose(R), A), D)) /
                multiply(transpose(D), multiply(A, D)).toFixed(8);
            console.log(α)
            D = add(multiply(R, -1), multiply(α, D))
            console.log(D)
        } while (epsilon > 0.000001);
        output = x
        this.setState({
            showOutputCard: true
        });


    }
    createMatrix(row, column) {
        A = []
        B = []
        matrixA = []
        matrixB = []
        matrixX = []
        x = []
        dataInTable = []
        for (var i = 1; i <= row; i++) {
            for (var j = 1; j <= column; j++) {
                matrixA.push(<Input style={{
                    width: "8%",
                    height: "12%",
                    //backgroundColor: "#06d9a0",
                    marginInlineEnd: "5%",
                    marginBlockEnd: "5%",
                    color: "black",
                    fontSize: "18px",
                    fontWeight: "bold"
                }}
                    id={"a" + i + "" + j} key={"a" + i + "" + j} placeholder={"a" + i + "" + j} />)
            }
            matrixA.push(<br />)
            matrixB.push(<Input style={{
                width: "8%",
                height: "12%",
                //backgroundColor: "black",
                marginInlineEnd: "5%",
                marginBlockEnd: "5%",
                color: "black",
                fontSize: "18px",
                fontWeight: "bold"
            }}
                id={"b" + i} key={"b" + i} placeholder={"b" + i} />)
            matrixX.push(<Input style={{
                width: "8%",
                height: "12%",
                //backgroundColor: "black",
                marginInlineEnd: "5%",
                marginBlockEnd: "5%",
                color: "black",
                fontSize: "18px",
                fontWeight: "bold"
            }}
                id={"x" + i} key={"x" + i} placeholder={"x" + i} />)


        }

        this.setState({
            showDimentionForm: true,
            showMatrixForm: true,
        })



    }
    initMatrix() {
        for (var i = 0; i < this.state.row; i++) {
            A[i] = []
            for (var j = 0; j < this.state.column; j++) {
                A[i][j] = (parseFloat(document.getElementById("a" + (i + 1) + "" + (j + 1)).value));
            }
            B.push(parseFloat(document.getElementById("b" + (i + 1)).value));
            x.push(parseFloat(document.getElementById("x" + (i + 1)).value));
        }
    }
    appendTable(lambda, x, error) {
        dataInTable.push({
            iteration: count++,
            lambda: lambda,
            X: x,
            error: error
        });
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    async dataapi() {
        await axios({
            method: "get",
            url: "http://localhost:5000/database/Gradient",
        }).then((response) => {
            console.log("response: ", response.data);
            api = response.data;
        });
        await this.setState({
            row: api.row,
            column: api.column,
        });
        matrixA = [];
        matrixB = [];
        matrixX = [];
        await this.createMatrix(api.row, api.column);
        for (let i = 1; i <= api.row; i++) {
            for (let j = 1; j <= api.column; j++) {
                document.getElementById("a" + i + "" + j).value =
                    api.matrixA[i - 1][j - 1];
            }
            document.getElementById("b" + i).value = api.matrixB[i - 1];
            document.getElementById("x" + i).value = api.matrixX[i - 1];
        }
        this.conjugate_gradient();
    }
    render() {
        const { Header, Content, Footer } = Layout;
        return (
            <Content className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
            <div className="col" onChange={this.handleChange} style={{ padding: 200, background: '#f5f5dc' }}>
                <h1 style={{ textAlign: 'center', fontSize: '30px' }}>Conjugate Gradient Iteration Method</h1>
                <div>
                    <div style={{ textAlign: 'center', fontSize: '21px' }}>
                            {this.state.showDimentionForm &&
                                 <form style = {{textAlign: 'center',fontSize:'21px'}} id="inputCard">
                                    <h4>Row : &nbsp;&nbsp;<Input size="large" name="row" onChange={this.handleChange} style={{ width: 150 }} value={this.state.row}></Input></h4><br />
                                    <h4>Column : &nbsp;&nbsp;<Input size="large" name="column" onChange={this.handleChange} style={{ width: 150 }} value={this.state.column}></Input></h4><br />
                                    <Button id="dimention_button" onClick={
                                        () => { this.createMatrix(this.state.row, this.state.column) }
                                    }
                                        style={{ background: "#4caf50", color: "white" }}>
                                        Submit
                                    </Button>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <Button type="submit" size="large"
                                        style={{ color:'black',background:'#f7c602'}}
                                        onClick={() => this.dataapi(this.state.row)}>
                                        Function
                                    </Button>
                                    </form>
                            }

                            {this.state.showMatrixForm &&
                                <div>
                                    <br />
                                    <h2 style = {{textAlign: 'center',fontSize:'30px'}}>Matrix [A]</h2><br />{matrixA}
                                    <h2 style = {{textAlign: 'center',fontSize:'30px'}}>Vector [B]<br /></h2>{matrixB}
                                    <h2 >Initial X<br /></h2>{matrixX}
                                    <br />
                                    <Button
                                        id="matrix_button"
                                        style={{width: 150 ,background: "#f7c602", color: "black"}}
                                        onClick={() => this.conjugate_gradient(parseInt(this.state.row))}>
                                        Submit
                                    </Button>
                                </div>

                            }
                    </div>
                    <br />
                    <br />
                    <div className="col">
                        {this.state.showOutputCard &&
                            <div>
                                <Card
                                    title={"Output"}
                                    bordered={true}
                                    style={{ background: "#F0FFFF", color: "#000000" }}
                                    onChange={this.handleChange} id="answerCard">
                                    <p style={{ fontSize: "24px", fontWeight: "bold" }}>{JSON.stringify(output)}</p>
                                </Card>

                            </div>

                        }
                    </div>
                    <br />
                    <br />
                </div>
                 <div className="row"> 
                    {this.state.showOutputCard &&
                        <div>
                            <Card
                                title={"Output"}
                                bordered={true}
                                style={{ width: "100%", background: "#F0F8FF", color: "#000000", float: "left"}}
                                
                            >
                                <Table columns={columns} dataSource={dataInTable} bordered={true} bodyStyle={{ fontWeight: "bold", fontSize: "18px", color: "black", overflowX: "scroll" }}
                                ></Table>
                            </Card>

                        </div>

                    }
              </div> 


            </div>
            </Content>
        );
    }
}
export default Gradient;

