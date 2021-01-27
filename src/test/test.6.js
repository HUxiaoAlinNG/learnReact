import React from "../react/react";
// import React from "react";

/**
 *  Counter 1.constructor
    Counter 2.componentWillMount
    Counter 3.render
    Counter 4.componentDidMount
  2 Counter 5.shouldComponentUpdate
    Counter 6.componentWillUpdate
    Counter 3.render
    Counter 7.componentDidUpdate
  2 Counter 5.shouldComponentUpdate
    Counter 6.componentWillUpdate
    Counter 3.render
    Counter 7.componentDidUpdate
 */
class Counter extends React.Component {
  static defaultProps = {
    name: '珠峰架构'
  };
  constructor(props) {
    super(props);
    this.state = { number: 0 }
    console.log('Counter 1.constructor')
  }
  // 取本地的数据 同步的方式：采用渲染之前获取数据，只渲染一次
  componentWillMount() {
    console.log('Counter 2.componentWillMount');
  }
  // 只渲染一次
  componentDidMount() {
    console.log('Counter 4.componentDidMount');
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log('Counter 5.shouldComponentUpdate');
    return nextState.number % 2 === 0;
  }
  //不要随便用setState 可能会死循环
  componentWillUpdate() {
    console.log('Counter 6.componentWillUpdate');
  }
  componentDidUpdate() {
    console.log('Counter 7.componentDidUpdate');
  }

  handleClick = () => {
    this.setState({ number: this.state.number + 1 });
  };

  render() {
    console.log('Counter 3.render');
    return (
      // <div>
      //   <p>{this.state.number}</p>
      //   <button onClick={this.handleClick}>+</button>
      // </div>
      React.createElement("div", null, React.createElement("p", null, this.state.number), React.createElement("button", {
        onClick: this.handleClick
      }, "+"))
    )
  }
}

export const element = React.createElement(Counter);