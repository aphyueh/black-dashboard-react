// src/views/Settings.js
import React from "react";

export default function Settings({ settings, onChange }) {
  const sliders = [
    { label: "Brightness", key: "brightness" },
    { label: "Contrast", key: "contrast" },
    { label: "Saturation", key: "saturation" },
    { label: "Temperature", key: "temperature" },
  ];

  return (
    <div className="settings-panel">
      {sliders.map(({ label, key }) => (
        <div className="slider-group" key={key}>
          <label>
            {label}: {settings[key]}
            <input
              type="range"
              min={-100}
              max={100}
              step={1}
              value={settings[key]}
              onChange={(e) => onChange(key, Number(e.target.value))}
            />
          </label>
        </div>
      ))}
    </div>
  );
}
