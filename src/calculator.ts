import * as ds from "./data.json";
import * as ad from "./age-distribution.json";

import { Data, DataJson, AgeDistributionJson } from "./types";

const dataJson = ds as DataJson;
const ageDistributionJson = ad as AgeDistributionJson;
const dataWithHeaders = dataJson.countriesData;
const totalDeathsIndex = dataWithHeaders[0].indexOf("totalDeaths");
const totalCasesIndex = dataWithHeaders[0].indexOf("totalCases");
const countryNameIndex = 0;

// https://www.businessinsider.com/coronavirus-in-charts-covid-19-symptoms-spread-deaths-warnings-2020-2#overall-the-coronavirus-is-far-more-deadly-than-the-flu-19
const SeniorDeathRates = 10.4 + 4.3 + 2.7;
const MidDeathRates = 1.4 + 0.5 + 0.1;
const TotalDeathRates = SeniorDeathRates + MidDeathRates;
const SeniorTotalDeathRates = SeniorDeathRates / TotalDeathRates;
const MidTotalDeathRates = MidDeathRates / TotalDeathRates;
console.log(SeniorTotalDeathRates, MidTotalDeathRates);
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

    /*
        reportedTotalDeaths               countryAgeDistribution
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
