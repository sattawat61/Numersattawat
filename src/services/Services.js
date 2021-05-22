import { compile, derivative } from 'mathjs';
var Algebrite = require('algebrite');

const func = (fx, X) => {
    var expr = compile(fx); // f(x)แก้สมการ
    let scope = { x: parseFloat(X) }; //f(x) ; x=input
    return expr.evaluate(scope);//ตำตอบที่เอาscopeลงไปแทน
}
const funcDiff = (fx, X) => {
    var expr = derivative(fx, 'x');//แทนค่า
    let scope = {x:parseFloat(X)};
    return expr.evaluate(scope); 
}

const funcDiffDegreeN = (fx, X, degree) => {
    var temp = fx, expr;
    for (var i=1 ; i<=degree ; i++) {
        temp = derivative(temp, 'x')
        expr = temp
    }
    
    let scope = {x:parseFloat(X)}
    return expr.evaluate(scope)
}
const error = (xnew, xold) => {
    return Math.abs((xnew - xold) / xnew);
}
const exactIntegrate = (fx, a, b) => {
    var expr = compile(Algebrite.integral(Algebrite.eval(fx)).toString())
    return expr.evaluate({x:b}) - expr.evaluate({x:a})

}
export { func, funcDiff, funcDiffDegreeN, error, exactIntegrate };