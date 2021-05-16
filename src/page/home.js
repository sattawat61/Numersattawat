import Bar from '../componant/bar';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const home = () => {
    return (
        <div id="content" style={{ padding: 21, background: '#f5f5dc', minHeight: 710 }}>
        <div className="header_area">
            <h1>NUMERICAL METHOD PROJECT</h1>
            <h2>SATTAWAT TUSUMRAN</h2>    
        </div>
    </div>
    )
};
export default home;