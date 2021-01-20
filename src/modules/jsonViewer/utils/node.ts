export const getNodeValue = (obj: Record<string, unknown>, path: string) => {
  return path
    .split(".")
    .reduce((r: Record<string, unknown>, k: string) => r[k] as {}, obj);
};

export const toggleNode = (
  hElem: Element | null,
  sElem: Element | null,
  sFunc: () => void
) => {
  hElem?.classList.add("hide");
  sElem ? sElem.classList.remove("hide") : sFunc();
};
