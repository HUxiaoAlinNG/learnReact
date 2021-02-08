import React from "../react/react";
// import React from "react";

const ChildCounter3 = (props) => {
  console.log("ChildCounter3 render");
  return (
    // <div>
    //   ChildCounter3:{props.number}
    // </div>
    React.createElement("div", null, "ChildCounter3:", props.number)
  )
}
const MemoChildCounter3 = React.memo(ChildCounter3);

class Counter extends React.Component {
  state = { number1: 0, number2: 0, number3: 0 }
  addNumber1 = () => {
    this.setState({ number1: this.state.number1 + 1 });
  }
  addNumber2 = () => {
    this.setState({ number2: this.state.number2 + 1 });
  }
  addNumber3 = () => {
    this.setState({ number3: this.state.number3 + 1 });
  }
  render() {
    console.log("Counter render");
    return (
      // <div>
      //   <ChildCounter1 number={this.state.number1} />
      //   <ChildCounter2 number={this.state.number2} />
      //   <MemoChildCounter3 number={this.state.number3} />
      //   <button onClick={this.addNumber1}>ChildCounter1+</button>
      //   <button onClick={this.addNumber2}>ChildCounter2+</button>
      //   <button onClick={this.addNumber3}>ChildCounter3+</button>
      // </div>
      React.createElement("div", null, React.createElement(ChildCounter1, {
        number: this.state.number1
      }), React.createElement(ChildCounter2, {
        number: this.state.number2
      }), React.createElement(MemoChildCounter3, {
        number: this.state.number3
      }), React.createElement("button", {
        onClick: this.addNumber1
      }, "ChildCounter1+"), React.createElement("button", {
        onClick: this.addNumber2
      }, "ChildCounter2+"), React.createElement("button", {
        onClick: this.addNumber3
      }, "ChildCounter3+"))
    )
  }
}
class ChildCounter1 extends React.Component {
  render() {
    console.log("ChildCounter1 render");
    return (
      // <div>
      //   ChildCounter1:{this.props.number}
      // </div>
      React.createElement("div", null, "ChildCounter1:", this.props.number)
    )
  }
}
class ChildCounter2 extends React.PureComponent {
  render() {
    console.log("ChildCounter2 render");
    return (
      // <div>
      //   ChildCounter2:{this.props.number}
      // </div>
      React.createElement("div", null, "ChildCounter2:", this.props.number)
    )
  }
}


export const element = React.createElement(Counter);