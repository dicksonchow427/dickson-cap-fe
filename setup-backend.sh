#!/bin/bash

echo "Setting up backend for recognition system..."

# Install backend dependencies
echo "Installing backend dependencies..."
npm install express cors nodemon --save-dev

# Create a simple start script
echo "Creating start script..."
cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "Starting backend server..."
node server.js
EOF

chmod +x start-backend.sh

echo "Backend setup complete!"
echo ""
echo "To start the backend server:"
echo "  npm run backend:start"
echo "  or"
echo "  ./start-backend.sh"
echo ""
echo "The backend will run on http://localhost:3001"
echo "Make sure to start the backend before running the frontend!"
