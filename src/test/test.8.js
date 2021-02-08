import React from "../react/react";
// import React from "react";

const ThemeContext = React.createContext(null);
class Header extends React.Component {
  render() {
    return (
      // <ThemeContext.Consumer>
      //   {
      //     (value) => (
      //       <div style={{ border: `5px solid ${value.color}`, padding: "5px" }}>
      //         header
      //         <Title />
      //       </div>
      //     )
      //   }
      // </ThemeContext.Consumer>
      React.createElement(ThemeContext.Consumer, null, value => React.createElement("div", {
        style: {
          border: `5px solid ${value.color}`,
          padding: "5px"
        }
      }, "header", React.createElement(Title, null)))
    )
  }
}
class Title extends React.Component {
  render() {
    // return (
    //   <ThemeContext.Consumer>
    //     {
    //       (value) => (
    //         <div style={{ border: `5px solid ${value.color}` }}>
    //           title
    //         </div>
    //       )
    //     }
    //   </ThemeContext.Consumer>
    // )
    return React.createElement(ThemeContext.Consumer, null, value => React.createElement("div", {
      style: {
        border: `5px solid ${value.color}`
      }
    }, "title"));
  }
}
class Main extends React.Component {
  render() {
    return (
      // <ThemeContext.Consumer>
      //   {
      //     (value) => (
      //       <div style={{ border: `5px solid ${value.color}`, margin: "5px", padding: "5px" }}>
      //         main
      //         <Content />
      //       </div>
      //     )
      //   }
      // </ThemeContext.Consumer>
      React.createElement(ThemeContext.Consumer, null, value => React.createElement("div", {
        style: {
          border: `5px solid ${value.color}`,
          margin: "5px",
          padding: "5px",
        }
      }, "main", React.createElement(Content, null)))
    )
  }
}
class Content extends React.Component {
  render() {
    return (
      // <ThemeContext.Consumer>
      //   {
      //     (value) => (
      //       <div style={{ border: `5px solid ${value.color}`, padding: "5px" }}>
      //         Content
      //         <button onClick={() => value.changeColor("red")} style={{ color: "red" }}>红色</button>
      //         <button onClick={() => value.changeColor("green")} style={{ color: "green" }}>绿色</button>
      //       </div>
      //     )
      //   }
      // </ThemeContext.Consumer>
      React.createElement(ThemeContext.Consumer, null, value => React.createElement("div", {
        style: {
          border: `5px solid ${value.color}`,
          padding: "5px"
        }
      }, "Content", React.createElement("button", {
        onClick: () => value.changeColor("red"),
        style: {
          color: "red"
        }
      }, "红色"), React.createElement("button", {
        onClick: () => value.changeColor("green"),
        style: {
          color: "green"
        }
      }, "绿色")))
    )
  }
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = { color: "red" };
  }
  changeColor = (color) => {
    this.setState({ color });
  }
  render() {
    const contextVal = { changeColor: this.changeColor, color: this.state.color };
    return (
      // <ThemeContext.Provider value={contextVal}>
      //   <div style={{ margin: "10px", border: `5px solid ${this.state.color}`, padding: "5px", width: 200 }}>
      //     page
      //     <Header />
      //     <Main />
      //   </div>
      // </ThemeContext.Provider>
      React.createElement(ThemeContext.Provider, {
        value: contextVal
      }, React.createElement("div", {
        style: {
          margin: "10px",
          border: `5px solid ${this.state.color}`,
          padding: "5px",
          width: "200px",
        }
      }, "page", React.createElement(Header, null), React.createElement(Main, null)))
    )
  }
}

export const element = React.createElement(Page);