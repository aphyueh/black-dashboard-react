# CCRWebsite

CCRWebsite is a frontend user interface for a color cast removal web application. Built with React and styled using the Black Dashboard React template, the UI provides image upload, processing feedback, history tracking, and histogram visualizations, all integrated with a backend server via API calls configured through environment variables.

## ✨ Features

- **Image Upload and Color Cast Removal**
  - Upload any image from your local device.
  - Send it to the backend API for automated color cast removal.
  - Processed image is returned and displayed with comparison.

- **Notifications System**
  - In-app alerts for:
    - ⚙️ *Processing Info*: Displays when image processing starts.
    - ✅ *Success*: Indicates successful image processing.
    - ❌ *Error*: Shown when backend fails to respond or processing fails.

- **History Tracking**
  - View the last 10 uploaded and processed image results.
  - Includes thumbnails for input and output images.
  - Re-access any of the recent images without re-uploading.

- **RGB Histogram Visualization**
  - Toggleable histograms comparing input vs output images.
  - Displays Red, Green, and Blue channel distribution curves.
  - Useful for evaluating the effect of color cast removal.

- **Responsive Dashboard UI**
  - Clean layout with side navigation.
  - Mobile-friendly, responsive design.
  - Dark-themed interface.

## 📁 Project Structure

```plaintext
CCRWebsite/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Logo, images
│   ├── components/         # Image cards, sliders, histograms, notifications
│   ├── layouts/            # Main dashboard layout
│   ├── views/
│   │   ├── Dashboard.js    # Main page with upload, compare, histogram
│   │   ├── History.js      # History page with last 10 processed images
│   │   └── Notifications.js# Notification triggers and handlers
│   └── index.js            # App entry point
├── .env                    # Backend API base URL
├── Dockerfile              # Docker deployment file
├── package.json            # Project metadata and scripts
├── genezio.yaml            # Genezio deployment settings
└── README.md               # You're here!

Getting Started
Prerequisites
Node.js (v14+ recommended)

npm (v6+)

Installation
Clone the Repository

bash
Copy code
git clone https://github.com/aphyueh/CCRWebsite.git
cd CCRWebsite
Install Dependencies

bash
Copy code
npm install
Environment Setup

Create a .env file in the project root with the following:

env
Copy code
REACT_APP_API_BASE_URL=http://your-backend-url.com
Replace with your actual backend API base URL.

Run Locally

bash
Copy code
npm start
Visit http://localhost:3000 in your browser.

🐳 Docker Deployment
Build and run the application using Docker:

bash
Copy code
docker build -t ccrwebsite .
docker run -p 80:80 ccrwebsite
Then navigate to http://localhost in your browser.

🚀 Genezio Deployment
If using Genezio:

bash
Copy code
genezio deploy
Requires the Genezio CLI to be installed and configured.

📦 Scripts
npm start – Run in development mode.

npm run build – Compile and optimize for production.

npm test – Launch test runner.

npm run eject – Eject CRA config (use with caution).

📊 Advanced Features
✅ Notifications
Real-time alerts guide the user during interactions:

Info: Image is being processed.

Success: Output image received.

Error: Failed request or unexpected result.

Implemented using the react-notification-alert package.

🕓 Image History (Last 10)
Maintains a local state record of the 10 most recent image processing sessions.

Stored in memory during the session.

Available on the "History" page.

🌈 RGB Histogram
Uses canvas rendering to draw histograms of R/G/B values.

Visually compare image channels before and after processing.

Accessible via the toggle in the dashboard.

📜 License
This project is licensed under the MIT License.

## Acknowledgements
- Black Dashboard React

- React

- Bootstrap 4

Reactstrap

