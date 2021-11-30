// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
export const getRandomInt = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomElementsArray = (arr, n) => {
  const resultArray = new Array(n);
  let len = arr.length;
  const taken = new Array(len);
  while (n--) {
    const x = Math.floor(Math.random() * len);
    resultArray[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return resultArray;
};

export const generateRandomElementOfArray = (array) => {
  const randomIndex = getRandomInt(0, array.length - 1);
  return array[randomIndex];
};

export const getFirstWordOfString = (element) => {
  const newString = String(element);
  for (let i = 0; i < newString.length; i++) {
    if (newString[i] ===' ') {
      const endOfSymbol = (i);
      const firstWord = newString.substring(0, endOfSymbol);
      return firstWord;
    }
  }
};
