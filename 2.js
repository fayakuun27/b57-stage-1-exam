const sentence = "Dumbways is awesome";

function sortArray(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] === sentence[i]) {
        [arr[i], arr[j]] = [arr[j], arr[i]]; //swap
        break;
      }
    }
  }
  return console.log(arr.join(""));
}

sortArray([
  "u",
  "D",
  "m",
  "w",
  "b",
  "a",
  "y",
  "s",
  "i",
  "s",
  "w",
  "a",
  "e",
  "s",
  "e",
  "o",
  "m",
  " ",
  " ",
]);
