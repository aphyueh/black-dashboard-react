// OutputImage.js
import React from "react";

const OutputImage = ({ processedImageUrl }) => {
  return (
    <div>
      <h5 className="card-category">Processed Image</h5>
      {processedImageUrl ? (
        <img
          src={processedImageUrl}
          alt="Processed"
          style={{ width: "100%", maxHeight: "300px", objectFit: "contain" }}
        />
      ) : (
        <p>No processed image yet</p>
      )}
    </div>
  );
};

export default OutputImage;
