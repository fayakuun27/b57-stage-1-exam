function calculateAndShowMoney(year) {
  const deposit = 350000000 + ((year * 3.5) / 100) * 350000000;
  console.log("deposit:", deposit);
  const obligation =
    (30 / 100) * 650000000 + ((((year * 13) / 100) * 30) / 100) * 650000000;
  console.log("obligation:", obligation);
  const stockA =
    (35 / 100) * 650000000 + ((((year * 14.5) / 100) * 35) / 100) * 650000000;
  console.log("stock of A company:", stockA);
  const stockB =
    ((100 - 30 - 35) / 100) * 650000000 +
    ((((year * 12.5) / 100) * (100 - 30 - 35)) / 100) * 650000000;
  console.log("stock of B company:", stockB);

  return console.log(
    "money after 2 years:",
    deposit + obligation + stockA + stockB
  );
}

calculateAndShowMoney(2);
