import React, { Component } from 'react'
import {Card, Input, Button,Layout} from 'antd';
// import '../../screen.css';
import 'antd/dist/antd.css';
import { format } from 'mathjs';
import { lusolve} from 'mathjs';
import axios from 'axios';
// const InputStyle = {
//     background: "#1890ff",
//     color: "white", 
//     fontWeight: "bold", 
//     fontSize: "24px"

// };
var api;
var A = [], B = [], matrixA = [], matrixB = [], output = [], decompose;
class Cholesky extends Component {
    
    constructor() {
        super();
        this.state = {
            row: parseInt(0),
            column: parseInt(0),
            showDimentionForm : true,
            showMatrixForm: false,
            showOutputCard: true
        }
        this.handleChange = this.handleChange.bind(this);
        this.cholesky = this.cholesky.bind(this)
    
    }

    cholesky(n) {
        this.initMatrix();
        var  x  = new Array(n);
        var  y  = new Array(n)

        if (matrixA[0][0] === 0) {
            for (var i=0 ; i<n ; i++) {
                var temp = A[0][i];
                matrixA[0][i] = B[i][i];
                matrixB[0][i] = temp;
            }
        }
        var matrixL = new Array(n);
        for(i=0;i<n;i++){
            matrixL[i]  = new Array(n); 
            for(var j=0;j<n;j++){
                matrixL[i][j] = 0;
            }
            x[i] = 0;
            y[i] = 0;
        }
        matrixL[0][0] = Math.sqrt(matrixA[0][0]);
        for(var k=1;k<n;k++){

            for(i=0;i<k;i++){
                var sum = 0;
                if(i!==0){
                    for(j=0;j<i;j++){
                        sum += matrixL[i][j]*matrixL[k][j];
                        //console.log(sum);
                    }
                }
                matrixL[k][i]= (matrixA[i][k]-sum)/matrixL[i][i];//ได้ค่า L ที่ไม่ใช่แนวทะแยง
            }
            sum = 0;
            for(j=0;j<k;j++){
                sum += matrixL[k][j]*matrixL[k][j];
            }
            matrixL[k][k] = Math.sqrt(matrixA[k][k]-sum);
        }
     ;
        y[0] = matrixB[0]/matrixL[0][0];
        for(i=1;i<n;i++){
            sum = 0;
            for(j=0;j<i;j++){
                sum += matrixL[i][j]*y[j];
            }
            y[i] = (matrixB[i]-sum)/matrixL[i][i];
        }
   
        x[n-1] = y[n-1]/matrixL[n-1][n-1];
        for(i=this.state.row-2;i>=0;i--){
            sum = 0;
            for(j=i+1;j<this.state.row;j++){
                sum += matrixL[j][i]*x[j];
            }
            x[i] = (y[i]-sum)/matrixL[i][i];
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
    summation(L, k) {
        var sum = 0
        for (var i=0 ; i<parseInt(this.state.row) ; i++) {
            for (var j=0 ; j<i-2 ; j++) {
                sum+= L[i][j]*L[k][j]
            }
        }
        return sum
    }
    printFraction (value) {
        return format(value, { fraction: 'ratio' })
    }

    createMatrix(row, column) {
        output = [];
        for (var i=0 ; i<row ; i++) {
            for (var j=0 ; j<column ; j++) {
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
                id={"a"+(i+1)+""+(j+1)} key={"a"+(i+1)+""+(j+1)} placeholder={"a"+(i+1)+""+(j+1)} />)  
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
            id={"b"+(i+1)} key={"b"+(i+1)} placeholder={"b"+(i+1)} />)
                
            
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
            url: "http://localhost:5000/database/Cholesky",
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
                    api.matrixA[i - 1][j - 1];
            }
            document.getElementById("b" + i).value = api.matrixB[i - 1];
        }
        this.cholesky(this.state.row);
    }

    render() {
        const { Header, Content, Footer } = Layout;
        return(
            <Content className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
            <div className="col" onChange={this.handleChange} style={{ padding: 200, background: '#f5f5dc' }}>
                <h1 style={{ textAlign: 'center', fontSize: '30px' }}>Cholesky Decomposition</h1>
                <div>
                <div style={{ textAlign: 'center', fontSize: '21px' }}>
                            {this.state.showDimentionForm && 
                            <div>
                                    <h4>Row : &nbsp;&nbsp;<Input size="large" name="row" onChange={this.handleChange} style={{ width: 150 }} value={this.state.row}></Input></h4><br />
                                    <h4>Column : &nbsp;&nbsp;<Input size="large" name="column" onChange={this.handleChange} style={{ width: 150 }} value={this.state.column}></Input></h4><br />
                                    <Button id="dimention_button" onClick= {
                                        ()=>this.createMatrix(this.state.row, this.state.column)
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
                                    <br />
                                    <Button 
                                        id="matrix_button"  
                                        style={{width: 150 ,background: "#f7c602", color: "black"}}
                                        onClick={()=>this.cholesky(this.state.row)}>
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
                            onChange={this.handleChange}  id="answerCard">
                                <p style={{fontSize: "24px", fontWeight: "bold"}}>{output}</p>
                            </Card>
                        }   
                    </div>
                </div>     
                        </div>
            </Content>
        );
    }
}
export default Cholesky;


