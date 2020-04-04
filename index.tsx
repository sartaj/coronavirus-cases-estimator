import * as React from "react";
import { render } from "react-dom";
import { estimator, data } from "./calculator";
import { Card, Typography, Row, Col, Space, List } from "antd";

import "./index.css";
import "antd/dist/antd.css";

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
    //   className="content"
        style={{
            textAlign: 'left',
          minHeight: "50vh",
          marginBottom: "2rem",
          backgroundColor: "#fff",
          padding: "10rem",
        //   boxShadow: "0 2px 5px rgba(0,0,0,0.6)",
        }}
      >
        <Typography.Title style={{ color: "black", textAlign: "center" }}>
          Getting a Better Estimate on Total Coronvirus Cases
        </Typography.Title>
        <Typography.Paragraph style={{ color: "black", fontSize: "16px" }}>
          Coronavirus Disease (COVID-19) data around the world has been highly
          unreliable.
          <List
            dataSource={[
              "In the United States, only cases with noticable symptoms are being tested, and even then, getting tests has been very difficult.",
            ]}
            renderItem={(i) => (
              <List.Item style={{ color: "black" }}>{i}</List.Item>
            )}
          />
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
