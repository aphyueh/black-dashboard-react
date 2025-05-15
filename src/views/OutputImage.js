// OutputImage.js

import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  CardHeader,
  CardBody,
  Row,
  Col,
} from "reactstrap";


const OutputImage = ({ processedImageUrl, adjustedImageUrl, mode = 'processed' }) => {
  const imageToDisplay =
    mode === 'processed' ? processedImageUrl : adjustedImageUrl;

  return (
    <div>
        
        <CardBody>
          {imageToDisplay ? (
            <img
            src={imageToDisplay}
            alt={mode === 'processed' ? "Processed" : "Adjusted"}
            style={{ width: "100%", maxHeight: "300px", objectFit: "contain" }}
            />
          ) : (
            <p>No {mode} image yet</p>
          )}
        </CardBody>
    </div>
  );
};


export default OutputImage;
