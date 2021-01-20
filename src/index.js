import React from './react/react';
import ReactDOM from './react/react-dom';

let element1 = <div className="title" style={{ color: 'red' }}><span>hello</span>world</div>;
console.log(JSON.stringify(element1, null, 2))
/**
 * {
    "type": "div",
    "key": null,
    "ref": null,
    "props": {
      "className": "title",
      "style": {
        "color": "red"
      },
      "children": [
        {
          "type": "span",
          "key": null,
          "ref": null,
          "props": {
            "children": "hello"
          },
          "_owner": null,
          "_store": {}
        },
        "world"
      ]
    },
    "_owner": null,
    "_store": {}
  }
 */

/**
 * <div className="title" style={{ color: 'red' }}><span>hello</span>world</div>
 * 等价于
 * const element = React.createElement("div", {
    className: "title",
    style: {
      color: 'red'
    }
  }, React.createElement("span", null, "hello"), "world");
 */

/**
 * 
 * @param {*} props 函数组件
 */
// function FunctionComponent(props) {
//   // 等价于 return <div className="title" style={{ color: 'red' }}><span>{props.name}</span>
//   return React.createElement("div", {
//     className: "title",
//     style: {
//       color: 'red'
//     }
//   }, React.createElement("span", null, props.name), props.children)
// }

// 等价于 <FunctionComponent name="hello">world</FunctionComponent>;
// const element = React.createElement(FunctionComponent, {
//   name: "hello",
// }, "world");

/**
 * 类组件
 */
// class ClassComponent extends React.Component {
//   render() {
//     // 等价于 <div className="title" style={{ color: 'red' }}><span>{this.props.name}</span>{this.props.children}</div>;
//     return React.createElement("div", {
//       className: "title",
//       style: {
//         color: 'red'
//       }
//     }, React.createElement("span", null, this.props.name), this.props.children);
//   }
// }
// const element = React.createElement(ClassComponent, {
//   name: "hello",
// }, "world");

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
const element = React.createElement(Counter, { title: "计数器" });

ReactDOM.render(
  element,
  document.getElementById('root')
);
