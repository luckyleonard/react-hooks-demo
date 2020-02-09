import React, { createContext, Component, Fragment } from 'react';
import logo from './logo.svg';
import './App.css';

const CountdownContext = createContext();
const OnlineContext = createContext();

class Leaf extends Component {
  static contextType = CountdownContext;
  render() {
    const countNumber = this.context;
    return (
      <Fragment>
        <h1>Count Down:{countNumber}</h1>
        <OnlineContext.Consumer>
          {onlineState => <h1>Online State: {String(onlineState)}</h1>}
        </OnlineContext.Consumer>
      </Fragment>
    ); //组件内部不能加其他组件，而是直接渲染的值
  }
}

function Middle() {
  return <Leaf />;
}

class App extends Component {
  state = {
    countNumber: 100,
    onlineState: false
  };
  render() {
    const { countNumber, onlineState } = this.state;
    return (
      <CountdownContext.Provider value={countNumber}>
        <OnlineContext.Provider value={onlineState}>
          {/* provide要进行嵌套 */}
          <button
            onClick={() => this.setState({ countNumber: countNumber - 1 })}>
            Reduce 1
          </button>
          <button
            onClick={
              () => this.setState({ onlineState: !onlineState }) //online取反
            }>
            Toggle Online
          </button>
          <Middle />
        </OnlineContext.Provider>
      </CountdownContext.Provider>
    );
  } //向下传递值
}

export default App;
