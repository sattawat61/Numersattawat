
import React, { Component } from 'react'
import { Card, Input, Button,Layout } from 'antd';
import 'antd/dist/antd.css';
import { lusolve, format } from 'mathjs';
import axios from 'axios';
var api;
const InputStyle = {
    background: "#1890ff",
    color: "white",
    fontWeight: "bold",
    fontSize: "24px"

};

var A = [], B = [], matrixA = [], matrixB = [], output = [], decompose;
class LU extends Component {

    constructor() {
        super();
        this.state = {
            row: 0,
            column: 0,
            showDimentionForm: true,
            showMatrixForm: false,
            showOutputCard: true
        }
        this.handleChange = this.handleChange.bind(this);
        this.Lu = this.Lu.bind(this);

    }

    Lu() {
        this.initMatrix();
        decompose = lusolve(A, B)
        for (var i = 0; i < decompose.length; i++) {
            output.push(Math.round(decompose[i]));
            output.push(<br />)
        }
        this.setState({
            showOutputCard: true
        });


    }

    printFraction(value) {
        return format(value, { fraction: 'ratio' })
    }

    createMatrix(row, column) {
        for (var i = 1; i <= row; i++) {
            for (var j = 1; j <= column; j++) {
                matrixA.push(<Input style={{
                    width: "18%",
                    height: "50%",
                    // backgroundColor: "#06d9a0",
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
                width: "18%",
                height: "50%",
                // backgroundColor: "black",
                marginInlineEnd: "2%",
                marginBlockEnd: "2%",
                color: "black",
                fontSize: "18px",
                fontWeight: "bold"
            }}
                id={"b" + i} key={"b" + i} placeholder={"b" + i} />)


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
          url: "http://localhost:5000/database/LU",
        }).then((response) => {
          console.log("response: ", response.data);
          api = response.data;
        });
        await this.setState({
          row: api.row,
          column: api.column,
        });
        await this.createMatrix(api.row, api.column);
        for (let i = 1; i <= api.row; i++) {
          for (let j = 1; j <= api.column; j++) {
            document.getElementById("a" + i + "" + j).value =
              api.arrayA[i - 1][j - 1];
          }
          document.getElementById("b" + i).value = api.arrayB[i - 1];
        }
        await this.Lu();
      }
    render() {
        const { Header, Content, Footer } = Layout;
        return (
            <Content className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
            <div style={{ padding: 200, background: '#f5f5dc' }}>
                <h1 style={{ textAlign: 'center',fontSize:'30px'}}>LU Decomposition</h1>
                <div >
                    <div className="col" onChange={this.handleChange} style = {{textAlign: 'center',fontSize:'21px'}}>
                            {this.state.showDimentionForm &&
                                <div>
                                    <h4>Row  : &nbsp;&nbsp;<Input size="large" name="row" value={this.state.row}style={{ width: 150 }}></Input></h4><br />
                                    <h4>Column  : &nbsp;&nbsp;<Input size="large" name="column" value={this.state.column}style={{ width: 150 }}></Input></h4><br />
                                    <Button id="dimention_button" size="large"onClick={
                                        () => this.createMatrix(this.state.row, this.state.column)
                                    }
                                        style={{ background: "#cc0000", color: "white" }}>
                                        Submit
                                </Button>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <Button type="submit"   size="large"
                                    style={{ color:'white',background:'#f7c602'}}
                                    onClick={() => this.dataapi()}>
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
                                <Button size="large"
                                        id="matrix_button"
                                        style={{ width: 150 ,background: "#cc0000", color: "white"}}
                                        onClick={() => this.Lu()}>
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
                                style={{ width: "100%",background: "#F0F8FF", color: "#000000" }}
                                onChange={this.handleChange} id="answerCard">
                                <p style={{ fontSize: "30px", fontWeight: "bold" }}>{output}</p>
                            </Card>
                        }
                    </div>
                </div>
            </div>
            </Content>
        );
    }
}
export default LU;




