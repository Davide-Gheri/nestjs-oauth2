
export function isEmpty(obj: object) {
  return !obj || Object.keys(obj).length === 0;
}

export function isNil(value: any) {
  return !value;
}

export const removeFalsy = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.filter(removeFalsy);
  }
  if (typeof obj === 'object' && obj !== null) {
    return Object.keys(obj).filter(k => {
      if (isNil(obj[k])) {
        return false;
      }
      return !(typeof obj[k] === 'object' && isEmpty(obj[k]));
    }).reduce((acc, curr) => ({
      [curr]: removeFalsy(obj[curr]),
      ...acc,
    }), {});
  }
  return obj;
}
