export default function sharedKeys(objA, objB) {
  
  if (!objA || !objB) {
    return [];
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length === 0 || keysB.length === 0) {
    return [];
  }

  if (objA === objB) {
    return keysA;
  }

  let sharedKeys = [];

  const hasOwn = Object.prototype.hasOwnProperty;
  for (let keyA of keysA) {
    if (hasOwn.call(objB, keyA)) {
      sharedKeys.push(keyA);
    }
  }

  return sharedKeys;
}