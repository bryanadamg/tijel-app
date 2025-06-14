FROM python:3.12-slim

# Install system dependencies
RUN apt-get update -y && \
    apt-get install --no-install-recommends -y \
        git \
        libpq-dev \
        python3-dev \
        build-essential \
        libsnappy-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Run the app
CMD ["flask", "--app", "main.py", "run", "--host=0.0.0.0"]
