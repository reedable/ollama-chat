export default function stringToTemplate(string, values = {}) {
  try {
    const func = new Function(...Object.keys(values), `return \`${string}\`;`);
    return func(...Object.values(values));
  } catch (e) {
    return string;
  }
}
