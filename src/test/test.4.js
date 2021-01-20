import React from "../react/react";

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { number: 0 };
  }
  handleClick = () => {
    // 在一个函数执行事件完毕后批量渲染，所以这里看似是异步更新
    this.setState((preState) => ({ number: preState.number + 1 }));
    console.log(this.state.number);  // ==> 0
    this.setState({ number: this.state.number + 1 });
    console.log(this.state.number);// ==> 0
    this.setState({ number: this.state.number + 1 });
    console.log(this.state.number);// ==> 0
    // 函数执行事件完毕后立即执行，为同步更新
    setTimeout(() => {
      console.log(this.state.number); // ==> 1
      this.setState((preState) => ({ number: preState.number + 1 }));
      console.log(this.state.number); // ==> 2
      this.setState({ number: this.state.number + 1 });
      console.log(this.state.number); // ==> 3
      this.setState({ number: this.state.number + 1 });
      console.log(this.state.number); // ==> 4
    });
  }

  render() {
    // return (
    //   <div>
    //     <p>number:{this.state.number}</p>
    //     <button onClick={this.handleClick}></button>
    //   </div>
    // )
    return React.createElement("div", null, React.createElement("p", null, "number:", this.state.number), React.createElement("button", {
      onClick: this.handleClick
    }, "+1"));
  }
}
export const element = React.createElement(Counter, { title: "计数器" });