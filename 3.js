let pattern = "";

function cetakPola(x) {
  for (let i = x; i > 0; i--) {
    for (let k = x; k > i; k--) {
      pattern += " ";
    }
    for (let j = 0; j < i; j++) {
      if (i % 4 == 1) {
        if (j % 2 == 0) {
          pattern += "# ";
        } else {
          pattern += "* ";
        }
      } else if (i % 2 == 1 && i % 4 != 1) {
        if (j == 1) {
          pattern += "# ";
        } else {
          pattern += "* ";
        }
      } else {
        pattern += "* ";
      }
    }
    pattern += "\n";
  }
  return console.log(pattern);
}

cetakPola(5);
