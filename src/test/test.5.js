import React from "../react/react";

class Sum extends React.Component {
  constructor(props) {
    super(props);
    this.a = React.createRef();
    this.b = React.createRef();
    this.result = React.createRef();
  }
  handleAdd = () => {
    let a = this.a.current.value;
    let b = this.b.current.value;
    this.result.current.value = Number(a) + Number(b);
  }
  render() {
    // return (
    //     <div>
    //         <input ref={this.a} />+<input ref={this.b} /><button onClick={this.handleAdd}>=</button><input ref={this.result} />
    //     </div>
    // );
    return React.createElement("div", null, React.createElement("input", {
      ref: this.a
    }), "+", React.createElement("input", {
      ref: this.b
    }), React.createElement("button", {
      onClick: this.handleAdd
    }, "="), React.createElement("input", {
      ref: this.result
    }));
  }
}

export const element = React.createElement(Sum);