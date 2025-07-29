#!/bin/bash

# Auto-Redeploy Script for Replit
# This script helps track when redeployment is needed

echo "🔄 Checking deployment status..."

# Check if there are changes since last deployment
if [ -f ".last-deploy-time" ]; then
    LAST_DEPLOY=$(cat .last-deploy-time)
    echo "📅 Last deployment: $LAST_DEPLOY"
else
    echo "❗ No deployment history found"
fi

# Get current timestamp
CURRENT_TIME=$(date)

echo "🕐 Current time: $CURRENT_TIME"
echo ""
echo "🚀 To update your deployment:"
echo "1. Go to Deployments tab in your Replit workspace"
echo "2. Click the 'Redeploy' button"
echo "3. Wait for deployment to complete"
echo ""
echo "📝 Your deployment URL will then show the latest changes:"
echo "   https://mam-non-thaonguyen-xanh-congtycophan676.replit.app"

# Save current time for tracking
echo "$CURRENT_TIME" > .last-deploy-time

echo ""
echo "✅ Run this script after each significant change to track redeployment needs"