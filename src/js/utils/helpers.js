export function createDOMElement(tagName, options, innerHTML) {
  const element = document.createElement(tagName);
  if (options) {
    Object.keys(options).forEach((key) => {
      element[key] = options[key];
    });
  }
  if (innerHTML) {
    if (typeof innerHTML === 'string') {
      element.innerHTML = innerHTML;
    } else {
      element.append(innerHTML);
    }
  }
  return element;
}

export function renderDOMElement(element, parent) {
  if (parent) {
    parent.append(element);
  }
}
