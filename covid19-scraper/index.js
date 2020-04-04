"use strict";

const handler = async (event, context, callback) => {
  var webdriver = require("selenium-webdriver");
  var chrome = require("selenium-webdriver/chrome");
  let chromedriver = require("chromedriver");

  function setUp() {
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
    const driver = setUp();

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

    const table = await driver.findElement(
      webdriver.By.xpath('//*[@id="main_table_countries_today"]/tbody[1]')
    );

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

    driver.quit();

    return countriesData
  }

  const countriesData = await run()

  const fs = require("fs");
  const path = require("path");
  fs.writeFileSync(
    path.join(__dirname, "../", "data.json"),
    JSON.stringify(countriesData, null, 2)
  );

};

handler();
