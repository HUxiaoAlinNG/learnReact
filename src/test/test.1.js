import React from "../react/react";

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

// <div className="title" style={{ color: 'red' }}><span>hello</span>world</div>
export const element = React.createElement("div", {
  className: "title",
  style: {
    color: 'red'
  }
}, React.createElement("span", null, "hello"), "world");