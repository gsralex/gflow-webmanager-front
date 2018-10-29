import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Switch, Route,Link,BrowserRouter as Router } from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload1.
          </p>
            <div>
              <ul>
                <li><Link to="/demo1">Demo1</Link></li>
                <li><Link to="/demo2">Demo2</Link></li>
              </ul>
              <hr/>
              {this.props.children}
            </div>

        </header>
      </div>
    );
  }
}

export default App;
