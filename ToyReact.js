class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type);
  }
  setAttribute(name, value) {
    if (name.startsWith("on")) {
      const eventName = name.replace(/^on[\s\S]/, (s) =>
        s.substr(2).toLocaleLowerCase()
      );
      this.root.addEventListener(eventName, value);
    } else {
      this.root.setAttribute(name, value);
    }
  }
  appendChild(vchild) {
    const range = document.createRange();
    if (this.root.children.length) {
      range.setStartAfter(this.root.lastChild);
      range.setEndAfter(this.root.lastChild);
    } else {
      range.setStart(this.root, 0);
      range.setEnd(this.root, 0);
    }
    vchild.mountTo(range);
  }
  mountTo(range) {
    range.deleteContents();
    range.insertNode(this.root);
  }
}

class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content);
  }
  mountTo(range) {
    range.deleteContents();
    range.insertNode(this.root);
  }
}

const merge = (oldState, newState) => {
  for (const i in newState) {
    if (typeof newState[i] === "object") {
      if (typeof oldState[i] !== "object") {
        oldState[i] = {};
      }
      merge(oldState[i], newState[i]);
    } else {
      oldState[i] = newState[i];
    }
  }
};

let components = 0;
const ranges = {};

class Component {
  constructor() {
    this.id = components++;
    this.children = [];
    this.props = Object.create(null);
    this.state = Object.create(null);
    this.merge = merge;
  }
  setAttribute(name, value) {
    this.props[name] = value;
    this[name] = value;
  }
  appendChild(vchild) {
    this.children.push(vchild);
  }
  mountTo(range) {
    this.range = range;
    this.update();
  }
  update() {
    if (!ranges[this.id]) {
      ranges[this.id] = document.createRange();
      ranges[this.id].setStart(this.range.endContainer, this.range.endOffset);
      ranges[this.id].setEnd(this.range.endContainer, this.range.endOffset);
      ranges[this.id].insertNode(document.createComment(""));
    } else {
      ranges[this.id].setStart(this.range.endContainer, this.range.endOffset);
      ranges[this.id].setEnd(this.range.endContainer, this.range.endOffset);
    }
    this.range.deleteContents();
    const vdom = this.render();
    vdom.mountTo(this.range);
  }
  setState(state) {
    this.merge(this.state, state);
    this.update();
  }
}

const ToyReact = {
  Component,
  createElement: (type, attr, ...children) => {
    let el;
    if (typeof type === "string") {
      el = new ElementWrapper(type);
    } else {
      el = new type(attr);
    }

    for (const name in attr) {
      el.setAttribute(name, attr[name]);
    }

    const insertChildren = (children) => {
      for (const child of children) {
        if (typeof child === "object" && child instanceof Array) {
          insertChildren(child);
        } else {
          if (
            !(child instanceof Component) &&
            !(child instanceof ElementWrapper) &&
            !(child instanceof TextWrapper)
          ) {
            child = String(child);
          }
          if (typeof child === "string") {
            child = new TextWrapper(child);
          }
          el.appendChild(child);
        }
      }
    };
    insertChildren(children);
    console.log('[ranges]', ranges)
    return el;
  },
  render: (vdom, el) => {
    const range = document.createRange();
    if (el.children.length) {
      range.setStartAfter(el.lastChild);
      range.setEndAfter(el.lastChild);
    } else {
      range.setStart(el, 0);
      range.setEnd(el, 0);
    }
    vdom.mountTo(range);
  },
};

export default ToyReact;
