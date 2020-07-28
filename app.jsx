import ToyReact from './ToyReact.js'

class App extends ToyReact.Component {
  render() {
    return <div>
      <span>Hello</span>
      <span>World</span>
      {this.children}
    </div>
  }
}

export default App