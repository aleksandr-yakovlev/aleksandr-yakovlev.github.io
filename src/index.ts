import { JsonViewer } from "./modules/jsonViewer";
import data from "./cv.json";

import "./style.css";

const container = document.getElementById("root") || document.body;
const expanded = true;
const autoTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
container.dataset.theme = autoTheme();

const setCheck = (elem: HTMLElement) => {
  (elem.parentElement?.childNodes as NodeListOf<HTMLElement>).forEach(
    (child) => {
      if (child.classList?.contains("checked"))
        child.classList.remove("checked");
    }
  );
  elem.classList.add("checked");
};

const jv = new JsonViewer({ container, data, expanded });

jv.render();

const themeButtons = <NodeListOf<HTMLElement>>(
  document.querySelectorAll("[data-set-theme]")
);
const actionButtons = <NodeListOf<HTMLElement>>(
  document.querySelectorAll("[data-action]")
);

themeButtons.forEach((button) => {
  const theme = button.dataset.setTheme;
  const fTheme = theme === "auto" ? autoTheme() : theme;
  button.addEventListener("click", () => {
    setCheck(button);
    container.dataset.theme = fTheme;
  });
});

actionButtons.forEach((button) => {
  const action = button.dataset.action;
  switch (action) {
    case "switch":
      {
        button.addEventListener("click", () => {
          const child = <HTMLElement>container.querySelector(".JSON_viewer");
          if (child) {
            const jv = new JsonViewer({
              container,
              data,
              expanded: !(child.dataset.expanded === "true"),
            });
            container.removeChild(child);
            jv.render();
          }
        });
      }
      break;
    default:
      break;
  }
});
