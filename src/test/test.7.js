import React from "../react/react";
// import React from "react";

/**
 *  父组件 1.constructor
    父组件 2.componentWillMount
    父组件 3.render
    子组件 1.constructor
    子组件 4.componentWillMount
    子组件 9.render
    子组件 5.componentDidMount
    父组件 4.componentDidMount
  2 父组件 5.shouldComponentUpdate
    父组件 6.componentWillUpdate
    父组件 3.render
    子组件 2.componentWillReceiveProps
    子组件 3.shouldComponentUpdate
    父组件 7.componentDidUpdate
  2 父组件 5.shouldComponentUpdate
    父组件 6.componentWillUpdate
    父组件 3.render
    子组件 8.componentWillUnmount
    父组件 7.componentDidUpdate
 */
class Counter extends React.Component {
  static defaultProps = {
    name: "珠峰架构"
  };
  constructor(props) {
    super(props);
    this.state = { number: 0 }
    console.log("父组件 1.constructor")
  }
  // 取本地的数据 同步的方式：采用渲染之前获取数据，只渲染一次
  componentWillMount() {
    console.log("父组件 2.componentWillMount");
  }
  // 只渲染一次
  componentDidMount() {
    console.log("父组件 4.componentDidMount");
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log("父组件 5.shouldComponentUpdate");
    return nextState.number % 2 === 0;
  }
  //不要随便用setState 可能会死循环
  componentWillUpdate() {
    console.log("父组件 6.componentWillUpdate");
  }
  componentDidUpdate() {
    console.log("父组件 7.componentDidUpdate");
  }

  handleClick = () => {
    this.setState({ number: this.state.number + 1 });
  };

  render() {
    console.log("父组件 3.render");
    return (
      // <div>
      //   <p>{this.state.number}</p>
      //   {this.state.number === 4 ? null : <ChildCounter count={this.state.number} />}
      //   <button onClick={this.handleClick}>+</button>
      // </div>
      React.createElement("div", null, React.createElement("p", null, this.state.number), this.state.number === 4 ? null : React.createElement(ChildCounter, {
        count: this.state.number
      }), React.createElement("button", {
        onClick: this.handleClick
      }, "+"))
    )
  }
}

class ChildCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { number: 0 }
    console.log("子组件 1.constructor")
  }
  componentWillReceiveProps(newProps) { // 第一次不会执行，之后属性更新时才会执行
    console.log("子组件 2.componentWillReceiveProps")
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log("子组件 3.shouldComponentUpdate");
    return nextProps.n % 3 === 0; //子组件判断接收的属性 是否满足更新条件 为true则更新
  }
  componentWillMount() {
    console.log("子组件 4.componentWillMount");
  }
  // 只渲染一次
  componentDidMount() {
    console.log("子组件 5.componentDidMount");
  }
  //不要随便用setState 可能会死循环
  componentWillUpdate() {
    console.log("子组件 6.componentWillUpdate");
  }
  componentDidUpdate() {
    console.log("子组件 7.componentDidUpdate");
  }
  componentWillUnmount() {
    console.log(" 子组件 8.componentWillUnmount")
  }
  render() {
    console.log("子组件 9.render")
    // <div>
    //     {this.props.count}
    // </div>
    return (
      React.createElement("div", null, this.props.count)
    )
  }
}

export const element = React.createElement(Counter);