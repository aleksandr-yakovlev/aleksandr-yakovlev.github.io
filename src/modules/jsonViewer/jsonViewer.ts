import { isKeyValue } from "../checkTypes";
import { renderNode, renderKeyValue, toggleNode, getNodeValue } from "./utils";

import "./styles/style.css";

interface IJsonViewer {
  options: IJsonViewerOptions;
  state: IJsonViewerState;
}

interface IJsonViewerOptions {
  container: HTMLElement;
  data: Record<string, unknown>;
  expanded: boolean;
}

interface IJsonViewerState {
  eKeys: Record<string, boolean>;
}

export class JsonViewer implements IJsonViewer {
  options: IJsonViewerOptions;
  state: IJsonViewerState;
  constructor(options: IJsonViewerOptions) {
    this.options = options;
    this.state = {
      eKeys: {},
    };
  }

  private componentDidMount() {
    this.addKeyClickHandler(this.options.container);
  }

  private componentDidUpdate(container: Element) {
    this.addKeyClickHandler(container);
  }

  private addKeyClickHandler = (container: Element) => {
    const { eKeys } = this.state;
    const { expanded, data } = this.options;
    Array.from(container.getElementsByClassName("key")).forEach((key) => {
      const { parentElement: parrent } = key;
      if (parrent) {
        const { id: path } = parrent;
        const elem = getNodeValue(data, path);
        if (isKeyValue(elem)) {
          key.addEventListener(
            "click",
            () => {
              const elemValue = parrent.querySelector(":scope > .value");
              const elemPreview = parrent.querySelector(":scope > .preview");
              const separator = parrent.querySelector(":scope > .separator");
              eKeys[path] = !(eKeys.hasOwnProperty(path)
                ? eKeys[path]
                : expanded);
              const eKey = eKeys[path];
              const sElem = eKeys[path] ? elemValue : elemPreview;
              const hElem = eKeys[path] ? elemPreview : elemValue;
              const rElem = separator || parrent;
              const sFunc = () => {
                rElem.insertAdjacentHTML(
                  separator ? "beforebegin" : "beforeend",
                  renderKeyValue({
                    expanded: eKey,
                    toggle: true,
                    data: elem,
                    path,
                  })
                );
                if (eKeys[path]) {
                  const iElem = parrent.querySelector(":scope > .value");
                  if (iElem) this.componentDidUpdate(iElem);
                }
              };
              if (parrent.classList.contains("switch")) {
                eKey
                  ? parrent.classList.add("expanded")
                  : parrent.classList.remove("expanded");
              }
              toggleNode(hElem, sElem, sFunc);
            },
            false
          );
        }
      }
    });
  };

  render() {
    const { expanded, data, container } = this.options;
    container.insertAdjacentHTML(
      "beforeend",
      `<div class="JSON_viewer" data-expanded=${expanded}>${renderNode({
        expanded,
        data,
      })}</div>`
    );
    this.componentDidMount();
  }
}
