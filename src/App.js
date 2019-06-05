import React, { Component } from 'react';
import { PT101 } from './components';
import './App.css';

class App extends Component {
  constructor() {
    super()
    this.onUnload = this.onUnload.bind(this);
  }

  onUnload = (e) => {
    e.preventDefault();
  }
  componentDidMount() {
    window.addEventListener("beforeunload", this.onUnload)
  }
  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.onUnload)
  }
  render() {

    return (
      <div className="App">
        <PT101 />
      </div>
    );
  }
}

export default App;
