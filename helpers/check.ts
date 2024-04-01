export const isEmptyValue = (value) => {
    return !isExist(value);
  };
  
  export const isExist = (value) => {
    if (typeof value === 'boolean') return true;
    if (typeof value === 'number') return true;
    if (!value) return false;
    return Object.keys(value).length > 0;
  };
  
  export function cleanObject(obj) {
    for (let propName in obj) {
      if (isEmptyValue(obj[propName])) {
        delete obj[propName];
      }
    }
    return obj;
  }
  
  export class AppCheckUtils {
    static isSameFile({ firstFile, secondFile }) {
      const firstFileString = JSON.stringify(
        `${firstFile?.lastModified}_${firstFile?.name}_${firstFile?.type}_${firstFile?.size}`,
      );
      const secondFileString = JSON.stringify(
        `${secondFile?.lastModified}_${secondFile?.name}_${secondFile?.type}_${secondFile?.size}`,
      );
      return firstFileString === secondFileString;
    }
  }
  