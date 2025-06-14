# app.py
from flask import Flask, jsonify, render_template
import psutil
import subprocess

app = Flask(__name__)

def get_cpu_temperature():
    try:
        temp = subprocess.check_output(['vcgencmd', 'measure_temp']).decode()
        print(temp)
        return float(temp.split('=')[1].split("'")[0])
    except Exception as e:
        print(f"Error retrieveing CPU temperature: {e}")
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

@app.route("/coin-pusher")
def coin_pusher():
    return render_template("coin_pusher.html")


@app.route('/')
def index():
    return render_template('index.html')  # this will load templates/index.html

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
