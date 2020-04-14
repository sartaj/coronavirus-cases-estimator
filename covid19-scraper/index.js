"use strict";

const webdriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const chromedriver = require("chromedriver");

function setUpSelenium(flags = []) {
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
    ...flags,
  ];

  // chromeOptions.setChromeBinaryPath("/var/task/lib/chrome");
  chromeOptions.addArguments(defaultChromeFlags);
  builder
    .withCapabilities(webdriver.Capabilities.chrome())
    .setChromeOptions(chromeOptions);

  var driver = builder.build();
  return driver;
}

const scrapeWorldometersCoronavirusTable = async () => {
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
    await driver.quit();
    await chromedriver.stop();

    return countriesData;
  }
  return await run();
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
    lastUpdated: new Date().toISOString().split("T")[0], // format: `2020-04-05`
    countriesData,
  };
  fs.writeFileSync(
    path.join(__dirname, "../src", "data.json"),
    JSON.stringify(data, null, 2)
  );
}

const runScraper = async () => {
  const countriesData = await scrapeWorldometersCoronavirusTable();
  validateCountriesData(countriesData);
  writeDataToWebsiteSource(countriesData);
  console.log("scraping complete.");
};

const checkIfPortRunning = (port) => {
  const detect = require("detect-port");
  return new Promise((resolve, reject) => {
    detect(port, (err, _port) => {
      if (err) {
        reject(err);
      }

      if (port == _port) {
        console.log(`dev server not running.`);
        resolve(false);
      } else {
        console.log(`dev server running`);
        resolve(true);
      }
    });
  });
};
const scrapeSocialMediaImageMaker = async () => {
  const devServerRunning = await checkIfPortRunning(1234);
  if (!devServerRunning) {
    console.log("skipping image creation");
    return false;
  }

  const driver = setUpSelenium(["--window-size=1200,930"]);

  console.log("opening localhost...");
  driver.get("http://localhost:1234/");

  const hero = await driver.findElement(
    webdriver.By.xpath('//*[@class="hero-container"]')
  );

  console.log("taking screenshot...");
  await hero.takeScreenshot().then((image, err) => {
    require("fs").writeFile(
      require("path").join(
        __dirname,
        "../src/united-states-total-potential-coronavirus-cases.png"
      ),
      image,
      "base64",
      function (err) {
        console.log(err);
      }
    );
  });

  await driver.quit();
  await chromedriver.stop();

  return true;
};

const handler = async () => {
  await runScraper();
  await scrapeSocialMediaImageMaker();
};

handler();
