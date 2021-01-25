import * as _ from "../../checkTypes";

type nodeType = Record<string | number, unknown>;

type nodeOptionsType = {
  expanded?: boolean;
  toggle?: boolean;
  data: nodeType;
  path?: string;
  keyValue?: boolean;
  truncLength?: number;
};

const renderKey = (key: string) => {
  return `<span class="key">${key}${key && ":"}</span>`;
};

const getMoreSpan = (count: number) => {
  return count > 0 ? `<span class="more">...${count}\u00A0more...</span>` : "";
};

const renderPrimitive = (
  { data, truncLength = 30 }: nodeOptionsType,
  isTrunc = false
) => {
  const value = JSON.stringify(data);
  const fValue = isTrunc
    ? `${value.substring(0, truncLength).trimRight()}${getMoreSpan(
        value.length - truncLength
      )}`
    : value;
  return `<span tabindex="0" class="value ${
    (_.isNumber(data) && "number") ||
    (_.isBoolean(data) && "boolean") ||
    (_.isNull(data) && "null") ||
    "string"
  }">${fValue}</span>`;
};

export const renderKeyValue = ({
  expanded = true,
  toggle,
  ...options
}: nodeOptionsType) => {
  return expanded
    ? renderNode({
        expanded: toggle ? !expanded : expanded,
        ...options,
      })
    : renderPreview(options);
};

const renderValue = (
  value: nodeType,
  { keyValue = _.isKeyValue(value), ...options }: nodeOptionsType
) => {
  return keyValue ? renderKeyValue(options) : renderPrimitive(options);
};

const renderPreview = ({ data }: nodeOptionsType) => {
  return `<span class="preview">${getNodePreview(data)}</span>`;
};

const getNodePreview = (node: nodeType): string => {
  const visibleCount = 4;
  const isNodeArr = _.isArray(node);
  const allKeys = Object.keys(node);
  const rem = allKeys.length - visibleCount;
  const visibleKeys = allKeys.slice(0, visibleCount);

  const childs = visibleKeys.map((key) => {
    const data = (isNodeArr ? node[Number(key)] : node[key]) as nodeType;
    return `${isNodeArr ? "" : renderKey(key)}${
      (_.isObject(data) && "{...}") ||
      (_.isArray(data) && "[...]") ||
      renderPrimitive({ data }, _.isString(data))
    }`;
  });

  if (rem > 0) {
    const more = getMoreSpan(rem);
    childs.push(more);
  }

  const nodePreview = childs.join(", ");

  return isNodeArr ? `[ ${nodePreview} ]` : `{ ${nodePreview} }`;
};

export const renderNode = ({
  expanded,
  data,
  path,
}: nodeOptionsType): string => {
  const isNodeArr = _.isArray(data);
  return `<div class = "value object">
      <span>${isNodeArr ? "[" : "{"}</span>
        <ul>
          ${Object.keys(data)
            .map((key) => {
              const childData = data[key] as nodeType;
              const childPath = path ? `${path}.${key}` : key;
              const keyValue = _.isKeyValue(childData);
              return `
              <li id="${childPath}" ${
                keyValue ? `class="switch${expanded ? " expanded" : ""}"` : ""
              }> 
              ${renderKey(isNodeArr ? "" : key)}
              ${renderValue(childData, {
                data: childData,
                path: childPath,
                expanded,
                keyValue,
              })}`;
            })
            .join("<span class='separator'>,</span></li>")}
          </li>
        </ul>
      <span>${isNodeArr ? "]" : "}"}</span></div>`;
};
