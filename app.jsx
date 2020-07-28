import ToyReact from "./ToyReact.js";

class Square extends ToyReact.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
  }

  onClick() {
    const { value } = this.state
    this.setState({ value: value === "" ? "X" : "" });
  }

  render() {
    const { value } = this.state;
    return (
      <button class="square" onClick={this.onClick.bind(this)}>
        {value}
      </button>
    );
  }
}

class App extends ToyReact.Component {
  renderSquare(i) {
    return <Square value={i} />;
  }

  render() {
    return (
      <div>
        <div class="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div class="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div class="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

export default App;
