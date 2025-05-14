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
import React , { useState , useRef } from "react";
import { Line, Bar } from "react-chartjs-2";
import OutputImage from "./OutputImage";
import NotificationAlert from "react-notification-alert";
import Settings from "./Settings";

// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Label,
  FormGroup,
  Input,
  Table,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";

// core components
import {
  chartExample1,
  chartExample2,
  chartExample3,
  chartExample4,
} from "variables/charts.js";

function Dashboard(props) {
  const backendUrl = process.env.REACT_APP_API_URL;
  const [bigChartData, setbigChartData] = React.useState("data1");
  const setBgChartData = (name) => {
    setbigChartData(name);
  };
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = React.useState(null);
  const [processedImageUrl, setProcessedImageUrl] = React.useState(null);
  const notificationAlertRef = useRef(null);

  // HISTORY
  const [viewMode, setViewMode] = useState("processed");
  
  // ADJUSTMENT
  const [imageHistory, setImageHistory] = useState([]);
  const [adjustParams, setAdjustParams] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    temperature: 0
  });
  const [adjustedImageUrl, setAdjustedImageUrl] = useState(null);
  
  const handleAdjustChange = (param, value) => {
    const newParams = { ...adjustParams, [param]: value };
    setAdjustParams(newParams);
  
    if (!uploadedImage) return;
  
    const formData = new FormData();
    formData.append('image', uploadedImage);
    formData.append('brightness', newParams.brightness);
    formData.append('contrast', newParams.contrast);
    formData.append('saturation', newParams.saturation);
    formData.append('temperature', newParams.temperature);
  
    fetch('/api/adjust', {
      method: 'POST',
      body: formData,
    })
      .then(res => res.blob())
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        setAdjustedImageUrl(blobUrl);

      // 👇 Auto-switch to adjusted view
      if (viewMode !== "adjusted") {
        setViewMode("adjusted");
      }
    });
  };

  const notify = (type, message) => {
    const options = {
      place: "br", // bottom right
      message: (
        <div>
          <div>
            <b>{type === "success" ? "Success - " : "Error - "}</b>
            {message}
          </div>
        </div>
      ),
      type: type, // "success" or "danger"
      icon: "tim-icons icon-bell-55",
      autoDismiss: 5,
    };
    notificationAlertRef.current.notificationAlert(options);
  };  
  
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(file); // save file for later processing
      const localUrl = URL.createObjectURL(file);
      setUploadedImageUrl(localUrl);
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    handleImageUpload({ target: { files: e.dataTransfer.files } });
  };
  const handleProcessImage = async () => {
    if (!uploadedImage) return;

    if (imageHistory.length >= 10) {
      notify("danger", "Image upload limit reached (max 10 images).");
      return;
    }  

    const formData = new FormData();
    formData.append("image", uploadedImage);

    setIsProcessing(true);
    setProgress(0);

    // Fake progress simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90; // stop at 90% until backend finishes
        }
        return prev + 5;
      });
    }, 300);
  
    try {
      const response = await axios.post(`${backendUrl}/api/process`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Got the response")
      const { after_url } = response.data;
      setProcessedImageUrl(after_url);
      setProgress(100); // complete  
      notify("success", "Image processed successfully.");
      setImageHistory(prev => [...prev, {
        name: uploadedImage.name,
        before: uploadedImageUrl,
        after: after_url
      }]);
    } catch (error) {
      console.error("Processing failed:", error);
      setProcessedImageUrl(uploadedImageUrl);
      setProgress(0);
      notify("danger", "Image processing failed.");
    } finally {
      setTimeout(() => setIsProcessing(false), 5000);
    }
  };
  
  return (
    <>
      <div className="content">
        
        <Row>
          <Col lg="4" md="12">
            <Card>
              <CardHeader>
                <Row className="align-items-center">
                  <Col>
                    <h5 className="card-category">Upload Images</h5>
                  </Col>
                  <Col className="text-right">
                    <Button onClick={() => document.getElementById("fileInput").click()}>
                      Upload
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
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
              <Button onClick={handleProcessImage} color="primary" className="mt-3 w-100">
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
                <h5 className="card-category">Processed Output</h5>
                </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Mode toggle buttons */}
                <Col sm="6">
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
                      disabled={!adjustedImageUrl}
                    >
                      <span className="d-none d-sm-block d-md-block">View Adjusted</span>
                      <span className="d-block d-sm-none">
                        <i className="tim-icons icon-settings" />
                      </span>
                    </Button>
                  </ButtonGroup>
                </Col>
                {/* Image Display */}
                <OutputImage
                  processedImageUrl={processedImageUrl}
                  adjustedImageUrl={adjustedImageUrl}
                  mode={viewMode} // e.g. 'processed' or 'adjusted'
                />
                {processedImageUrl && (
                  <div className="text-center mt-2 text-muted">
                    Filename: <strong>{processedImageUrl.split("/").pop()}</strong>
                  </div>
                )}
                {isProcessing && (
                  <div className="progress mt-3" style={{ height: "10px" }}>
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated bg-info"
                      role="progressbar"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}
                <Col className="text-right">
                  <Button
                      color="success"
                      href={processedImageUrl}
                      download
                      disabled={!processedImageUrl}
                    >
                      Download Image
                  </Button>
                </Col>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <Row className="align-items-center">
                  <Col>
                    <CardTitle tag="h2" className="mb-0">Adjustments</CardTitle>
                  </Col>
                  <Col className="text-right">
                    <Button
                      size="sm"
                      color="warning"
                      onClick={() => {
                        setAdjustParams({ brightness: 0, contrast: 0, saturation: 0, temperature: 0 });
                        setViewMode("processed");
                      }}
                      disabled={!processedImageUrl} // Optional: disable when no image
                    >
                      Reset
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {/* ─── SETTINGS ──────── */}
                <Settings settings={adjustParams} onChange={handleAdjustChange} />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
              <Row className="align-items-center">
                <Col>
                  <h5 className="card-category mb-0">History (Last 10 Processed Images)</h5>
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
                        <th>Filename</th>
                        <th>Before</th>
                        <th>After</th>
                        <th style={{ width: "50px" }}></th> {/* Empty header for download button */}
                      </tr>
                    </thead>
                    <tbody>
                      {imageHistory.map((img, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{img.name}</td>
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
                              Download
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            <Card className="card-chart">
              <CardHeader>
                <Row>
                  <Col className="text-left" sm="6">
                    <h5 className="card-category">Total Shipments</h5>
                    <CardTitle tag="h2">Performance</CardTitle>
                  </Col>
                  <Col sm="6">
                    <ButtonGroup
                      className="btn-group-toggle float-right"
                      data-toggle="buttons"
                    >
                      <Button
                        tag="label"
                        className={classNames("btn-simple", {
                          active: bigChartData === "data1",
                        })}
                        color="info"
                        id="0"
                        size="sm"
                        onClick={() => setBgChartData("data1")}
                      >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Accounts
                        </span>
                        <span className="d-block d-sm-none">
                          <i className="tim-icons icon-single-02" />
                        </span>
                      </Button>
                      <Button
                        color="info"
                        id="1"
                        size="sm"
                        tag="label"
                        className={classNames("btn-simple", {
                          active: bigChartData === "data2",
                        })}
                        onClick={() => setBgChartData("data2")}
                      >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Purchases
                        </span>
                        <span className="d-block d-sm-none">
                          <i className="tim-icons icon-gift-2" />
                        </span>
                      </Button>
                      <Button
                        color="info"
                        id="2"
                        size="sm"
                        tag="label"
                        className={classNames("btn-simple", {
                          active: bigChartData === "data3",
                        })}
                        onClick={() => setBgChartData("data3")}
                      >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Sessions
                        </span>
                        <span className="d-block d-sm-none">
                          <i className="tim-icons icon-tap-02" />
                        </span>
                      </Button>
                    </ButtonGroup>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Line
                    data={chartExample1[bigChartData]}
                    options={chartExample1.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <div className="react-notification-alert-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>

        {/* <Row>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Total Shipments</h5>
<CardTitle tag="h3">
                  <i className="tim-icons icon-bell-55 text-info" /> 763,215
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Line
                    data={chartExample2.data}
                    options={chartExample2.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Daily Sales</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-delivery-fast text-primary" />{" "}
                  3,500€
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Bar
                    data={chartExample3.data}
                    options={chartExample3.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Completed Tasks</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-send text-success" /> 12,100K
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Line
                    data={chartExample4.data}
                    options={chartExample4.options}
                />
              </div>
            </CardBody>
          </Card>
        </Col>
        </Row>
        <Row>
          <Col lg="6" md="12">
            <Card className="card-tasks">
              <CardHeader>
                <h6 className="title d-inline">Tasks(5)</h6>
                <p className="card-category d-inline"> today</p>
                <UncontrolledDropdown>
                  <DropdownToggle
                    caret
                    className="btn-icon"
                    color="link"
                    data-toggle="dropdown"
                    type="button"
                  >
                    <i className="tim-icons icon-settings-gear-63" />
                  </DropdownToggle>
                  <DropdownMenu aria-labelledby="dropdownMenuLink" right>
                    <DropdownItem
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                    >
                      Action
                    </DropdownItem>
                    <DropdownItem
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                    >
                      Another action
                    </DropdownItem>
                    <DropdownItem
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                    >
                      Something else
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </CardHeader>
              <CardBody>
                <div className="table-full-width table-responsive">
                  <Table>
                    <tbody>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultValue="" type="checkbox" />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className="title">Update the Documentation</p>
                          <p className="text-muted">
                            Dwuamish Head, Seattle, WA 8:47 AM
                          </p>
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id="tooltip636901683"
                            title=""
                            type="button"
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip636901683"
                            placement="right"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input
                                defaultChecked
                                defaultValue=""
                                type="checkbox"
                              />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className="title">GDPR Compliance</p>
                          <p className="text-muted">
                            The GDPR is a regulation that requires businesses to
                            protect the personal data and privacy of Europe
                            citizens for transactions that occur within EU
                            member states.
                          </p>
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id="tooltip457194718"
                            title=""
                            type="button"
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip457194718"
                            placement="right"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultValue="" type="checkbox" />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className="title">Solve the issues</p>
                          <p className="text-muted">
                            Fifty percent of all respondents said they would be
                            more likely to shop at a company
                          </p>
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id="tooltip362404923"
                            title=""
                            type="button"
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip362404923"
                            placement="right"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultValue="" type="checkbox" />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className="title">Release v2.0.0</p>
                          <p className="text-muted">
                            Ra Ave SW, Seattle, WA 98116, SUA 11:19 AM
                          </p>
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id="tooltip818217463"
                            title=""
                            type="button"
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip818217463"
                            placement="right"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultValue="" type="checkbox" />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className="title">Export the processed files</p>
                          <p className="text-muted">
                            The report also shows that consumers will not easily
                            forgive a company once a breach exposing their
                            personal data occurs.
                          </p>
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id="tooltip831835125"
                            title=""
                            type="button"
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip831835125"
                            placement="right"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultValue="" type="checkbox" />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className="title">Arival at export process</p>
                          <p className="text-muted">
                            Capitol Hill, Seattle, WA 12:34 AM
                          </p>
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id="tooltip217595172"
                            title=""
                            type="button"
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip217595172"
                            placement="right"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="6" md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Simple Table</CardTitle>
              </CardHeader>
              <CardBody>
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Name</th>
                      <th>Country</th>
                      <th>City</th>
                      <th className="text-center">Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Dakota Rice</td>
                      <td>Niger</td>
                      <td>Oud-Turnhout</td>
                      <td className="text-center">$36,738</td>
                    </tr>
                    <tr>
                      <td>Minerva Hooper</td>
                      <td>Curaçao</td>
                      <td>Sinaai-Waas</td>
                      <td className="text-center">$23,789</td>
                    </tr>
                    <tr>
                      <td>Sage Rodriguez</td>
                      <td>Netherlands</td>
                      <td>Baileux</td>
                      <td className="text-center">$56,142</td>
                    </tr>
                    <tr>
                      <td>Philip Chaney</td>
                      <td>Korea, South</td>
                      <td>Overland Park</td>
                      <td className="text-center">$38,735</td>
                    </tr>
                    <tr>
                      <td>Doris Greene</td>
                      <td>Malawi</td>
                      <td>Feldkirchen in Kärnten</td>
                      <td className="text-center">$63,542</td>
                    </tr>
                    <tr>
                      <td>Mason Porter</td>
                      <td>Chile</td>
                      <td>Gloucester</td>
                      <td className="text-center">$78,615</td>
                    </tr>
                    <tr>
                      <td>Jon Porter</td>
                      <td>Portugal</td>
                      <td>Gloucester</td>
                      <td className="text-center">$98,615</td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row> */}
      </div>
    </>
  );
}

export default Dashboard;
