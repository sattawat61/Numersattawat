
import React, { Component } from 'react'
import { Card, Input, Button, Table,Layout } from 'antd';
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
var x = [], y = [], tableTag = [], answer

class Spline extends Component {

    constructor() {
        super();
        this.state = {
            nPoints: 0,
            X: 0,
            showInputForm: true,
            showTableInput: false,
            showOutputCard: true
        }
        this.handleChange = this.handleChange.bind(this);

    }


    createTableInput(n) {
        for (var i = 1; i <= n; i++) {
            x.push(<Input style={{
                width: "50%",
                height: "40%",
                marginInlineEnd: "5%",
                marginBlockEnd: "5%",
                color: "black",
                fontSize: "18px",
                fontWeight: "bold"
            }}
                id={"x" + i} key={"x" + i} placeholder={"x" + i} />);
            y.push(<Input style={{
                width: "50%",
                height: "40%",
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
            });
        }


        this.setState({
            showInputForm: true,
            showTableInput: true,
        })
    }
    initialValue(X) {
        x = []
        y = []
        for (var i = 0; i < this.state.nPoints; i++) {
            x[i] = parseFloat(document.getElementById("x" + (i + 1)).value);
            y[i] = parseFloat(document.getElementById("y" + (i + 1)).value);
        }
        answer = this.spline(X, x, y)
    }
    spline(x, xs, ys) {
        var ks = xs.map(function () { return 0 })
        ks = this.getNaturalKs(xs, ys, ks)
        var i = 1;
        while (xs[i] < x) i++;
        var t = (x - xs[i - 1]) / (xs[i] - xs[i - 1]);
        var a = ks[i - 1] * (xs[i] - xs[i - 1]) - (ys[i] - ys[i - 1]);
        var b = -ks[i] * (xs[i] - xs[i - 1]) + (ys[i] - ys[i - 1]);
        var q = (1 - t) * ys[i - 1] + t * ys[i] + t * (1 - t) * (a * (1 - t) + b * t);
        console.log(q)
        this.setState({
            showOutputCard: true
        })

        return q;
    }

    getNaturalKs(xs, ys, ks) {
        var n = xs.length - 1;
        var A = this.zerosMat(n + 1, n + 2);

        for (var i = 1; i < n; i++)  // rows
        {
            A[i][i - 1] = 1 / (xs[i] - xs[i - 1]);
            A[i][i] = 2 * (1 / (xs[i] - xs[i - 1]) + 1 / (xs[i + 1] - xs[i]));
            A[i][i + 1] = 1 / (xs[i + 1] - xs[i]);
            A[i][n + 1] = 3 * ((ys[i] - ys[i - 1]) / ((xs[i] - xs[i - 1]) * (xs[i] - xs[i - 1])) + (ys[i + 1] - ys[i]) / ((xs[i + 1] - xs[i]) * (xs[i + 1] - xs[i])));
        }

        A[0][0] = 2 / (xs[1] - xs[0]);
        A[0][1] = 1 / (xs[1] - xs[0]);
        A[0][n + 1] = 3 * (ys[1] - ys[0]) / ((xs[1] - xs[0]) * (xs[1] - xs[0]));

        A[n][n - 1] = 1 / (xs[n] - xs[n - 1]);
        A[n][n] = 2 / (xs[n] - xs[n - 1]);
        A[n][n + 1] = 3 * (ys[n] - ys[n - 1]) / ((xs[n] - xs[n - 1]) * (xs[n] - xs[n - 1]));

        return this.solve(A, ks);
    }
    async dataapi() {
        await axios({
          method: "get",
          url: "http://localhost:5000/database/spline",
        }).then((response) => {
          console.log("response: ", response.data);
          api = response.data;
        });
        await this.setState({
            nPoints: api.nPoints,
            X: api.X
        });
        await this.createTableInput(api.nPoints);
        for (let i = 1; i <= api.nPoints; i++) {
            document.getElementById("x" + i ).value = api.arrayX[i - 1];
            document.getElementById("y" + i).value = api.arrayY[i - 1];
        }
        await this.initialValue(parseFloat(api.X));
        await this.initialValue(parseFloat(api.X));
        
      }

    solve(A, ks) {
        var m = A.length;
        for (var k = 0; k < m; k++)  // column
        {
            // pivot for column
            var i_max = 0; var vali = Number.NEGATIVE_INFINITY;
            for (var i = k; i < m; i++) if (A[i][k] > vali) { i_max = i; vali = A[i][k]; }
            this.swapRows(A, k, i_max);

            // for all rows below pivot
            for (i = k + 1; i < m; i++) {
                for (var j = k + 1; j < m + 1; j++)
                    A[i][j] = A[i][j] - A[k][j] * (A[i][k] / A[k][k]);
                A[i][k] = 0;
            }
        }
        for (i = m - 1; i >= 0; i--) // rows = columns
        {
            var v = A[i][m] / A[i][i];
            ks[i] = v;
            for (j = i - 1; j >= 0; j--) // rows
            {
                A[j][m] -= A[j][i] * v;
                A[j][i] = 0;
            }
        }
        console.log(A)
        return ks;
    }

    zerosMat(r, c) {
        var A = [];
        for (var i = 0; i < r; i++) {
            A.push([]);
            for (var j = 0; j < c; j++) A[i].push(0);
        }
        return A;
    }

    swapRows(m, k, l) {
        var p = m[k]; m[k] = m[l]; m[l] = p;
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
            <div className="col" onChange={this.handleChange} style={{ padding: 200, background: '#f5f5dc' }}>
                <h1 style={{ textAlign: 'center',fontSize:'30px' }}>Spline Interpolation</h1>
                <div >
                    <div onChange={this.handleChange} style = {{textAlign: 'center',fontSize:'21px'}}>
                        
                            {this.state.showInputForm &&
                                <div>
                                    <h4>Number of points(n) : &nbsp;&nbsp;<Input size="large" name="nPoints" value={this.state.nPoints}style={{ width: 200 }}></Input></h4><br />
                                    <h4>X : &nbsp;&nbsp;<Input size="large" name="X"value={this.state.X} style={{ width: 200 }}></Input></h4><br />
                                    <Button id="dimention_button" size="large"onClick={
                                        () => { this.createTableInput(parseInt(this.state.nPoints)) }
                                    }
                                        style={{ background: "#cc0000", color: "white" }}>
                                        Submit<br></br>
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
                                    <Table columns={columns} dataSource={tableTag} pagination={false} bordered={true} bodyStyle={{ fontWeight: "bold", fontSize: "18px", color: "white", overflowY: "scroll", minWidth: 120, maxHeight: 300 }}>

                                    </Table><br />
                                    <Button
                                        id="matrix_button"
                                        size="large"style={{ width: 150 ,background: "#f7c602", color: "black" }}
                                        onClick={() => this.initialValue(parseFloat(this.state.X))}>
                                        Submit
                                </Button>
                                </div>}


                    </div>
                    <br />
                    <div className="col">
                        {this.state.showOutputCard &&
                            <Card
                                title={"Output"}
                                bordered={true}
                                style={{ background: "#F0F8FF", color: "black", float: "inline-start" }}
                                id="outputCard"
                            >
                                <p style={{ fontSize: "24px", fontWeight: "bold" }}>X = {answer}</p>
                            </Card>
                        }
                    </div>
                </div>
            </div>
            </Content>
        );
    }
}
export default Spline;





