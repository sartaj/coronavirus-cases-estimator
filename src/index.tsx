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
    <Typography.Text>
      Despite{" "}
      <a href="https://www.statnews.com/2020/03/17/a-fiasco-in-the-making-as-the-coronavirus-pandemic-takes-hold-we-are-making-decisions-without-reliable-data/">
        mounting evidence
      </a>{" "}
      that the majority of positive cases are asymptomatic, countries like the
      United States only have the capacity to test patients who are showing
      major symptoms. This means, total cases data, and any data deriving from
      tit, including mortality rate and infectiousness, are unreliable.
    </Typography.Text>
    <Typography.Title level={3}>
      Iceland did better. We can do (slightly) better.
    </Typography.Title>
    <Typography.Paragraph style={{ fontSize: "16px" }}>
      Since March 14, the Goverment of Iceland been screening healthy as well as
      sick people,{" "}
      <a href="https://www.covid.is/data">
        giving a far more accurate picture of COVID-19
      </a>
      . In fact, currently Iceland has <a href="https://www.worldometers.info/coronavirus/">the highest tests per million of any
      major nation.</a>{" "}
      <strong>
        This mean's Iceland's data is the closest the world currently has to a
        more complete picture of coronavirus test cases.
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
      What this means is, sure, while the death rate is much lower, the
      infection rate is still significantly higher than any current reported
      statistics are showing.
    </Typography.Paragraph>
    <Typography.Paragraph
      style={{ fontSize: "24px", fontStyle: "italic", margin: "2rem" }}
    >
      So what if we used Iceland's data to estimate the actual total cases in other countries?
    </Typography.Paragraph>
    <Typography.Title level={3}>Methodology</Typography.Title>
    <Typography.Paragraph style={{ fontSize: "16px" }}>
      The following shows current data of reported total cases in the world,
      compared to Icelands total cases. The way we do is by looking at 2
      statistics that have a high reliability rate: the total death count. While
      things like hospitalization rate could be influenced by panic, and
      infection rate is muddled by the lack of randomized testing, statistics
      like ICU counts and death counts are done by doctors based on proven
      medical issues.
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
          <strong>SHOULD NOT be quoted as exact numbers</strong>, as the
          variance can be a lot as Iceland, and the rest of the world, continue
          to update their dataset.
        </li>
        <li>
          Death rates vary widely by country, based on things like population
          age. So this data over time would probably be more indicative of
          countries with similar{" "}
          <a href="https://www.indexmundi.com/iceland/demographics_profile.html">
            age distributions
          </a>{" "}
          to Iceland.
        </li>
        <li>
          Iceland currently has a low death count. As it inceases, the variance
          on this data should decrease.
        </li>
      </ul>
    </Typography.Paragraph>
    <Typography.Title level={3}>The Bottom Line</Typography.Title>
    <Typography.Paragraph style={{ fontSize: "16px" }}>
      These figures should help us understand better the severity of the
      infection rate of coronavirus, as even with wide variances in estimates,
      all the variances are at least 5x-20x larger than the current reported
      tests cases in countries like the United States, meaning everything from
      death rate to hospitalization rates are completely unreliable.
    </Typography.Paragraph>
    <Typography.Title level={3}>Help Improve the Estimates</Typography.Title>
    <Typography.Paragraph style={{ fontSize: "16px" }}>
      As Iceland gets to testing the majority of their population, these
      estimates should improve over time. Also, it would be good to add more
      parameters of hard data, such as ICU admittance stats, and also
      normalizing for different nations based on age distribution. <br /><br />
      Want to help? Check out the{" "}
      <a href="http://sartaj.me/coronavirus-cases-estimator/">
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
