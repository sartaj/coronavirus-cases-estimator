const dataWithHeaders = require("./data.json");
const totalDeathsIndex = dataWithHeaders[0].indexOf("totalDeaths");
const totalCasesIndex = dataWithHeaders[0].indexOf("totalCases");
const countryNameIndex = 0;

const MINIMIM_DEATH_THRESHOLD = 4

export const data = dataWithHeaders.slice(1)

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

interface Estimator {
  countryName: string;
  reportedTotalDeaths: number;
  reportedTotalCases: number;
  estimatedTotalCasesBasedOnIceland: number;
}

export const estimator = (mostReliableTestData, data): Estimator[] => {
  const mostReliable = data.find(
    (country) => country[0] === mostReliableTestData
  );

  const mostReliableDeathData = mostReliable[totalDeathsIndex];
  const mostReliableTotalCasesData = mostReliable[totalCasesIndex];

  const dataWithEstimatedTotals = data
    .map((row) => {
      const countryName = row[countryNameIndex];
      const reportedTotalDeaths = row[totalDeathsIndex];
      const reportedTotalCases = row[totalCasesIndex];

      const estimatedTotalCasesBasedOnIceland = calculateOffOfReliableData(
        mostReliableTotalCasesData,
        mostReliableDeathData,
        reportedTotalDeaths
      );

      return {
        countryName,
        reportedTotalDeaths,
        reportedTotalCases,
        estimatedTotalCasesBasedOnIceland,
      };
    })
    .filter(({ reportedTotalDeaths }) => reportedTotalDeaths > MINIMIM_DEATH_THRESHOLD);

  return dataWithEstimatedTotals;
};