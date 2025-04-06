import Arrays from '@utils/Arrays.js';

export const REM = parseFloat(
  getComputedStyle(document.documentElement).fontSize,
);

function reduceEntries(object, [key, value]) {
  object[key] = value;
  return object;
}

function filterEntries([key, _value]) {
  return (
    key === 'id' ||
    key === 'role' ||
    /^aria-.*$/.test(key) ||
    /^data-.*$/.test(key)
  );
}

export const getAttr = (props) =>
  Object.entries(props).filter(filterEntries).reduce(reduceEntries, {});

export const getClassNames = (...classNames) =>
  Arrays.pack(...classNames).join(' ');
