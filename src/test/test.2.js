import React from "../react/react";

/**
 * 
 * @param {*} props 函数组件
 */
function FunctionComponent(props) {
  // 等价于 return <div className="title" style={{ color: 'red' }}><span>{props.name}</span>
  return React.createElement("div", {
    className: "title",
    style: {
      color: 'red'
    }
  }, React.createElement("span", null, props.name), props.children)
}

// 等价于 <FunctionComponent name="hello">world</FunctionComponent>;
export const element = React.createElement(FunctionComponent, {
  name: "hello",
}, "world");