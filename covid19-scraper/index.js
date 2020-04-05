"use strict";

const scrapeWorldometersCoronavirusTable = async () => {
  const webdriver = require("selenium-webdriver");
  const chrome = require("selenium-webdriver/chrome");
  const chromedriver = require("chromedriver");

  function setUpSelenium() {
    console.log("setting up selenium...");
    chrome.setDefaultService(
      new chrome.ServiceBuilder(chromedriver.path).build()
    );
    var builder = new webdriver.Builder().forBrowser("chrome");
    var chromeOptions = new chrome.Options();
    const defaultChromeFlags = [
      "--headless",
      "--disable-gpu",
      "--no-sandbox",
      "--user-data-dir=/tmp/user-data",
      "--hide-scrollbars",
      "--enable-logging",
      "--log-level=0",
      "--v=99",
      "--single-process",
      "--data-path=/tmp/data-path",
      "--ignore-certificate-errors",
      "--homedir=/tmp",
      "--disk-cache-dir=/tmp/cache-dir",
    ];

    // chromeOptions.setChromeBinaryPath("/var/task/lib/chrome");
    chromeOptions.addArguments(defaultChromeFlags);
    builder
      .withCapabilities(webdriver.Capabilities.chrome())
      .setChromeOptions(chromeOptions);

    var driver = builder.build();
    return driver;
  }

  async function run() {
    const driver = setUpSelenium();

    console.log("getting worldometer's site...");
    driver.get("https://www.worldometers.info/coronavirus/");

    const headers = [
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
      "totalTestsPerMil",
    ];

    const amountOfRows = 170;
    const amountOfCells = 13;

    let countriesData = [headers];

    console.log("searching for coronavirus table...");
    const table = await driver.findElement(
      webdriver.By.xpath('//*[@id="main_table_countries_today"]/tbody[1]')
    );

    console.log("scraping table...");
    // Loop through the table
    for (let x = 1; x < amountOfRows; x++) {
      let countryInfo = [];
      for (let y = 1; y < amountOfCells; y++) {
        const cell = await table.findElement(
          webdriver.By.xpath(`//tr[${x}]/td[${y}]`)
        );
        const cellT = await cell.getText();

        // parse strings to numbers or null if missing, except for first item (country name)
        const parsed =
          y > 1 ? (cellT ? parseFloat(cellT.replace(/,/g, "")) : null) : cellT;
        countryInfo.push(parsed);
      }
      countriesData.push(countryInfo);
    }

    console.log("scraping complete...");
    driver.quit();

    return countriesData;
  }
  return await run()
};

function validateCountriesData(countriesData = []) {
  console.log("validating data...");
  const worldData = countriesData.find((e) => e[0] === "World");
  if (worldData[1] < 1000000)
    throw new Error(
      "scraped data failed. test to see if world test data is more than a million failed. see source code."
    );
}

function writeDataToWebsiteSource(countriesData) {
  console.log("writing data to src/data.json...");
  const fs = require("fs");
  const path = require("path");
  const data = {
    lastUpdated: new Date().toISOString().split('T')[0], // format: `2020-04-05`
    countriesData,
  };
  fs.writeFileSync(
    path.join(__dirname, "../src", "data.json"),
    JSON.stringify(data, null, 2)
  );
}

const handler = async () => {
  const countriesData = await scrapeWorldometersCoronavirusTable();
  validateCountriesData(countriesData);
  writeDataToWebsiteSource(countriesData);
  console.log('scraping complete.')
};

handler();
