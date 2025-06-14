# 🌐 Raspberry Pi Web Dashboard

This project is a lightweight Flask-based web dashboard for monitoring your Raspberry Pi's system health and status in real time. It provides a simple and clean interface to display key metrics like temperature, CPU usage, RAM, and disk space.

## 📦 Features

- 📊 Live Raspberry Pi system metrics:
  - CPU temperature
  - CPU usage
  - RAM usage
  - Disk usage
- 📈 Auto-refreshing dashboard (every 5 seconds)
- 🌑 Dark-themed minimalist UI
- 🔐 Exposed securely to the public internet using **Cloudflare Tunnel**
- 🧠 Optional integration with a **Discord Bot** for horoscope lookup and chat interface

## 🖥️ Technologies Used

- [Python 3](https://www.python.org/)
- [Flask](https://flask.palletsprojects.com/)
- [psutil](https://github.com/giampaolo/psutil)
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- [Docker](https://www.docker.com/) + `docker-compose`

## 📁 Project Structure

my-site/
├── app/
│ ├── main.py # Flask app logic
│ ├── routes/ # Optional: blueprint routes
│ ├── static/
│ │ └── css/ / js/ # Static files
│ └── templates/
│ └── index.html # Web UI
├── Dockerfile # Web service container
├── docker-compose.yml # App + Cloudflared services
├── requirements.txt
└── .env # Flask and other secrets


## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/raspi-status-dashboard.git
cd raspi-status-dashboard
```

### 2. Set up Environment

Create a .env file:
```bash
FLASK_ENV=development
FLASK_APP=app/main.py
DISCORD_TOKEN=your_discord_token  # Optional
```

### 3. Run with Docker
```bash
docker-compose up --build
```

This starts both the Flask server and the Cloudflare Tunnel (if configured in docker-compose.yml).

### 4. Access Your Dashboard
Locally: http://localhost:5000

Publicly: https://your-subdomain.yourdomain.com

## ☁️ Cloudflare Tunnel
Make sure you've created a tunnel in your Cloudflare dashboard and added a CNAME DNS record pointing to the tunnel's cfargotunnel.com address. You can run the tunnel with:
```bash
cloudflared tunnel run <your-tunnel-name>
```
Or manage it through the Docker service in `docker-compose.yml`.


