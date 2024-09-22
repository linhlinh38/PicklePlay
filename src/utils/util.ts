export function getRandomNumber() {
  const min = 1000000000000000; // 1 followed by 15 zeros
  const max = 9007199254740991; // 9 followed by 16 nines
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
