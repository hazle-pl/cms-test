import React from 'react';
import { Container, Row, Col, Card, Carousel } from 'react-bootstrap';
import { msalInstance } from '../authConfig';

interface LoginProps {
  onLogin: (userId: string, userName: string,  sessionToken: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {

  const handleLogin = async () => {
    try {
      const response = await msalInstance.loginPopup({
        ...loginRequest,
        loginHint: "login",
      });

      const user = response.account;

      if (user) {
        const userId = user.localAccountId;
        const userName = user.name!;
        const sessionToken = response.idToken;

        localStorage.setItem('userId', userId);
        localStorage.setItem('userName', userName);
        localStorage.setItem('sessionToken', sessionToken);

        onLogin(userId, userName, sessionToken);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loginRequest = {
    scopes: ['openid', 'profile']
  };

  return (
    <Container fluid className="gx-0">
     
            <button className="primary-btn" onClick={handleLogin}>Sign in</button>
         
    </Container>
  );
};

export default Login;