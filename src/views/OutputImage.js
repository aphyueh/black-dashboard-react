// OutputImage.js
import React from "react";

const OutputImage = ({ processedImageUrl, adjustedImageUrl, mode = 'adjusted' }) => {
  const imageToDisplay =
    mode === 'processed' ? processedImageUrl : adjustedImageUrl;

  return (
    <div>
      <h5 className="card-category">
        {mode === 'processed' ? 'Processed Image' : 'Adjusted Image'}
      </h5>
      {imageToDisplay ? (
        <img
          src={imageToDisplay}
          alt={mode === 'processed' ? "Processed" : "Adjusted"}
          style={{ width: "100%", maxHeight: "300px", objectFit: "contain" }}
        />
      ) : (
        <p>No {mode} image yet</p>
      )}
    </div>
  );
};


export default OutputImage;
