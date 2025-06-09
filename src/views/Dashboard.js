/*!

=========================================================
* Black Dashboard React v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import axios from "axios";
import classNames from "classnames";
import Joyride, { STATUS } from 'react-joyride';
import React , { useState , useEffect } from "react";
import { Bar } from "react-chartjs-2";
// import { useLocation } from "react-router-dom";
import Settings from "./Settings";


// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Container, 
  Modal, 
  ModalBody, 
  ModalFooter, 
  Table,
  Row,
  Col,
} from "reactstrap";

import beachCast from 'assets/img/beach_cast.png';
import beachFixed from 'assets/img/beach_fixed.png';
import greenCast from 'assets/img/green_cast.png';
import greenFixed from 'assets/img/green_fixed.png';
import purpleCasted from 'assets/img/purple_casted.png';
import purpleFixed from 'assets/img/purple_fixed.png';


// ====================================================================
// Part 1: The Welcome View Component
// ====================================================================

const WelcomeView = ({ onStartTour, onSkip, isFadingOut }) => {
  const imageUrls = [
    beachCast,
    beachFixed,
    greenCast,
    greenFixed,
    purpleCasted,
    purpleFixed,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Start fade out
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
        setFade(true); // Fade in the next image
      }, 500); // Duration of fade out
    }, 4000); // Image change interval

    return () => clearInterval(interval);
  }, []);

  const welcomeStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'calc(100vh - 200px)',
    minHeight: '500px'
  };

  const imageStyles = {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '8px',
    transition: 'opacity 0.5s ease-in-out',
    opacity: fade ? 1 : 0,
    WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
    WebkitMaskSize: '100% 100%',
    maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
    maskSize: '100% 100%',
  };

  return (
    // Add fade-out class when triggered
    <div className={`welcome-container ${isFadingOut ? 'fade-out' : 'fade-in'}`} style={welcomeStyles}>
      <Row className="d-flex align-items-center">
        <Col md="6" className="pr-md-5 pl-md-4">
          <h1 className="title text-primary">Color Cast Removal</h1>
          <h3 className="description">
            Instantly correct color casts in your photos with our powerful AI tool.
          </h3>
          <p className="text-muted mt-4">
            Take a quick tour to see how it works, or jump right in and start editing. Your workflow, your choice.
          </p>
          <div className="mt-5">
            <Button className="btn-round" color="primary" size="lg" onClick={onStartTour}>
              Get Started
            </Button>
            <Button className="btn-round ml-2" color="secondary" size="lg" onClick={onSkip}>
              Skip Tutorial
            </Button>
          </div>
        </Col>
        <Col md="6" className="pl-md-5 pr-md-4 mt-4 mt-md-0">
          <img
            src={imageUrls[currentIndex]}
            alt="Color cast correction example"
            style={imageStyles}
          />
        </Col>
      </Row>
    </div>
  );
};

// ====================================================================
// Part 2: The Dashboard Content Component (all your old JSX)
// ====================================================================
const DashboardContent = (props) => {
  // Destructure ALL the props you need from the main Dashboard component
  const {
    handleImageUpload, handleDragOver, handleDrop, uploadedImageUrl, uploadedImage,
    handleProcessImage, viewMode, setViewMode, processedImageUrl, hasAdjusted, adjustedImageUrl,
    processedFilename, progress, isProcessing, adjustParams, handleAdjustChange, setAdjustedImageUrl,
    setAdjustParams, showSplitHistograms, setShowSplitHistograms, inputHistogram, outputHistogram,
    histogramOptions, imageHistory, setImageHistory
  } = props;
  
  return (
    // Add the fade-in class for a smooth transition
    <div className="fade-in">
        <Row>
          <Col lg="4" md="12" className="tour-step-1">
            <Card id="upload-image">
              <CardHeader>
                <Row className="align-items-center" >
                  <Col>
                    <CardTitle tag="h3">Upload Image</CardTitle>
                  </Col>
                  <Col className="text-right">
                    <Button onClick={() => document.getElementById("fileInput").click()}>
                      <span className="d-none d-sm-inline">Upload</span>
                      <span className="d-inline d-sm-none">
                        <i className="tim-icons icon-upload" />
                      </span>
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody className="tour-step-2">
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
                <div style={{
                  border: "2px dashed #ccc",
                  borderRadius: "10px",
                  padding: "20px",
                  textAlign: "center",
                  cursor: "pointer",
                  height: "300px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById("fileInput").click()}
              >
                {uploadedImageUrl ? (
                  <img
                    src={uploadedImageUrl}
                    alt="Uploaded"
                    style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                  />
                ) : (
                  <p>Drag & Drop or Click to Upload</p>
                )}
              </div>
              {uploadedImage && (
                <div className="text-center mt-2 text-muted">
                  Filename: <strong>{uploadedImage.name}</strong>
                </div>
              )}
              <Button id="tour-step-2" onClick={handleProcessImage} color="primary" className="mt-3 w-100">
                Process
              </Button>
              </CardBody>
            </Card>
          </Col>
          <Col lg="8" md="12">
            <Card>
              <CardHeader>
                <Row className="align-items-center">
                    <Col>
                      <CardTitle tag="h2">Remove Color Cast</CardTitle>
                    </Col>
                    <Col className="text-right">
                      <ButtonGroup className="btn-group-toggle mb-3" data-toggle="buttons">
                        <Button
                          tag="label"
                          color="info"
                          size="sm"
                          className={classNames("btn-simple", { active: viewMode === "processed" })}
                          onClick={() => setViewMode("processed")}
                          disabled={!processedImageUrl}
                          >
                          <span className="d-none d-sm-block d-md-block">View Processed</span>
                          <span className="d-block d-sm-none">
                            <i className="tim-icons icon-image-02" />
                          </span>
                        </Button>
                        <Button
                          tag="label"
                          color="info"
                          size="sm"
                          className={classNames("btn-simple", { active: viewMode === "adjusted" })}
                          onClick={() => setViewMode("adjusted")}
                          disabled={!hasAdjusted || !adjustedImageUrl}
                          >
                          <span className="d-none d-sm-block d-md-block">View Adjusted</span>
                          <span className="d-block d-sm-none">
                            <i className="tim-icons icon-settings" />
                          </span>
                        </Button>
                      </ButtonGroup>
                    </Col>
                  </Row>
                </CardHeader>
              <CardBody>
                <div
                  style={{
                    border: "2px dashed #ccc",
                    borderRadius: "10px",
                    padding: "20px",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {/* <OutputImage
                    processedImageUrl={processedImageUrl}
                    adjustedImageUrl={adjustedImageUrl}
                    mode={viewMode}
                  /> */}
                  {viewMode === 'processed' && processedImageUrl ? (
                    <img
                      src={processedImageUrl}
                      alt="Processed"
                      style={{ width: "100%", maxHeight: "300px", objectFit: "contain" }}
                    />
                  ) : viewMode === 'adjusted' && adjustedImageUrl ? (
                    <img
                      src={adjustedImageUrl}
                      alt="Adjusted"
                      style={{ width: "100%", maxHeight: "300px", objectFit: "contain" }}
                    />
                  ) : (
                    <p>No {viewMode} image yet</p>
                  )}
                </div>
                {processedImageUrl && processedFilename && (
                  <div className="text-center mt-2 text-muted">
                    Filename: <strong>{processedFilename}</strong>
                  </div>
                )}
                <Row className="mt-3 px-3 w-100">
                  <Col xs="12">
                    <div className="progress" style={{ height: "10px", width: "100%" }}>
                      <div
                        className={`progress-bar ${isProcessing ? "progress-bar-striped progress-bar-animated" : ""} bg-info`}
                        role="progressbar"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="text-right">
                      <small>{progress}%</small>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          </Row>
          <Row>
            <Card className="tour-step-3">
              <CardHeader>
                <Row className="align-items-center">
                  <Col>
                    <h5 className="card-category">Further edit image before download</h5>
                    <CardTitle tag="h4">Adjustments</CardTitle>
                  </Col>
                  <Col className="text-right" xs="auto">
                    <Button
                      className="mr-2" // <-- Add a margin for spacing
                      size="sm"
                      color="warning"
                      onClick={() => {
                        setAdjustedImageUrl(processedImageUrl);
                        setAdjustParams({ brightness: 0, contrast: 0, saturation: 0, temperature: 0 });
                      }}
                      disabled={!processedImageUrl}
                    >
                      <i className="tim-icons icon-refresh-01 d-inline d-sm-none" />
                      <span className="d-none d-sm-inline">Reset</span>
                    </Button>
                    <Button
                      color="success"
                      size="sm" // <-- Make size consistent with the Reset button
                      href={viewMode === "adjusted" ? adjustedImageUrl : processedImageUrl}
                      download
                      disabled={viewMode === "adjusted" ? !adjustedImageUrl : !processedImageUrl}
                    >
                      <span className="d-none d-sm-block d-md-block">Download Image</span>
                      <span className="d-block d-sm-none">
                        <i className="tim-icons icon-cloud-download-93" />
                      </span>
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody className="tour-step-4">
                {/* ─── SETTINGS ──────── */}
                <Settings settings={adjustParams} onChange={handleAdjustChange} />
              </CardBody>
            </Card>
          </Row>
        <Row>
          {/* <Col lg="4" md="12"> */}
          <Card id="rgb-histogram" className="card-chart">
          <CardHeader>
            <Row>
              <Col className="text-left" sm="6">
                <h5 className="card-category">Color Distribution</h5>
                <CardTitle tag="h2">RGB Histograms</CardTitle>
              </Col>
              <Col className="text-right" sm="6">
                <Button
                  id="tour-step-6"
                  size="sm"
                  color="info"
                  onClick={() => setShowSplitHistograms(!showSplitHistograms)}
                  disabled={!processedImageUrl}
                >
                  {showSplitHistograms ? "Show Merged Histogram" : "Show Split Histogram"}
                </Button>
              </Col>
            </Row>
          </CardHeader>
          <CardBody className="tour-step-5">
              {!showSplitHistograms ? (
                // Merged View
              <div className="chart-area" style={{ height: "400px", padding: "1rem" }}>
                <Bar
                  data={{
                    labels: Array.from({ length: 256 }, (_, i) => i),
                    datasets: [
                      {
                        label: "Red (Input)",
                        data: inputHistogram?.r || [],
                        backgroundColor: "rgba(255, 99, 132, 0.9)",
                      },
                      {
                        label: "Green (Input)",
                        data: inputHistogram?.g || [],
                        backgroundColor: "rgba(75, 192, 192, 0.9)",
                      },
                      {
                        label: "Blue (Input)",
                        data: inputHistogram?.b || [],
                        backgroundColor: "rgba(54, 162, 235, 0.9)",
                      },
                      {
                        label: "Red (Output)",
                        data: outputHistogram?.r || [],
                        backgroundColor: "rgba(255, 99, 132, 0.9)",
                      },
                      {
                        label: "Green (Output)",
                        data: outputHistogram?.g || [],
                        backgroundColor: "rgba(75, 192, 192, 0.9)",
                      },
                      {
                        label: "Blue (Output)",
                        data: outputHistogram?.b || [],
                        backgroundColor: "rgba(54, 162, 235, 0.9)",
                      },
                    ],
                  }}
                  options={histogramOptions}
                />
              </div>
              ) : (
                // Split View
                <Row>
                  <Col md="6">
                    <h5 className="text-center text-muted">Input Image</h5>
                    <div className="chart-area" style={{ height: "300px" }}>
                    <Bar
                      data={{
                        labels: Array.from({ length: 256 }, (_, i) => i),
                        datasets: [
                          {
                            label: "Red",
                            data: inputHistogram?.r || [],
                            backgroundColor: "rgba(255, 99, 132, 0.9)",
                          },
                          {
                            label: "Green",
                            data: inputHistogram?.g || [],
                            backgroundColor: "rgba(75, 192, 192, 0.9)",
                          },
                          {
                            label: "Blue",
                            data: inputHistogram?.b || [],
                            backgroundColor: "rgba(54, 162, 235, 0.9)",
                          },
                        ],
                      }}
                      options={histogramOptions}
                    />
                    </div>
                  </Col>
                  <Col md="6">
                    <h5 className="text-center text-muted">Output Image</h5>
                    <div className="chart-area" style={{ height: "300px" }}>
                    <Bar
                      data={{
                        labels: Array.from({ length: 256 }, (_, i) => i),
                        datasets: [
                          {
                            label: "Red",
                            data: outputHistogram?.r || [],
                            backgroundColor: "rgba(255, 99, 132, 0.9)",
                          },
                          {
                            label: "Green",
                            data: outputHistogram?.g || [],
                            backgroundColor: "rgba(75, 192, 192, 0.9)",
                          },
                          {
                            label: "Blue",
                            data: outputHistogram?.b || [],
                            backgroundColor: "rgba(54, 162, 235, 0.9)",
                          },
                        ],
                      }}
                      options={histogramOptions}
                    />
                    </div>
                  </Col>
                </Row>
              )}
          </CardBody>
          </Card>
        </Row>
        <Row>
          <Card id="history" className="tour-step-7">
              <CardHeader>
                <Row>
                  <Col className="text-left" sm="6">
                    <h5 className="card-category">Last 10 Processed Images</h5>
                    <CardTitle tag="h2">History</CardTitle>
                  </Col>
                  <Col className="text-right">
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => setImageHistory([])}
                      disabled={imageHistory.length === 0}
                    >
                      Clear History
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {imageHistory.length === 0 ? (
                  <p className="text-muted">No images processed yet.</p>
                ) : (
                  <Table responsive>
                    <thead>
                      <tr>
                        <th style={{ width: "40px" }}>#</th>
                        <th className="filename-cell">Filename</th>
                        <th>Before</th>
                        <th>After</th>
                        <th style={{ width: "50px" }}></th> {/* Empty header for download button */}
                      </tr>
                    </thead>
                    <tbody>
                      {imageHistory.map((img, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className="filename-cell">{img.name}</td>
                          <td>
                            <img src={img.before} alt="before" width="100" />
                          </td>
                          <td>
                            <img src={img.after} alt="after" width="100" />
                          </td>
                          <td>
                            <Button
                              color="success"
                              size="sm"
                              href={img.after}
                              download
                              disabled={!img.after}
                            >
                            <span className="d-none d-sm-block d-md-block">Download</span>
                            <span className="d-block d-sm-none">
                              <i className="tim-icons icon-cloud-download-93" />
                            </span>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </CardBody>
            </Card>
        </Row>
    </div>
  );
}

// ====================================================================
// Part 3: The Main Dashboard "Controller" Component
// ====================================================================

function Dashboard(props) {

  // --- STATE MANAGEMENT ---
  const [showDashboard, setShowDashboard] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [runTour, setRunTour] = useState(false);
  
  const backendUrl = process.env.REACT_APP_API_URL;

  // NOTIFICATION
  const { notify } = props

  useEffect(() => {
    const initialize = async () => {
      notify("info", "Cleaning up previous files...");
      notify("info", "Loading Color Cast Removal Model...");
      // 1. Trigger cleanup
      fetch(`${backendUrl}/api/cleanup`, { method: 'POST' })
      .then(res => res.json())
      .then(data => console.log("Cleanup response:", data))
      .catch(err => console.error("Cleanup error:", err));
      notify("success", "Cleanup complete.");

      // 2. Trigger model initialization
      fetch(`${backendUrl}/api/init_model`, { method: 'POST' })
        .then(res => res.json())
        .then(data => console.log("Init model response:", data))
        .catch(err => console.error("Init model error:", err));
      notify("success", "Model initialization complete.")
    };
    initialize();
  }, [backendUrl]); // Runs only once on page load/refresh

  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = React.useState(null);
  const [processedImageUrl, setProcessedImageUrl] = React.useState(null);
  const [processedFilename, setProcessedFilename] = React.useState(null);
  const [processedBlob, setProcessedBlob] = useState(null);

  // --- HANDLERS FOR WELCOME VIEW ---
  const transitionToDashboard = (startTour = false) => {
    setIsFadingOut(true); // Trigger fade-out animation

    // Wait for animation to complete before changing the view
    setTimeout(() => {
      setShowDashboard(true);
      if (startTour) {
        // A small extra delay for the dashboard to render before tour starts
        setTimeout(() => setRunTour(true), 100);
      }
    }, 500); // This duration must match your CSS animation duration
  };

  const handleStartTour = () => transitionToDashboard(true);
  const handleSkipTutorial = () => transitionToDashboard(false);

  // ADD STATE FOR THE TOUR
  const [tourSteps] = useState([
    {
      target: '.tour-step-1',
      content: 'Welcome! Start by uploading your color casted image here.',
      placement: 'right',
      disableBeacon: true,
    },
    {
      target: '#tour-step-2',
      content: 'After uploading, click this button to process the image and remove the color cast.',
    },
    {
      target: '.tour-step-3',
      content: 'Fine-tune the results using these adjustment sliders.',
      placement: 'left',
    },
    {
      target: '.tour-step-4',
      content: 'Brightness adjusts how light or dark your image appears. /n ',
    },
    {
      target: '.tour-step-5',
      content: 'The RGB Histogram shows you the color balance of your color cast image and the corrected image.',
    },
    {
      target: '#tour-step-6',
      content: 'Click here to show the charts side-by-side instead.',
    },
    {
      target: '.tour-step-7',
      content: 'Your processing history of previous 10 images are saved here. You can clear history when storage is full.',
      placement: 'top',
    }
  ]);

  // 3. CALLBACK TO HANDLE TOUR ENDING
  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // When the tour is finished or skipped, stop it
      setRunTour(false);
    }
  };

  // HISTORY
  const [imageHistory, setImageHistory] = useState([]);
  
  // ADJUSTMENT
  const [viewMode, setViewMode] = useState("processed");
  const [adjustParams, setAdjustParams] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    temperature: 0
  });
  const [adjustedImageUrl, setAdjustedImageUrl] = useState(null);
  const [hasAdjusted, setHasAdjusted] = useState(false);
  
  const handleAdjustChange = async (param, value) => {
    const newParams = { ...adjustParams, [param]: value };
    setAdjustParams(newParams);
    
    if (!uploadedImage) return;
    if (!hasAdjusted) setHasAdjusted(true);
    
    const formData = new FormData();
    formData.append('image', processedBlob);
    formData.append('brightness', newParams.brightness);
    formData.append('contrast', newParams.contrast);
    formData.append('saturation', newParams.saturation);
    formData.append('temperature', newParams.temperature);
    
    try {
      const adjustResponse = await axios.post(`${backendUrl}/api/adjust`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob", // key part
      });
      
      const blob = adjustResponse.data;
      const blobUrl = URL.createObjectURL(blob);
      setAdjustedImageUrl(blobUrl);
      
      // Auto-switch to adjusted view
      if (viewMode !== "adjusted") {
        setViewMode("adjusted");
      }
      
    } catch (error) {
      console.error("Adjustment failed:", error);
      notify("danger", "Image adjustment failed.");
    }
  };
  
  // UPLOAD
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(file); // Save file for later processing
      const localUrl = URL.createObjectURL(file);
      setUploadedImageUrl(localUrl);

      // Clear previous output & adjustments
      setProcessedImageUrl(null);
      setAdjustedImageUrl(null);
      setHasAdjusted(false);
      setViewMode("processed");
      setAdjustParams({ brightness: 0, contrast: 0, saturation: 0, temperature: 0 });
      setProgress(0);
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    handleImageUpload({ target: { files: e.dataTransfer.files } });
  };

  // PROCESS
  const handleProcessImage = async () => {
    if (!uploadedImage) return;

    if (imageHistory.length >= 10) {
      notify("danger", "Image upload limit reached (max 10 images).");
      return;
    }  

    const formData = new FormData();
    formData.append("image", uploadedImage);

    setIsProcessing(true);
    setProgress(10);

    notify("info", `Processing image: ${uploadedImage.name}`);
  
    try {
        const response = await axios.post(`${backendUrl}/api/inference`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob",
        onUploadProgress: (progressEvent) => {
          // Calculate the percentage and cap it at 90%
          const percentCompleted = Math.min(
            Math.round((progressEvent.loaded * 100) / progressEvent.total),
            90
          );
          setProgress(percentCompleted);
        },
      });
      console.log("Got the response")
      const afterBlob = response.data;
      setProcessedBlob(afterBlob);
      console.log("Received Blob:", afterBlob);
      // Extract filename from Content-Disposition header
      const disposition = response.headers["content-disposition"];
      console.log("disposition", disposition)
      let filename = "processed_image.png"; // fallback
      if (disposition) {
        const filenameRegex = /filename[^;=\n]*=(['"]?)([^'"\n]*)\1/;
        const match = disposition.match(filenameRegex);
        if (match && match[2]) {
          filename = match[2];
        }
      }
      const afterUrl = URL.createObjectURL(afterBlob);
      setProcessedImageUrl(afterUrl); // after_url
      setProcessedFilename(filename)
      setProgress(100); // complete  
      notify("success", `Image ${uploadedImage.name} processed successfully.`);
      setImageHistory(prev => [...prev, {
        name: uploadedImage.name,
        before: uploadedImageUrl,
        after: afterUrl
      }]);
      // Fetch processed image for histogram
      try {
        const fetchResponse = await fetch(afterUrl, { mode: "cors" });
        if (!fetchResponse.ok) {
          throw new Error(`Failed to fetch processed image: ${fetchResponse.statusText}`);
        }
        const blob = await fetchResponse.blob();
        const processedFile = new File([blob], "processed.png", { type: blob.type });
        await fetchHistograms(uploadedImage, processedFile);
      } catch (fetchError) {
        console.error("Failed to fetch processed image for histogram:", fetchError);
        notify("danger", "Failed to load processed image for histogram generation.");
      }
    } catch (error) {
      console.error("Processing failed:", error);
      setProcessedImageUrl(uploadedImageUrl);
      setProgress(0);
      notify("danger", `Image processing failed for ${uploadedImage.name}.`);
    } finally {
      setTimeout(() => setIsProcessing(false), 5000);
    }
  };

  // HISTOGRAM
  const [inputHistogram, setInputHistogram] = useState(null);
  const [outputHistogram, setOutputHistogram] = useState(null);
  const [showSplitHistograms, setShowSplitHistograms] = useState(false);

  const fetchHistograms = async (original, processed) => {
    const formDataOriginal = new FormData();
    formDataOriginal.append("image", original);

    const formDataProcessed = new FormData();
    formDataProcessed.append("image", processed);

    try {
      const [originalRes, processedRes] = await Promise.all([
        axios.post(`${backendUrl}/api/histogram`, formDataOriginal),
        axios.post(`${backendUrl}/api/histogram`, formDataProcessed),
      ]);
      setInputHistogram(originalRes.data);
      setOutputHistogram(processedRes.data);
    } catch (err) {
      console.error("Error fetching histograms:", err);
    }
  };

  const histogramOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: { display: true, text: 'Pixel Intensity', color: '#ccc' },
      },
      y: {
        title: { display: true, text: 'Frequency', color: '#ccc' },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: '#ccc',
        },
      },
    },
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (showDashboard && (uploadedImage || processedImageUrl || hasAdjusted)) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [showDashboard, uploadedImage, processedImageUrl, hasAdjusted]); 

  return (
    <>
      {/* CSS for transitions */}
      <style>{`
        .fade-in { animation: fadeIn 0.5s ease-in-out; }
        .fade-out { animation: fadeOut 0.5s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
      `}</style>
      <Joyride
        steps={tourSteps}
        run={runTour}
        callback={handleJoyrideCallback}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        styles={{
          options: {
            primaryColor: '#e14eca', 
            textColor: '#fff',
            backgroundColor: '#333',
            arrowColor: '#333'
          }
        }}
      />
      <div className="content">
      {!showDashboard ? (
          <WelcomeView 
            onStartTour={handleStartTour} 
            onSkip={handleSkipTutorial} 
            isFadingOut={isFadingOut} 
          />
        ) : (
          <DashboardContent
          handleImageUpload={handleImageUpload}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          uploadedImageUrl={uploadedImageUrl}
          uploadedImage={uploadedImage}
          handleProcessImage={handleProcessImage}
          viewMode={viewMode}
          setViewMode={setViewMode}
          processedImageUrl={processedImageUrl}
          hasAdjusted={hasAdjusted}
          adjustedImageUrl={adjustedImageUrl}
          processedFilename={processedFilename}
          progress={progress}
          isProcessing={isProcessing}
          adjustParams={adjustParams}
          handleAdjustChange={handleAdjustChange}
          setAdjustedImageUrl={setAdjustedImageUrl}
          setAdjustParams={setAdjustParams}
          showSplitHistograms={showSplitHistograms}
          setShowSplitHistograms={setShowSplitHistograms}
          inputHistogram={inputHistogram}
          outputHistogram={outputHistogram}
          histogramOptions={histogramOptions}
          imageHistory={imageHistory}
          setImageHistory={setImageHistory}
          />
        )}
      </div>
    </>
  );
}

export default Dashboard;
