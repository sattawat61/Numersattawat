
import React, { Component } from 'react'
import {Card, Input, Button, Table,Layout} from 'antd';
import 'antd/dist/antd.css';
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
var x, y, tableTag,  interpolatePoint, tempTag, fx

class Lagrange extends Component {
    
    constructor() {
        super();
        x = []
        y = []
        interpolatePoint = []
        tempTag = []
        tableTag = []
        this.state = {
            nPoints: 0,
            X: 0,
            interpolatePoint: 0,
            showInputForm : true,
            showTableInput: false,
            showOutputCard: true
        }
        this.handleChange = this.handleChange.bind(this);
        this.lagrange = this.lagrange.bind(this);
    
    }  
    // 1 สร้าง input เก็บ input ใน x[],y[]
    createTableInput(n) {
        for (var i=1 ; i<=n ; i++) {
            x.push(<Input style={{
                width: "50%",
                height: "40%", 
                // backgroundColor:"black", 
                marginInlineEnd: "5%", 
                marginBlockEnd: "5%",
                color: "black",
                fontSize: "18px",
                fontWeight: "bold"
            }}
            id={"x"+i} key={"x"+i} placeholder={"x"+i}/>);
            y.push(<Input style={{
                width: "50%",
                height: "40%", 
                // backgroundColor:"black", 
                marginInlineEnd: "5%", 
                marginBlockEnd: "5%",
                color: "black",
                fontSize: "18px",
                fontWeight: "bold"
            }} 
            id={"y"+i} key={"y"+i} placeholder={"y"+i}/>);   
            tableTag.push({
                no: i,
                x: x[i-1],
                y: y[i-1]
            });
        }


        this.setState({
            showInputForm: true,
            showTableInput: true,
        })
    }
    // 1 เก็บ input ใน tempTag[]
    createInterpolatePointInput(){
        for (var i=1 ; i<=this.state.interpolatePoint ; i++) {
            tempTag.push(<Input style={{
                width: "10%",
                height: "40%", 
                // backgroundColor:"black", 
                marginInlineEnd: "5%", 
                marginBlockEnd: "5%",
                color: "black",
                fontSize: "18px",
                fontWeight: "bold"
            }} 
            id={"p"+i} key={"p"+i} placeholder={"p"+i} />)
        }
    }
    initialValue() {
        x = []
        y = []
        for (var i=1 ; i<=this.state.nPoints ; i++) {
            x[i] = parseFloat(document.getElementById("x"+i).value);
            y[i] = parseFloat(document.getElementById("y"+i).value);
        }
        for (i=1 ; i<=this.state.interpolatePoint ; i++) {
            interpolatePoint[i] = parseFloat(document.getElementById("p"+i).value);
        }
    }

    L(X, index, n) {
        var numerate = 1/*ตัวเศษ*/, denominate = 1/*ตัวส่วน*/;
        for (var i=1 ; i<=n ; i++) {
            if (i !== index) {
                numerate *= x[i]-X;
                denominate *= x[i] - x[index];
            }
        } 
        console.log(numerate/denominate)
        return parseFloat(numerate/denominate);
    }
    // ใช้  L(X, index, n) , initialValue()
    lagrange(n, X) {
        fx = 0
        this.initialValue()
        for (var i=1 ; i<=n ; i++) {
            fx += this.L(X, i, n)*y[i];
        }
        this.setState({
            showOutputCard: true
        })

    } 

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    async dataapi() {
        await axios({
          method: "get",
          url: "http://localhost:5000/database/lagrange",
        }).then((response) => {
          console.log("response: ", response.data);
          api = response.data;
        });
        await this.setState({
            nPoints: api.nPoints,
            X: api.X,
            interpolatePoint: api.interpolateinput,
        });
        x = []
        y = []
        interpolatePoint = []
        tempTag = []
        tableTag = []
        await this.createInterpolatePointInput();
        await this.createTableInput(api.nPoints);
        for (let i = 1; i <= api.nPoints; i++) {
          document.getElementById("x" + i ).value = api.arrayX[i - 1];
          document.getElementById("y" + i).value = api.arrayY[i - 1];
        }
        for (let i = 1; i <= api.interpolateinput; i++) {
          document.getElementById("p" + i ).value = api.interpolatePoint[i - 1];
        }
        this.lagrange(parseInt(this.state.interpolatePoint), parseFloat(this.state.X));
      }

    render() {
        const { Header, Content, Footer } = Layout;
        return(
            <Content className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
            <div className="col" onChange={this.handleChange} style={{ padding: 200, background: '#f5f5dc' }}>
                <h1 style={{textAlign: 'center',fontSize:'30px'}}>Lagrange Interpolation</h1>
                <div >
                    <div style = {{textAlign: 'center',fontSize:'21px'}}onChange={this.handleChange}>
                       
                            {this.state.showInputForm && 
                                <div>
                                    <h4>Number of points(n)  : &nbsp;&nbsp;<Input size="large" name="nPoints" value={this.state.nPoints}style={{ width: 150 }}></Input></h4><br />
                                    <h4>X  : &nbsp;&nbsp;<Input size="large" name="X" value={this.state.X}style={{ width: 150 }}></Input></h4><br />
                                    <h4>interpolatePoint  : &nbsp;&nbsp;<Input size="large" name="interpolatePoint"value={this.state.interpolatePoint} style={{ width: 150 }}></Input></h4><br />
                                    <Button id="dimention_button"size="large" onClick= {
                                        ()=>{this.createTableInput(parseInt(this.state.nPoints));
                                        this.createInterpolatePointInput()}
                                    }  
                                        style={{background: "#cc0000", color: "#ffffff" }}>
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
                            {this.state.showTableInput && 
                                <div>
                                    <br />
                                    <Table columns={columns} dataSource={tableTag} pagination={false} bordered={true} bodyStyle={{fontWeight: "bold", fontSize: "18px", color: "white" , overflowY: "scroll", minWidth: 120, maxHeight: 300}}></Table>
                                    <br/><h2>interpolatePoint {parseInt(this.state.interpolatePoint) === 2 ? "(Linear)": 
                                                            parseInt(this.state.interpolatePoint) === 3 ? "(Quadratic)" :
                                                            "(Polynomial)"}</h2>{tempTag}
                                                            <br />
                                    <Button 
                                        id="matrix_button"size="large"
                                        style={{width: 150 ,background: "#f7c602", color: "black"}}
                                        onClick={()=>this.lagrange(parseInt(this.state.interpolatePoint), parseFloat(this.state.X))}>
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
                            style={{ width: "100%", background: "#F0F8FF", color: "#000000", float: "left" }}
                            >
                                <p style={{fontSize: "24px", fontWeight: "bold"}}>{fx}</p>
                            </Card>                        
                        }                        
                    </div>     
                </div>

                
            </div>
            </Content>
        );
    }
}
export default Lagrange;