import React, {
  createContext,
  Component,
  Fragment,
  lazy,
  Suspense,
  useState,
  useEffect
} from 'react';
import logo from './logo.svg';
import './App.css';

const About = lazy(() => import(/*webpackChunkName:"About"*/ './About')); //lazy()返回的就是一个react组件

//ErrorBoundary 使用 componentDidCatch生命周期函数

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

class App2 extends Component {
  state = {
    countNumber: 100,
    onlineState: false,
    hasError: false
  };

  componentDidCatch() {
    this.setState({
      hasError: true
    });
  }

  render() {
    if (this.state.hasError) {
      return <div>unable to loading component</div>;
    }

    const { countNumber, onlineState } = this.state;
    return (
      <Fragment>
        <Suspense fallback={<div>loading</div>}>
          <About />
        </Suspense>

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
      </Fragment>
    );
  } //向下传递值
}

class App3 extends Component {
  state = {
    count: 0,
    size: {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    }
  };

  onResize = () => {
    this.setState({
      size: {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
      }
    });
  };

  componentDidMount() {
    document.title = this.state.count;
    window.addEventListener('resize', this.onResize, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize, false);
  }
  componentDidUpdate() {
    document.title = this.state.count;
  }
  render() {
    const { count, size } = this.state;
    return (
      <button
        type='button'
        onClick={() => {
          this.setState({ count: count + 1 });
        }}>
        Click ({count}),Size({size.width}*{size.height})
      </button>
    );
  }
}

function App(props) {
  const [count, setCount] = useState(0);
  const [name, setName] = useState(() => {
    console.log('initial name');
    return props.defaultName || '';
  });
  const [size, setSize] = useState({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight
  });
  const onResize = () => {
    setSize({
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    });
  };

  useEffect(() => {
    document.title = count;
  });

  useEffect(() => {
    window.addEventListener('resize', onResize, false); //代替了didMount和didUpdate逻辑
    return () => {
      window.removeEventListener('resize', onResize, false);
    };
  }, []);

  const onClick = () => {
    console.log('clicked');
  };

  useEffect(() => {
    document.querySelector('#click').addEventListener('click', onClick, false);
    return () => {
      document
        .querySelector('#click')
        .removeEventListener('click', onClick, false);
    };
  });

  return (
    <Fragment>
      <button
        type='button'
        onClick={() => {
          setCount(count + 1); //调用参数为对count的操作
        }}>
        Click({count}),Size({size.width}*{size.height})
      </button>
      {count % 2 ? (
        <span id='click'>click me</span>
      ) : (
        <p id='click'>click me</p>
      )}
    </Fragment>
  );
}
export default App;
