import React, { Component } from 'react';
import { TextEditor } from './components';
import './App.css';

class App extends Component {
  componentDidMount(){
    window.addEventListener("beforeunload", function (e) {
      var confirmationMessage = "\o/";
    
      e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
      return confirmationMessage;              // Gecko, WebKit, Chrome <34
    });
  }
  render() {
    return (
      <div className="App">
        <TextEditor />
      </div>
    );
  }
}

export default App;
