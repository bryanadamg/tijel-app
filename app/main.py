# app.py
from flask import Flask, jsonify, render_template
import psutil
import subprocess
from mcstatus import JavaServer


app = Flask(__name__)

def get_cpu_temperature():
    try:
        with open("/sys/class/thermal/thermal_zone0/temp", "r") as f:
            temp = int(f.read()) / 1000
            print(temp)
            return round(temp, 1)
    except Exception as e:
        print(f"Error reading temperature: {e}")
        return None

def get_disk_usage():
    usage = psutil.disk_usage("/")
    total = usage.total // (1024 ** 3)
    used = usage.used // (1024 ** 3)
    percent = usage.percent
    return f"{used}GB / {total}GB ({percent}%)"

@app.route('/api/status')
def status():
    return jsonify({
        'temperature': get_cpu_temperature(),
        'cpu_percent': psutil.cpu_percent(interval=1),
        'ram_percent': psutil.virtual_memory().percent,
        'disk_usage': get_disk_usage()
    })

@app.route("/api/minecraft")
def minecraft_status():
    try:
        server = JavaServer.lookup("mc.tijel.xyz:28804")
        status = server.status()
        return jsonify({
            "online": True,
            "players": status.players.online,
            "max_players": status.players.max,
            "version": status.version.name,
            "motd": status.description
        })
    except Exception as e:
        return jsonify({
            "online": False,
            "error": str(e)
        })

@app.route("/coin-pusher")
def coin_pusher():
    return render_template("coin_pusher.html")


@app.route('/')
def index():
    return render_template('index.html')  # this will load templates/index.html

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
