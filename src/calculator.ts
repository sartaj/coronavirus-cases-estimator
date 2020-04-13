import { DataJson, Data } from "./types";

const dataJson: DataJson = require("./data.json");
const dataWithHeaders = dataJson.countriesData;
const totalDeathsIndex = dataWithHeaders[0].indexOf("totalDeaths");
const totalCasesIndex = dataWithHeaders[0].indexOf("totalCases");
const countryNameIndex = 0;

export const lastUpdated = dataJson.lastUpdated;

const MINIMIM_DEATH_THRESHOLD = 50;

export const data = dataWithHeaders.slice(1) as Data[];

export const calculateOffOfReliableData = (
  comparisonCountryTotalCases,
  comparisonCountryTotalDeaths,
  reportedTotalDeaths
) => {
  // ignore data sets that have less deaths than the most reliable death data
  if (reportedTotalDeaths < MINIMIM_DEATH_THRESHOLD) return null;

  /*
        reportedTotalDeaths               comparisonCountryTotalDeaths
          ---------                 =           --------------
              x                            comparisonCountryTotalCases
  */

  const estimatedTotalCasesData =
    (reportedTotalDeaths * comparisonCountryTotalCases) /
    comparisonCountryTotalDeaths;

  const rounded = Math.round(estimatedTotalCasesData);

  return rounded;
};

interface EstimatedTotalCasesData {
  countryName: string;
  reportedTotalDeaths: number;
  reportedTotalCases: number;
  estimatedTotalCases: string;
}

export const estimator = (
  countriesToCompare: string[],
  data: Data[]
): EstimatedTotalCasesData[] => {
  const dataToCompare = countriesToCompare.map((countryName) => {
    const country = data.find((country) => country[0] === countryName);

    const totalDeaths = country[totalDeathsIndex];
    const totalCases = country[totalCasesIndex];
    return { totalDeaths, totalCases };
  });

  const dataWithEstimatedTotals = data
    .map((row) => {
      const countryName = row[countryNameIndex] as string;
      const reportedTotalDeaths = row[totalDeathsIndex] as number;
      const reportedTotalCases = row[totalCasesIndex] as number;

      // ignore countries being compared
      if (countriesToCompare.includes(countryName)) {
        return {
          countryName,
          reportedTotalDeaths,
          reportedTotalCases,
          estimatedTotalCases: "N/A",
        };
      }

      const comparisons = dataToCompare.map((comparisonCountry) =>
        calculateOffOfReliableData(
          comparisonCountry.totalCases,
          comparisonCountry.totalDeaths,
          reportedTotalDeaths
        )
      );

      const estimatedTotalCases = `${Math.min(...comparisons)} - ${Math.max(
        ...comparisons
      )}`;

      return {
        countryName,
        reportedTotalDeaths,
        reportedTotalCases,
        estimatedTotalCases,
      };
    })
    .filter(
      ({ reportedTotalDeaths, countryName }) =>
        countriesToCompare.includes(countryName) ||
        reportedTotalDeaths > MINIMIM_DEATH_THRESHOLD
    );

  return dataWithEstimatedTotals;
};

export const countriesToCompare = ["Iceland", "Germany", "S. Korea"];

export const estimatedTotalCasesData = estimator(countriesToCompare, data);
