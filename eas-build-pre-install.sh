#!/bin/bash

# EAS Build pre-install script to set up Java 17
echo "Setting up Java 17 for EAS Build..."

# Set Java 17 environment variables
export JAVA_HOME="/opt/java/openjdk"
export PATH="$JAVA_HOME/bin:$PATH"

# Verify Java version
echo "Java version:"
java -version

echo "JAVA_HOME: $JAVA_HOME"
echo "Java setup complete!"
