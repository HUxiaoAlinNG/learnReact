import React from "react";
// import ReactDOM from "react-dom";

const CounterContext = React.createContext();

function reducer(state, action) {
  switch (action.type) {
    case 'add':
      return { number: state.number + 1 };
    case 'minus':
      return { number: state.number - 1 };
    default:
      return state;
  }
}
function Counter() {
  const { state, dispatch } = React.useContext(CounterContext);
  return (
    <>
      <p>{state.number}</p>
      <button onClick={() => dispatch({ type: 'add' })}>+</button>
      <button onClick={() => dispatch({ type: 'minus' })}>-</button>
    </>
  )
}
function App() {
  const [state, dispatch] = React.useReducer(reducer, { number: 0 });
  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      <Counter />
    </CounterContext.Provider>
  )
}

export const element = React.createElement(App);