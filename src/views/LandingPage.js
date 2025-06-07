import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Row, Col } from "reactstrap"; // Using reactstrap from the template

// A simple CSS for centering and styling
const pageStyles = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  textAlign: 'center'
};

const imageStyles = {
  maxWidth: '80%',
  height: 'auto',
  borderRadius: '10px',
  margin: '20px 0'
};

function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // We navigate to the dashboard and add a query parameter
    // to signal that the tour should start.
    navigate("/admin/dashboard?tour=true");
  };

  const handleSkipTutorial = () => {
    navigate("/admin/dashboard");
  };

  return (
    <div className="landing-page" style={pageStyles}>
      <Container>
        <Row>
          <Col className="ml-auto mr-auto" md="8">
            <h1 className="title">Color Cast Removal</h1>
            <h4 className="description">
              Instantly correct color casts in your photos with our powerful AI tool.
            </h4>
            
            {/* Replace with your actual image URL */}
            <img 
              src="https://i.imgur.com/your-image-url.jpg" // <-- ADD YOUR IMAGE URL HERE
              alt="Color cast correction example"
              style={imageStyles} 
            />

          </Col>
        </Row>
        <Row>
          <Col className="ml-auto mr-auto">
            <Button
              className="btn-round"
              color="primary"
              size="lg"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
            <Button
              className="btn-round ml-2"
              color="secondary"
              size="lg"
              onClick={handleSkipTutorial}
            >
              Skip Tutorial
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LandingPage;