import React from "../react/react";

/**
 * 类组件
 */
class ClassComponent extends React.Component {
  render() {
    // 等价于 <div className="title" style={{ color: 'red' }}><span>{this.props.name}</span>{this.props.children}</div>;
    return React.createElement("div", {
      className: "title",
      style: {
        color: 'red'
      }
    }, React.createElement("span", null, this.props.name), this.props.children);
  }
}
export const element = React.createElement(ClassComponent, {
  name: "hello",
}, "world");