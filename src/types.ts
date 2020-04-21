export type Headers = [
  "countryName",
  "totalCases",
  "newCases",
  "totalDeaths",
  "newDeaths",
  "totalRecovered",
  "activeCases",
  "seriousCritical",
  "totalCasesPerMil",
  "totalDeathsPerMil",
  "totalTests",
  "totalTestsPerMil"
];

export type Data = [
  string,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];

export type CountriesData = [Headers, ...Array<Data>];

export type DataJson = {
  lastUpdated: string;
  countriesData: CountriesData;
};

export type AgeDistributionHeaders = ["Country", "0-14", "15-64", "65+"];
export type AgeData = [string, number, number, number];
export type AgeDistributionJson = [AgeDistributionHeaders, ...Array<AgeData>];
