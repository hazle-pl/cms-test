import React, { useState, useEffect } from "react";
import { Row, Col, Card, Placeholder } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

export const SalesTracker: React.FC = () => {
  document.title = "Sales tracker";
  
  const userId = localStorage.getItem('userId');
  const sessionToken = localStorage.getItem('sessionToken');
  const [isLoading, setIsLoading] = useState(true);
  const [storeData, setStoreData] = useState<{ storeLink: string; storeName: string }[]>([]);

  useEffect(() => {
    fetchStoresData();
  }, []);

  const fetchStoresData = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`https://shopifystatsapi.azurewebsites.net/GetUserStores?userId=${userId}`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${sessionToken}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStoreData(data);
        localStorage.setItem('trackedStores', JSON.stringify(data));
      } else {
        console.error('Failed to fetch data. Status:', response.status);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveStore = async (storeUrl: string) => {
    const requestBody = {
      userId: userId,
      shopUrl: storeUrl
    };

    try {
      const response = await fetch('https://shopifystatsapi.azurewebsites.net/RemoveUserStoreAssociation', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${sessionToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        fetchStoresData();
        toast.success("Shop removed successfully");
      } else {
        toast.error("Shop removed successfully");
      }
    } catch (error) {
      toast.error("Shop removed successfully");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const newStoreUrl = formData.get("storeUrl") as string;

    const requestBody = {
      userId: userId,
      shopUrl: newStoreUrl
    };

    try {
      const response = await fetch('https://shopifystatsapi.azurewebsites.net/AddStoresUserDataToDb', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${sessionToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        fetchStoresData();
        toast.success("Shop added");
      } else {
        toast.error("error adde");
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <>
      <Row>
        <Col>
          <div className="grid-item">
            <div className="breadcrumb">
              <Link to="/">Dashboard</Link>
              <i className="fa-solid fa-chevron-right"></i>
              <Link to="/sales-tracker">Sales Tracker</Link>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={12} lg={12}>
          <div className='grid-item'>
            <Card>
              <form id="store-association" onSubmit={handleSubmit}>
                <input type="text" name="storeUrl" placeholder="Store URL"/>
                <button type="submit"><i className="fa-solid fa-plus"/></button>
              </form>
            </Card>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={12} lg={12}>
          <div className="grid-item">
            <div className="rich-text text-align-right">
              <h5>Tracked stores {storeData.length}/25</h5>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={12} lg={12}>
          <div className='grid-item'>
            <Tabs defaultActiveKey="my-stores">
              <Tab eventKey="my-stores" title="Tracked Stores">
                <table id="my-stores-table">
                  {isLoading ? (
                    <tbody>
                       {[1, 2, 3, 4, 5, 6].map(() => (
                        <tr>
                          <Placeholder as="td">
                            <Placeholder />
                          </Placeholder>
                          </tr>
                          ))}
                    </tbody>
                  ) : (
                    <tbody>
                      {storeData.map((store, index) => {
                        return (
                          <tr key={index}>
                            <td className="logo">
                              <img src="https://www.freepnglogos.com/uploads/shopify-logo-png/shopify-pos-point-of-sale-cash-register-payment-logo-png-7.jpg" alt="Store Logo"/>
                            </td>
                            <td>{store.storeLink}</td>
                            <td>50$</td>
                            <td>60$</td>
                            <td>600$</td>
                            <td>8000$</td>
                            <td>12 products</td>
                            <td className="action">
                              <Link to={`/sales-tracker/store?q=${store.storeLink}`}>
                                <i className="fa-solid fa-chart-line"/>
                              </Link>
                              <button className="button" onClick={() => handleRemoveStore(store.storeLink)}>
                                <i className="fa-solid fa-trash-can"/>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  )}
                </table>
              </Tab>
              <Tab eventKey="my-products" title="Tracked Products">
                {/* Add content for the "My Products" tab */}
              </Tab>
            </Tabs>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default SalesTracker;
