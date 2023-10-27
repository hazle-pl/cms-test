import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { msalInstance } from './authConfig';
import { AccountInfo } from "@azure/msal-common";
import routes from './routes';
import Sidebar from './components/sidebar';
import Header from './components/header';
import Login from './pages/login';


const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');

  const tokenRequest = {
    scopes: ['openid', 'profile'],
  };

  const checkLoginStatus = async () => {
    const token = localStorage.getItem('sessionToken');

    if (token) {
      setIsLoggedIn(true);
      try {
        const accounts = msalInstance.getAllAccounts();
        const matchingAccount = accounts.find(
          (account) => account.localAccountId === localStorage.getItem('userId')
        );

        if (matchingAccount) {
          await renewToken(matchingAccount, tokenRequest.scopes);
          setIsLoggedIn(true);
          setUserId(matchingAccount.localAccountId);
        } else {
          handleLogout();
        }
      } catch (error) {
        handleLogout();
      }
    } else {
      handleLogout();
    }
  };

  const renewToken = async (account: AccountInfo, requestScopes: string[]): Promise<void> => {
    try {
      const response = await msalInstance.acquireTokenSilent({
        account,
        scopes: requestScopes,
      });

      const newToken = response.idToken;
      console.log('Token renewed:', newToken);
      localStorage.setItem('sessionToken', newToken);
    } catch (error) {
      handleLogout();
    }
  };

  const handleLogin = (userId: string, userName: string, sessionToken: string) => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('sessionToken');
    setIsLoggedIn(false);
  };

  useEffect(() => {
    checkLoginStatus();
  }, []); // Run this effect only once on initial load

  return (
    <Router>
      {isLoggedIn ? (
        <div className="app">
          <Sidebar />
          <Container fluid>
            <Header onLogout={handleLogout} />
            <main>
              <Switch>
                {routes.map((route) => (
                  <Route key={route.name} exact path={route.path}>
                    <route.component />
                  </Route>
                ))}
              </Switch>
            </main>
          </Container>
          <ToastContainer />
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </Router>
  );
};

export default App;
