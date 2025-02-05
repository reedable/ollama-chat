import Arrays from '@utils/Arrays';

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

const attr = (props) =>
  Object.entries(props).filter(filterEntries).reduce(reduceEntries, {});

const classNames = (...classNames) => Arrays.pack(...classNames).join(' ');

const DOM = {
  attr,
  classNames,
};

export default DOM;
