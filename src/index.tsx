import { Card, List, Typography } from "antd";
import "antd/dist/antd.css";
import * as React from "react";
import { render } from "react-dom";
import { data, estimator, lastUpdated } from "./calculator";
import "./index.css";

function camel2title(camelCase) {
  // no side-effects
  return (
    camelCase
      // inject space before the upper case letters
      .replace(/([A-Z])/g, function (match) {
        return " " + match;
      })
      // replace first char with upper case
      .replace(/^./, function (match) {
        return match.toUpperCase();
      })
  );
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const Article = () => (
  <article>
    <Typography.Title level={3}>
      Coronavirus Disease (COVID-19) test data has proven to be highly
      unreliable.
    </Typography.Title>
    <Typography.Paragraph style={{ fontSize: "16px" }}>
      Despite{" "}
      <a href="https://www.statnews.com/2020/03/17/a-fiasco-in-the-making-as-the-coronavirus-pandemic-takes-hold-we-are-making-decisions-without-reliable-data/">
        mounting evidence
      </a>{" "}
      that the majority of positive cases are asymptomatic, countries like the
      United States are still only testing patients who show
      major symptoms. This means collected data on total cases or any insights derived from
      that data, including mortality rate, are unreliable.
    </Typography.Paragraph>
    <Typography.Title level={3}>
      Iceland did better. We can do (slightly) better.
    </Typography.Title>
    <Typography.Paragraph style={{ fontSize: "16px" }}>
      Since March 14, Iceland's National Government has been strategically screening
      both sick and healthy people,{" "}
      <a href="https://www.covid.is/data">
        providing a far more accurate picture of COVID-19
      </a>
      . In fact, Iceland currently leads in <a href="https://www.worldometers.info/coronavirus/">the highest tests per million of any
      major nation.</a><br /><br />
      <strong>
        With a high testing rate and strategic selection of those tested, Iceland's data plays a key role in the global understanding of
        this pandemic and the accuracy of tests.
      </strong>
    </Typography.Paragraph>
    <Typography.Paragraph style={{ fontSize: "16px" }}>
      Their results have been stunning, with Iceland's head epidemiologist
      telling BuzzFeed that{" "}
      <a href="https://www.buzzfeed.com/albertonardelli/coronavirus-testing-iceland">
        over half of COVID-19 patients show no symptoms.
      </a>
    </Typography.Paragraph>
    <Typography.Paragraph style={{ fontSize: "16px" }}>
      While the death rate is much lower, this means that the
      infection rate is significantly higher than current reported
      figures.
    </Typography.Paragraph>
    <Typography.Paragraph
      style={{ fontSize: "24px", fontStyle: "italic", margin: "2rem" }}
    >
      So how can we use Iceland's data to better estimate the true total cases in other countries?
    </Typography.Paragraph>
    <Typography.Title level={3}>Methodology</Typography.Title>
    <Typography.Paragraph style={{ fontSize: "16px" }}>
      The following shows data comparing total reported deaths in the world
      and Iceland's total reported cases and deaths.  Statistics like ICU counts and death counts are highly reliable. 
      Using these death counts with Iceland's reported infection rate, we can
      derive a closer estimation of the true infection rate (x) in each country.
      <br />
      <img
        src={require("./equation.gif")}
        style={{
          marginTop: "2rem",
          textAlign: "center",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      />
    </Typography.Paragraph>
    <Typography.Title level={3}>Limitations</Typography.Title>
    <Typography.Paragraph style={{ fontSize: "16px" }}>
      <ul>
        <li>
          The numbers here{" "}
          <strong>SHOULD NOT be quoted as exact numbers</strong>, for many reasons:  We not only have lagging data
          updated at different points in time, but Iceland's population is unique from many other countries' in size, age, and even lifestyle.
          The goal of using Iceland's reported infection rate is to get a better sense of the vast number of infected people that are difficult to identify.
        </li>
        <li>
          Death rates can vary widely by country, based on factors such as population size & age, time of first confirmed case, government measures, etc.
          So this data over time will likely have less variance when applied to
          countries with similar{" "}
          <a href="https://www.indexmundi.com/iceland/demographics_profile.html">
            age distributions
          </a>{" "}
          to that of Iceland.
        </li>
      </ul>
    </Typography.Paragraph>
    <Typography.Title level={3}>The Bottom Line</Typography.Title>
    <Typography.Paragraph style={{ fontSize: "16px" }}>
      These figures can provide a better depiction of how much more severe the
      COVID-19 infection rate is than what is reported. Although these estimates include high variance, the disparity between
      the total reported cases and the estimated number of cases is largely due to lack and inaccuracy of testing practices. 
      All estimates are at least 5x-20x larger than the total reported cases, meaning
      death rates and hospitalization rates are innaccurate and incredibly conservative.
    </Typography.Paragraph>
    <Typography.Title level={3}>Help Improve the Estimates</Typography.Title>
    <Typography.Paragraph style={{ fontSize: "16px" }}>
      As Iceland approaches completing tests for the majority of their population, these
      estimates should also improve. Adding more
      considerations to the model such as ICU admittance stats and
      normalizing for different nations based on age distribution will also improve results. <br /><br />
      Want to help? Check out the{" "}
      <a href="http://github.com/sartaj/coronavirus-cases-estimator/">
        source code on GitHub
      </a>
      , or feel free to{" "}
      <a href="https://twitter.com/sartaj">discuss on Twitter</a>.
    </Typography.Paragraph>
  </article>
);

const Data = () => {
  const estimatedTotalCases = estimator("Iceland", data);
  return (
    <List
      itemLayout="vertical"
      dataSource={estimatedTotalCases}
      renderItem={(d) => (
        <List.Item style={{ borderBottom: 0 }}>
          <Typography.Title level={3}>{d.countryName}</Typography.Title>
          <List
            dataSource={Object.entries(d).slice(1)}
            grid={{ gutter: 16, column: 4 }}
            renderItem={([key, value]) => (
              <Card size="small">
                <Typography.Title level={4} style={{ letterSpacing: 0 }}>
                  {numberWithCommas(value)}
                </Typography.Title>
                <Typography.Paragraph style={{ marginBottom: 0 }}>
                  {camel2title(key)}
                </Typography.Paragraph>
              </Card>
            )}
          />
        </List.Item>
      )}
    />
  );
};

const App = () => {
  return (
    <div>
      <div className="header-text">
        <Typography.Title level={1} style={{ textAlign: "center" }}>
          Getting a Better Estimate on Total Coronavirus Cases
        </Typography.Title>
        <Article />
      </div>
      <div className="content">
        <div className="country-card-container">
          <Typography.Paragraph>
            <br />
            Source For Reported Data:&nbsp;
            <a href="https://www.worldometers.info/coronavirus/">
              Worldometers Coronavirus
            </a>
            <br />
            Data Last Updated: {lastUpdated}
          </Typography.Paragraph>
          <Data />
        </div>
      </div>
    </div>
  );
};

render(<App />, document.getElementById("app"));
