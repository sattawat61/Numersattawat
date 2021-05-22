import React, { Component } from 'react'
import {Card, Input, Button, Table,Layout} from 'antd';
// import '../../screen.css';
import 'antd/dist/antd.css';
import { error } from '../../services/Services';
import { lusolve} from 'mathjs';
import axios from 'axios';
// const InputStyle = {
//     background: "#1890ff",
//     color: "white", 
//     fontWeight: "bold", 
//     fontSize: "24px"

// };
var api;
var A = [], B = [], matrixA = [], matrixB = [], x , epsilon, output = [], dataInTable = [], count=1, matrixX = [],decompose;
var columns = [
    {
      title: "Iteration",
      dataIndex: "iteration",
      key: "iteration"
    }
];
class Seidel extends Component {
    
    constructor() {
        super();
        this.state = {
            row: 0,
            column: 0,
            showDimentionForm : true,
            showMatrixForm: false,
            showOutputCard: true
        }
        this.handleChange = this.handleChange.bind(this);
        this.seidel = this.seidel.bind(this);
    
    }

  
    seidel(n) {
        this.initMatrix();
        x = new Array(n);
        var xold
        epsilon = new Array(n);
        do {
            xold = JSON.parse(JSON.stringify(x));
            for (var i=0 ; i<n ; i++) {
                var sum = 0;
                for (var j=0 ; j<n ; j++) {
                    if (i !== j) { //else i == j That is a divide number
                        sum = sum + A[i][j]*x[j];
                    }
                }
                x[i] = (B[i] - sum)/A[i][i]; //update x[i]
                
            }        
        } while(error(x, xold)); //if true , continue next iteration
        
        
        for (i=0 ; i<x.length ; i++) {
                output.push(x[i]);
                output.push(<br/>);
        }
        decompose = lusolve(A, B)
        for (var i = 0; i < decompose.length; i++) {
            output.push(<h5>X<sub>{i}</sub>&nbsp;=&nbsp;&nbsp;{Math.round(decompose[i])}</h5>);
            //output.push(<br />)
        }
        this.setState({
            showOutputCard: true
        });

      
    }
    error(xnew, xold) {
        for (var i=0 ; i<xnew.length ; i++) {
            epsilon[i] = Math.abs((xnew[i]-xold[i]) / xnew[i])
        }
        this.appendTable(x, epsilon);
        for (i=0 ; i<epsilon.length ; i++) {
            if (epsilon[i] > 0.000001) {
                return true;
            }    
        }
        return false;  
    }   
    createMatrix(row, column) {
        A = []
        B = []
        matrixA = []
        matrixB = []
        matrixX = []
        x = []
        dataInTable = []
        for (var i=1 ; i<=row ; i++) {
            for (var j=1 ; j<=column ; j++) {
                matrixA.push(<Input style={{
                    width: "8%",
                    height: "12%", 
                    //backgroundColor:"#06d9a0", 
                    marginInlineEnd: "2%", 
                    marginBlockEnd: "2%",
                    color: "black",
                    fontSize: "18px",
                    fontWeight: "bold"
                }} 
                id={"a"+i+""+j} key={"a"+i+""+j} placeholder={"a"+i+""+j} />)  
            }
            matrixA.push(<br/>)
            matrixB.push(<Input style={{
                width: "8%",
                height: "12%", 
                //backgroundColor:"black", 
                marginInlineEnd: "2%", 
                marginBlockEnd: "2%",
                color: "black",
                fontSize: "18px",
                fontWeight: "bold"
            }} 
            id={"b"+i} key={"b"+i} placeholder={"b"+i} />)
            matrixX.push(<Input style={{
                width: "8%",
                height: "23%", 
                //backgroundColor:"black", 
                marginInlineEnd: "2%", 
                marginBlockEnd: "2%",
                color: "black",
                fontSize: "18px",
                fontWeight: "bold"
            }} 
            id={"x"+i} key={"x"+i} placeholder={"x"+i} />)
                
            
        }

        this.setState({
            showDimentionForm: true,
            showMatrixForm: true,
        })

        

    }
    initMatrix() {
        for(var i=0 ; i<this.state.row ; i++) {
            A[i] = []
            for(var j=0 ; j<this.state.column ; j++) {
                A[i][j] = (parseFloat(document.getElementById("a"+(i+1)+""+(j+1)).value));
            }
            B.push(parseFloat(document.getElementById("b"+(i+1)).value));
            x.push(parseFloat(document.getElementById("x"+(i+1)).value));
        }
    }
    initialSchema(n) {
        for (var i=1 ; i<=n ; i++) {
            columns.push({
                title: "X"+i,
                dataIndex: "x"+i,
                key: "x"+i
            },)
        }
        for (i=1 ; i<=n ; i++) {
            columns.push({
                title: "Error"+i,
                dataIndex: "error"+i,
                key: "error"+i
            },)
        }
    }
    appendTable(x, error) {
        var tag = ''
        tag += '{"iteration": ' + count++ + ',';
        for (var i=0 ; i<x.length ; i++) {
            tag += '"x'+(i+1)+'": '+x[i].toFixed(8)+', "error'+(i+1)+'": ' + error[i].toFixed(8);
            if (i !== x.length-1) {
                tag += ','
            }
        }
        tag += '}';
        dataInTable.push(JSON.parse(tag));  
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    async dataapi() {
        await axios({
            method: "get",
            url: "http://localhost:5000/database/seidel",
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
            document.getElementById("x" + i).value = api.arrayX[i - 1];
        }
        this.seidel(this.state.row);
    }

    render() {
        const { Header, Content, Footer } = Layout;
        return(
            <Content className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
            <div className="col" onChange={this.handleChange} style={{ padding: 200, background: '#f5f5dc' }}>
                <h1 style={{ textAlign: 'center', fontSize: '30px' }}>Gauss-Seidel Iteration Method</h1>
                <div>
                    <div style={{ textAlign: 'center', fontSize: '21px' }}>
                            {this.state.showDimentionForm && 
                                <div>
                                    <h4>Row : &nbsp;&nbsp;<Input size="large" name="row" onChange={this.handleChange} style={{ width: 150 }} value={this.state.row} ></Input></h4><br />
                                    <h4>Column : &nbsp;&nbsp;<Input size="large" name="column" onChange={this.handleChange} style={{ width: 150 }} value={this.state.column}></Input></h4><br />
                                    <Button id="dimention_button" onClick= {
                                        ()=>{this.createMatrix(this.state.row, this.state.column);
                                            this.initialSchema(this.state.row)}
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
                                    <h2 style = {{textAlign: 'center',fontSize:'30px'}}>Matrix [A]</h2><br/>{matrixA}
                                    <h2 style = {{textAlign: 'center',fontSize:'30px'}}>Vector [B]<br/></h2>{matrixB}
                                    <h2 style = {{textAlign: 'center',fontSize:'30px'}}>Initial X<br/></h2>{matrixX}
                                    <br />
                                    <Button 
                                        id="matrix_button"  
                                        style={{width: 150 ,background: "#f7c602", color: "black"}}
                                        onClick={()=>this.seidel(parseInt(this.state.row))}>
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
                            style={{width: "100%", background: "#2196f3", color: "#FFFFFFFF" }}
                            id="outputCard"
                            >
                                <Table columns={columns} dataSource={dataInTable} bordered={true} bodyStyle={{fontWeight: "bold", fontSize: "18px", color: "black", overflowX: "scroll"}}
                                ></Table>
                            </Card>
                        }                           
                    </div>    
                </div> 
            </div>
            </Content>
        );
    }
}
export default Seidel;