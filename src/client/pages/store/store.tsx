import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { Badge, Card, Col, ProgressBar, Row, Tab, Tabs } from "react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

import StickyMenu from "../../components/sticky-menu";
import Loading from "../../components/loading";
import { options } from "./options";
import { data } from "./data";
import { TrafficData, TiktokData } from "./interface";
import { Swiper, SwiperSlide } from "swiper/react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Filler,
  Legend,
);

const Store: React.FC = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const name: string | null = queryParams.get("q");

  let isNameInTrackedList = false;

  if (name !== null) {
    const trackedList = localStorage.getItem("trackedStores");

    if (trackedList) {
      const objects: Array<{ storeLink: string }> = JSON.parse(trackedList);
      const storeLinks: string[] = objects.map(
        (obj: { storeLink: string }) => obj.storeLink,
      );
      isNameInTrackedList = storeLinks.includes(name);
    }
  }

  const [loading, setLoading] = useState(true);
const [trafficData, setTrafficData] = useState<TrafficData | null>(null);
const [tiktokData, setTiktokData] = useState<TiktokData | null>(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      if (name) {
        const response = await fetch(
          `https://spyshark-io.azurewebsites.net/api/traffic/${name}`,
        );

        if (response.ok) {
          const data = await response.json();
          setTrafficData(data);
          console.log(data)
        }
      }
    } catch (error) {
      // Handle error if necessary
    }
  };

  const fetchTiktokData = async () => {
    try {
      if (name) {
        const response = await fetch(
          `https://spyshark-io.azurewebsites.net/api/tiktok/${name}`,
        );

        if (response.ok) {
          const data = await response.json();
          setTiktokData(data);
          console.log(data)
        }
      }
    } catch (error) {
      // Handle error if necessary
    }
  };

  // Use Promise.all to ensure both data fetches are complete before setting loading to false
  Promise.all([fetchData(), fetchTiktokData()]).then(() => {
    setLoading(false);
  });
}, [name]);


  const traffic_labels = trafficData?.monthly_visitors.map((item) => item.date);
  const traffic = {
    labels: traffic_labels,
    datasets: [
      {
        fill: true,
        label: "Visitors",
        data: trafficData?.monthly_visitors.map((item) => item.value),
        borderColor: "rgb(40,100,252)",
        backgroundColor: "rgba(40,100,252,0.5)",
        lineTension: 0.3,
      },
    ],
  };

  if (loading) {
    return <Loading />;
  }

  if (!isNameInTrackedList) {
    return (
      <>
        <div id="no-store-message">NO STORE IN TRACKED LIST</div>
      </>
    );
  }

  return (
    <>
      <Row>
        <Col>
          <div className="grid-item">
            <div className="breadcrumb">
              <Link to="/">Dashboard</Link>
              <i className="fa-solid fa-chevron-right"></i>
              <Link to="/sales-tracker">Sales Tracker</Link>
              <i className="fa-solid fa-chevron-right"></i>
              <Link to={`/store?q=${name}`}>Store</Link>
            </div>
          </div>
        </Col>
      </Row>
      <section id="informations">
        <Row>
          <Col>
            <div className="grid-item">
            <img className="store-logo" src={trafficData?.logo || `../img/store.svg`} />

  
                    <div className="rich-text">
                      <p className="subtitle">Name</p>
                      <h1>{trafficData?.sitename}</h1>
                      <p className="subtitle">Description</p>
                      <p>{trafficData?.description}</p>
                      <a className="social-icon" href="https://instagram.com">
                        <i className="fa-brands fa-instagram"></i>
                      </a>
                      <a className="social-icon" href="https://instagram.com">
                        <i className="fa-brands fa-facebook"></i>
                      </a>
                      <a className="social-icon" href="https://instagram.com">
                        <i className="fa-brands fa-youtube"></i>
                      </a>
                      <a className="social-icon" href="https://instagram.com">
                        <i className="fa-brands fa-pinterest"></i>
                      </a>
                    </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={6} md={3} lg={2}>
            <div className="grid-item">
              <Card className="bg-color-primary-500 color-neutral-100">
                <Row>
                  <div className="rich-text text-align-between">
                    <h6>Visitors</h6>
                    <Badge>
                      {trafficData?.percentage_increase !== undefined ? (
                        <>
                          {Math.abs(trafficData.percentage_increase)}%
                          {trafficData.percentage_increase > 0 && (
                            <i className="fas fa-arrow-up"></i>
                          )}
                          {trafficData.percentage_increase < 0 && (
                            <i className="fas fa-arrow-down"></i>
                          )}
                        </>
                      ) : (
                        "0%"
                      )}
                    </Badge>
                  </div>
                </Row>
                <Row>
                  <div className="rich-text">
                    <h3>
                      {trafficData?.monthly_visitors[2].value.toLocaleString()}
                    </h3>
                  </div>
                </Row>
              </Card>
            </div>
          </Col>
          <Col xs={6} md={3} lg={2}>
            <div className="grid-item">
              <Card>
                <Row>
                  <Col>
                    <div className="rich-text">
                      <h6>Sales</h6>
                      <h3>54 000$</h3>
                    </div>
                  </Col>
                </Row>
              </Card>
            </div>
          </Col>
          <Col xs={6} md={3} lg={2}>
            <div className="grid-item">
              <Card>
                <Row>
                  <Col>
                    <div className="rich-text">
                      <h6>TBD</h6>
                      <h3>TBD</h3>
                    </div>
                  </Col>
                </Row>
              </Card>
            </div>
          </Col>
          <Col xs={6} md={3} lg={2}>
            <div className="grid-item">
              <Card>
                <Row>
                  <Col>
                    <div className="rich-text">
                      <h6>TBD</h6>
                      <h3>TBD</h3>
                    </div>
                  </Col>
                </Row>
              </Card>
            </div>
          </Col>
        </Row>
      </section>
      <section id="revenue">
        <Row>
          <Col>
            <div className="grid-item">
              <Card className="bg-color-transparent">
                <div className="rich-text">
                  <h1>Total Revenue</h1>
                </div>
              </Card>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12} lg={12}>
            <div className="grid-item">
              <Card>
                <Tabs defaultActiveKey="7-days">
                  <Tab eventKey="90-days" title="90 Days">
                    <Line options={options} data={data} />
                  </Tab>
                  <Tab eventKey="30-days" title="30 Days">
                    <Line options={options} data={data} />
                  </Tab>
                  <Tab eventKey="7-days" title="7 Days">
                    <Line options={options} data={data} />
                  </Tab>
                </Tabs>
              </Card>
            </div>
          </Col>
        </Row>
      </section>
      {trafficData &&
      trafficData.top_countries &&
      trafficData.top_countries.length > 0 ? (
        <section id="traffic">
          <Row>
            <Col>
              <div className="grid-item">
                <Card className="bg-color-transparent">
                  <div className="rich-text">
                    <h1>Traffic</h1>
                  </div>
                </Card>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={12} lg={4}>
              <div className="grid-item">
                <Card>
                  <Row>
                    <Col>
                      <div className="rich-text">
                        <h2>Total visitors</h2>
                      </div>
                      <Line options={options} data={traffic} />
                    </Col>
                  </Row>
                </Card>
              </div>
            </Col>
            <Col xs={12} md={6} lg={4}>
              <div className="grid-item">
                <Card>
                  <Row>
                    <Col>
                      <div className="rich-text">
                        <h2>Traffic source</h2>
                      </div>
                      <table id="traffic-source">
                        {trafficData?.traffic_sources.map((traffic) => (
                          <tr key={traffic.source}>
                            <td id="traffic-icon">
                              <img src={`../img/traffic/${traffic.handler}.svg`} />
                            </td>
                            <td>
                              <div className="rich-text text-align-between">
                                <p className="subtitle">{traffic.source}</p>
                                <p>{traffic.value}%</p>
                              </div>
                              <ProgressBar now={traffic.value} />
                            </td>
                          </tr>
                        ))}
                      </table>
                    </Col>
                  </Row>
                </Card>
              </div>
            </Col>
            <Col xs={12} md={6} lg={4}>
              <div className="grid-item">
                <Card>
                  <Row>
                    <Col>
                      <div className="rich-text">
                        <h2>Top countries</h2>
                      </div>
                      <table id="top-country-traffic">
                        {trafficData?.top_countries.map((country) => (
                          <tr key={country.CountryCode}>
                            <td id="country-icon">
                              <img
                                src={`https://cdn.kcak11.com/CountryFlags/countries/${country.CountryCode.toLowerCase()}.svg`}
                                alt={`${country.Country} flag`}
                              />
                            </td>
                            <td>
                              <div className="rich-text text-align-between">
                                <p className="subtitle">{country.Country}</p>
                                <p>{country.value}%</p>
                              </div>
                              <ProgressBar now={country.value} />
                            </td>
                          </tr>
                        ))}
                      </table>
                    </Col>
                  </Row>
                </Card>
              </div>
            </Col>
          </Row>
        </section>
      ) : null}
      {tiktokData && tiktokData.url && tiktokData.tiktok.length > 0 ? (
        <section id="tikok-marketing">
          <Row>
            <Col>
              <div className="grid-item">
                <Card className="bg-color-transparent">
                  <div className="rich-text">
                    <h1>Tiktok marketing</h1>
                  </div>
                </Card>
              </div>
            </Col>
          </Row>
          <Row>
            <div className="grid-item">
                <img className="tiktok-avatar" src={tiktokData.account_avatar}/>
            </div>
          <Col xs={6} md={3} lg={2}>
            <div className="grid-item">
              <Card>
                <Row>
                  <Col>
                    <div className="rich-text">
                      <h6>Followers</h6>
                      <h3>{tiktokData.account_followers}</h3>
                    </div>
                  </Col>
                </Row>
              </Card>
            </div>
          </Col>
          <Col xs={6} md={3} lg={2}>
            <div className="grid-item">
              <Card>
                <Row>
                  <Col>
                    <div className="rich-text">
                      <h6>Likes</h6>
                      <h3>{tiktokData.account_likes}</h3>
                    </div>
                  </Col>
                </Row>
              </Card>
            </div>
          </Col>
          <Col xs={6} md={3} lg={2}>
            <div className="grid-item">
              <Card>
                <Row>
                  <Col>
                    <div className="rich-text">
                      <h6>Count</h6>
                      <h3>{tiktokData.tiktok_count}</h3>
                    </div>
                  </Col>
                </Row>
              </Card>
            </div>
          </Col>
          </Row>
          <Swiper
            navigation
            pagination={{ clickable: true }}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              768: {
                slidesPerView: 4,
              },
            }}
          >
            {tiktokData?.tiktok &&
              tiktokData.tiktok.map((tiktok, index) => (
                <SwiperSlide key={index}>
                  <div className="grid-item">
                    <Card className="tiktok">
                      <a href={tiktokData.url}>
                        <img src={tiktok?.img} />
                        <Badge className="tiktok-views">{tiktok?.views} views</Badge>
                        <div className="rich-text">
                          <h1>{tiktok?.title}</h1>
                        </div>
                      </a>
                    </Card>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </section>
      ) : null}
    </>
  );
};

export default Store;