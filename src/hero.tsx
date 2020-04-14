import "antd/es/card/style/css";
import "antd/es/list/style/css";
import "antd/es/typography/style/css";
import "particles.js";
import * as React from "react";
import {
  countriesToCompare,
  estimatedTotalCasesData,
  lastUpdated,
} from "./calculator";
import "./index.css";

declare let particlesJS: any; // Required to be properly interpreted by TypeScript.

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

const getCountryNaturalName = (countryName: string) => {
  switch (countryName) {
    case "USA":
      return "The United States";
    case "S. Korea":
      return "South Korea";
    default:
      return countryName;
  }
};

export const CountryHero = () => {
  const country = estimatedTotalCasesData.find(
    ({ countryName }) => countryName === "USA"
  );

  React.useEffect(() => {
    /* ---- particles.js config ---- */
    //  @ts-ignore
    window.particlesJS("particles-js", {
      particles: {
        number: {
          value: 380,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: "#ffffff",
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000",
          },
          polygon: {
            nb_sides: 5,
          },
        },
        opacity: {
          value: 0.5,
          random: false,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.1,
            sync: false,
          },
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
            sync: false,
          },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#ffffff",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "grab",
          },
          onclick: {
            enable: true,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 1,
            },
          },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
          push: {
            particles_nb: 4,
          },
          remove: {
            particles_nb: 2,
          },
        },
      },
      retina_detect: true,
    });
  }, []);

  return (
    <div className="hero-container">
      <div id="particles-js"></div>
      <div className="hero-text">
        <link
          href="https://fonts.googleapis.com/css2?family=Zilla+Slab+Highlight:wght@400;700&display=swap"
          rel="stylesheet"
        />

        <div className="hero-div">
          <div className="hero-div-flex">
            <p
              style={{
                maxWidth: "1028px",
                fontFamily: "'Zilla Slab Highlight', sans-serif",
                fontWeight: 300,
                fontSize: "3rem",
                textAlign: "left",
                color: "white",
                paddingTop: "3rem", // to account for last updated text
              }}
            >
              {getCountryNaturalName(country.countryName)} reports{" "}
              <span style={{ fontWeight: 800 }}>
                {numberWithCommas(country.reportedTotalCases)}
              </span>{" "}
              cases of COVID-19. It's probably closer to
              <br />
              <span style={{ fontWeight: 800 }}>
                {numberWithCommas(country.estimatedTotalCases)}
              </span>
              .
              <p
                style={{
                  marginTop: 0,
                  paddingTop: 0,
                  fontSize: "16px",
                  fontFamily: "sans-serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                Last updated {lastUpdated}. Based on data from{" "}
                {countriesToCompare.map(getCountryNaturalName).join(", ")}.
              </p>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
