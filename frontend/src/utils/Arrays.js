function pack(...elements) {
  return Array.from(elements).filter(Boolean);
}

const Arrays = {
  pack,
};

export default Arrays;
