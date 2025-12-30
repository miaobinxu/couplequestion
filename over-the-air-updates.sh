#!/bin/bash

read -p "Enter the update message: " message
eas update --channel production --message "$message"