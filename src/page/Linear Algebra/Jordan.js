import React, { Component } from 'react'
import { Card, Input, Button,Layout } from 'antd';
import '../style.css';
import 'antd/dist/antd.css';
import axios from 'axios';
var api;
var A = [], B = [], matrixA = [], matrixB = [], output = []
class Jordan extends Component {

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
        this.jordan = this.jordan.bind(this);

    }

    jordan(n) {
        this.initMatrix();
        if (A[0][0] === 0) { //pivoting
            var tempRow = JSON.parse(JSON.stringify(A[0]));
            var tempColumn = B[0];
            A[0] = A[1];
            A[1] = tempRow;
            B[0] = B[1];
            B[1] = tempColumn;
        }
        //Forward eliminate
        for (var k = 0; k < n; k++) {
            for (var i = k + 1; i < n; i++) {
                var factor = A[i][k] / A[k][k];
                for (var j = k; j < n; j++) {
                    A[i][j] = A[i][j] - factor * A[k][j];
                }
                B[i] = B[i] - factor * B[k];

            }
        }
        //Backward Substitution
        for (k = n - 1; k >= 0; k--) {
            for (i = k; i >= 0; i--) {

                if (i === k) {//Identity matrix
                    factor = 1 / A[i][k];

                    for (j = 0; j < n; j++) {
                        A[i][j] = A[i][j] * factor;
                    }
                    B[i] = B[i] * factor;


                }
                else {
                    factor = A[i][k] / A[k][k];
                    for (j = 0; j < n; j++) {
                        A[i][j] = A[i][j] - factor * A[k][j];
                    }
                    B[i] = B[i] - factor * B[k];
                }
            }
        }
        for (i = 0; i < n; i++) {
            output.push("x" + (i + 1) + " = " +B[i]);
            output.push(<br />)
        }
        this.setState({
            showOutputCard: true
        });


    }
    createMatrix(row, column) {
        for (var i = 1; i <= row; i++) {
            for (var j = 1; j <= column; j++) {
                matrixA.push(<Input style={{
                    width: "8%",
                    height: "12%",
                    //backgroundColor: "#06d9a0",
                    marginInlineEnd: "2%",
                    marginBlockEnd: "2%",
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
                marginInlineEnd: "2%",
                marginBlockEnd: "2%",
                color: "black",
                fontSize: "18px",
                fontWeight: "bold"
            }}
                id={"b" + i} key={"b" + i} placeholder={"b" + i} />)


        }

        this.setState({
            showDimentionForm: false,
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
        }
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    async dataapi() {
        await axios({
            method: "get",
            url: "http://localhost:5000/database/gaussjordan",
        }).then((response) => {
            console.log("response: ", response.data);
            api = response.data;
        });
        await this.setState({
            row: api.row,
            column: api.column,
        });
        // matrixA = [];
        // matrixB = [];
        await this.createMatrix(api.row, api.column);
        for (let i = 1; i <= api.row; i++) {
            for (let j = 1; j <= api.column; j++) {
                document.getElementById("a" + i + "" + j).value =
                    api.arrayA[i - 1][j - 1];
            }
            document.getElementById("b" + i).value = api.arrayB[i - 1];
        }
        this.jordan(this.state.row);
    }
    render() {
        let { row, column } = this.state;
        const { Header, Content, Footer } = Layout;
        return (
            <Content className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
            <div className="col" onChange={this.handleChange} style={{ padding: 200, background: '#f5f5dc' }}>
                <h1 style={{ textAlign: 'center', fontSize: '30px' }}>Gauss-Jordan Method</h1>
                <div>
                    <div style={{ textAlign: 'center', fontSize: '21px' }}>
                    {this.state.showDimentionForm && 
                                <div>
                                    <h4>Row : &nbsp;&nbsp;<Input size="large" name="row" onChange={this.handleChange} style={{ width: 150 }} value={this.state.row}></Input></h4><br />
                                    <h4>Column : &nbsp;&nbsp;<Input size="large" name="column" onChange={this.handleChange} style={{ width: 150 }} value={this.state.column}></Input></h4><br />
                                    <Button id="dimention_button" onClick={
                                        () => this.createMatrix(row, column)
                                    }
                                    size="large"style={{background: "#cc0000", color: "#ffffff"}}>
                                        Submit
                                    </Button>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <Button type="submit" size="large"
                                        style={{ color:'black',background:'#f7c602'}}
                                        onClick={() => this.dataapi(this.state.row)}>
                                        Function
                                    </Button>
                                </div>
                            }

                            {this.state.showMatrixForm &&
                                <div>
                                    <br />
                                    <h2 style = {{textAlign: 'center',fontSize:'30px'}}>Matrix [A]</h2><br />{matrixA}
                                    <h2 style = {{textAlign: 'center',fontSize:'30px'}}>Vector [B]<br /></h2>{matrixB}
                                    <br />
                                    <Button
                                        id="matrix_button"
                                        style={{width: 150 ,background: "#f7c602", color: "black"}}
                                        onClick={() => this.jordan(row)}>
                                        Submit
                                    </Button>
                                </div>
                            }
                        
                        

                    </div>
                    <br />
                        <br />
                    <div className="row">
                        {this.state.showOutputCard &&
                            <Card
                                title={"Output"}
                                bordered={true}
                                style={{width: "100%", background: "#F0F8FF", color: "#000000",float:"left" }}
                                onChange={this.handleChange} id="answerCard">
                                <p style={{ fontSize: "24px", fontWeight: "bold" }}>{output}</p>
                            </Card>
                        }
                    </div>
                </div>
            </div>
            </Content>
        );
    }
}
export default Jordan;



