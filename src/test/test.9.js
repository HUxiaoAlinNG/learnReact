import React from "react";
/**
 * 原生
 */
class MouseTracker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div onMouseMove={this.handleMouseMove} style={{ border: "1px solid red" }}>
        <h1>移动鼠标!</h1>
        <p>当前的鼠标位置是 ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}

export const element = React.createElement(MouseTracker);

/**
 * HOC
 * @param {*} OldComponent 
 */
function withTracker(OldComponent) {
  return class MouseTracker0 extends React.Component {
    constructor(props) {
      super(props);
      this.state = { x: 0, y: 0 };
    }
    handleMouseMove = (event) => {
      this.setState({
        x: event.clientX,
        y: event.clientY
      });
    }
    render() {
      return (
        <div onMouseMove={this.handleMouseMove} style={{ border: "1px solid red" }}>
          <OldComponent {...this.state} />
        </div>
      )
    }
  }
}
//render
function Show(props) {
  return (
    <React.Fragment>
      <h1>请移动鼠标</h1>
      <p>当前鼠标的位置是: x:{props.x} y:{props.y}</p>
    </React.Fragment>
  )
}
export const element0 = React.createElement(withTracker(Show));

/**
 * render属性 
 */
class MouseTracker1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div onMouseMove={this.handleMouseMove} style={{ border: "1px solid red" }}>
        {this.props.render(this.state)}
      </div>
    );
  }
}

export const element1 = <MouseTracker1 render={params => (
  <>
    <h1>移动鼠标!</h1>
    <p>当前的鼠标位置是 ({params.x}, {params.y})</p>
  </>
)} />

/**
 * children
 */
class MouseTracker2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div onMouseMove={this.handleMouseMove} style={{ border: "1px solid red" }}>
        {this.props.children(this.state)}
      </div>
    );
  }
}

export const element2 = <MouseTracker2 >
  {
    (props) => (
      <div>
        <h1>移动鼠标!</h1>
        <p>当前的鼠标位置是 ({props.x}, {props.y})</p>
      </div>
    )
  }
</MouseTracker2 >
