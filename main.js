import ToyReact, { Component } from './ToyReact'

class App extends Component {
  render() {
    return <div>
      <span>Hello</span>
      <span>World</span>
      {this.children}
    </div>
  }
}

ToyReact.render(<App><span>!</span></App>, document.body)