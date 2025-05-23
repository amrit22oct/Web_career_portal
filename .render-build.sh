#!/bin/bash

# Install backend dependencies
cd backend
npm install

# Build frontend
cd ../frontend
npm install
npm run build

# Copy build to backend
cp -r dist ../backend/dist
