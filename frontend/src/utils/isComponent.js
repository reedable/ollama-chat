//FIXME is this the correct name? Should it be isComponentProp?
export default function isComponent(object) {
  return (
    typeof object === 'function' ||
    (typeof object === 'object' && object !== null && 'type' in object)
  );
}
