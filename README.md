# 🍕 Smooth Pizza Counter
### Real-Time Pizza Detection System — Vexel Innovations

[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://python.org)
[![OpenCV](https://img.shields.io/badge/OpenCV-4.x-green)](https://opencv.org)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen)]()

---

## Overview

**Smooth Pizza Counter** is a computer-vision system that detects, tracks, and counts pizzas on a production line in real time. Built for Vexel Innovations, it eliminates manual counting errors, provides live throughput data, and integrates with existing factory dashboards through a simple web interface.

---

## Demo

▶️ [Watch the live detection demo](docs/images/pizza.mp4)

---

## Screenshots

| Login | Live Detection |
|-------|----------------|
| ![Login Page](docs/images/login.png) | ![Live Detection](docs/images/live_detection.png) |

| Detection Detail | System Overview |
|-----------------|-----------------|
| ![Detection Detail](docs/images/detection_detail.png) | ![System Overview](docs/images/sys.png) |

---

## Features

- Real-time pizza detection using a trained YOLO model
- Automatic counter increments per detected unit
- Web-based dashboard (login-protected)
- Session logging with timestamps
- Configurable confidence threshold and ROI zone
- Supports USB cameras and RTSP streams

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Detection | YOLOv8 / OpenCV |
| Backend | Python 3.8+, Flask |
| Frontend | HTML5, CSS3, JavaScript |
| Auth | Flask-Login + bcrypt |
| Logging | CSV / SQLite |
| Deployment | Windows (BAT launchers), Linux-compatible |

---

## Repo Structure

```
Smooth-Pizza-Counter/
├── app/
│   ├── main.py               # Flask app entry point
│   ├── detector.py           # YOLO inference + counting logic
│   ├── auth.py               # Login / session handling
│   ├── config.py             # Central config (camera, threshold, etc.)
│   └── templates/
│       ├── login.html
│       └── dashboard.html
├── models/
│   └── pizza_yolo.pt         # Trained YOLOv8 weights
├── scripts/
│   ├── BUILD_DEV.bat
│   ├── BUILD_PROD.bat
│   ├── BUILD_TEST.bat
│   ├── BUILD_INSTALL.bat
│   └── BUILD_CLEAN.bat
├── docs/
│   └── images/               # Screenshots used in this README
├── tests/
│   └── test_detector.py
├── requirements.txt
├── .env.example
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── SECURITY.md
├── TERMS.md
├── LICENSE
└── README.md
```

---

## Setup

### 1. Clone

```bash
git clone https://github.com/Uszkido/Smooth-Pizza-Counter.git
cd Smooth-Pizza-Counter
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure

Copy `.env.example` to `.env` and fill in your values:

```env
CAMERA_INDEX=0          # 0 = default USB cam; or rtsp://... for IP cam
CONFIDENCE=0.55         # Detection confidence threshold (0.0 – 1.0)
SECRET_KEY=changeme     # Flask session secret
ADMIN_PASSWORD=changeme # Dashboard login password
```

### 4. Run

```bash
python app/main.py
```

Then open `http://localhost:5000` in your browser.

---

## BAT Launchers (Windows)

All scripts live in `scripts/`. Run from the **project root**:

| Script | Purpose |
|--------|---------|
| `BUILD_DEV.bat` | Launch in development mode (debug on) |
| `BUILD_PROD.bat` | Launch in production mode |
| `BUILD_TEST.bat` | Run test suite |
| `BUILD_INSTALL.bat` | Install / update dependencies |
| `BUILD_CLEAN.bat` | Remove cache, logs, temp files |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Security

To report a vulnerability, see [SECURITY.md](SECURITY.md).

## Code of Conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Terms

See [TERMS.md](TERMS.md).

---

*© 2026 Vexel Innovations. All rights reserved. See [LICENSE](LICENSE) for terms.*
