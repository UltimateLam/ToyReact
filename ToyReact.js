class ElementWrapper {
  constructor (type) {
    this.root = document.createElement(type)
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value)
  }
  appendChild(vchild){
    vchild.mountTo(this.root)
  }
  mountTo(parent) {
    parent.appendChild(this.root)
  }
}

class TextWrapper {
  constructor (content) {
    this.root = document.createTextNode(content)
  }
  mountTo(parent) {
    parent.appendChild(this.root)
  }
}

class Component {
  constructor() {
    this.children = []
  }
  setAttribute(name, value) {
    this[name] = value
  }
  appendChild(vchild){
    this.children.push(vchild)
  }
  mountTo(parent) {
   let vdom = this.render()
   vdom.mountTo(parent)
 }
}

const createElement = (type, attr, ...children) => {
  let el
  if (typeof type === 'string') {
    el = new ElementWrapper(type)
  } else {
    el  = new type
  }

  for (const name in attr) {
    el.setAttribute(name, attr[name])
  }

  let insertChildren = (children) => {
    for(const child of children) {
      if(typeof child === 'object' && child instanceof Array) {
        insertChildren(child)
      } else {
        if(!(child instanceof Component) && !(child instanceof ElementWrapper) && !(child instanceof TextWrapper)) {
          child = String(child)
        }
        if(typeof child === 'string') {
          child = new TextWrapper(child)
        }
        el.appendChild(child)
      }
    }
  }
  insertChildren(children)

  return el
}

const render = (vdom, el) => {                                                                                                            
  vdom.mountTo(el)
}

const ToyReact = {
  Component,
  createElement,
  render
}

export default ToyReact