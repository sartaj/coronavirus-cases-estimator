import { Card, List, Typography } from "antd";
import "antd/dist/antd.css";
import * as React from "react";
import { render } from "react-dom";
import { data, estimator } from "./calculator";
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

const App = () => {
  const estimatedTotalCases = estimator("Iceland", data);

  return (
    <div>
      <div
        style={{
          textAlign: "left",
          minHeight: "50vh",
          marginBottom: "2rem",
          padding: "10rem",
        }}
        className="header-text"
      >
        <Typography.Title level={2}style={{ textAlign: "center" }}>
          Getting a Better Estimate on Total Coronvirus Cases
        </Typography.Title>
        <Typography.Title level={1}>
          Coronavirus Disease (COVID-19) test data has proven to be highly
          unreliable.
        </Typography.Title>
        <Typography.Paragraph style={{fontSize: '24px'}}>
          Despite mounting evidence that the majority of positive cases are asymptomatic, countries like the United States only have the capacity to test patients who are showing major symptoms.
          This means, total cases data, and any data deriving from tit, including mortality rate and infectiousness, are unreliable.
        </Typography.Paragraph>
        <Typography.Title level={3}>
          We can do better. Iceland did better.
        </Typography.Title>
        <Typography.Paragraph style={{ fontSize: "16px" }}>
          Since March 14, Iceland, with the assistance of has beeen screening healthy as well as sick people, giving a far more accurate
          picture of COVID-19. In fact, currently Iceland has the highest tests per million of any major nation.
        </Typography.Paragraph>
        <Typography.Paragraph style={{ fontSize: "16px" }}>
          Their results have been stunning, showing that over half of COVID-19 patients show no symptoms.
        </Typography.Paragraph>
        <Typography.Paragraph style={{ fontSize: "16px" }}>
          What this means is, sure, while the infection rate is much lower, the infenction rate is signficantly higher than any current reported statistics are showing.
        </Typography.Paragraph>
        <Typography.Paragraph style={{ fontSize: "16px" }}>
          What if we used Iceland's data to provide predictions on potential infenction rate in other countries?
        </Typography.Paragraph>
        <Typography.Title level={3}>
          Methodology
        </Typography.Title>
        <Typography.Paragraph style={{ fontSize: "16px" }}>
          The following shows current data of reported total cases in the world, compared to Icelands total cases. The way we do is by looking at 2 statistics that have a high reliabilty rate: the total death count and ICU count. While things like hospitalization rate could be influenced by panic, and infection rate is muddled by the lack of randomized testing, ICU counts and Death counts are done by doctors based on proven medical issues.
        </Typography.Paragraph>
        <Typography.Title level={3}>
          Limitations
        </Typography.Title>
        <Typography.Paragraph style={{ fontSize: "16px" }}>
          The following shows current data of reported total cases in the world, compared to Icelands total cases. The way we do is by looking at 2 statistics that have a high reliabilty rate: the total death count and ICU count. While things like hospitalization rate could be influenced by panic, and infection rate is muddled by the lack of randomized testing, ICU counts and Death counts are done by doctors based on proven medical issues.
        </Typography.Paragraph>

      </div>
      <div className="content">
        <div className="country-card-container">
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
        </div>
      </div>
    </div>
  );
};

render(<App />, document.getElementById("app"));
