import "./screens/style.common.css";
import "./screens/style.first.css";
import "./screens/style.template.css";
import "./style.header.css";
import "./style.footer.css";

[...document.getElementsByClassName("home")].forEach((home) => {
  home.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
