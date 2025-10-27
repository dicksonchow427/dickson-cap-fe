const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to read JSON file
async function readJsonFile(filename) {
  try {
    const filePath = path.join(__dirname, 'public', 'data', filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    throw error;
  }
}

// Helper function to write JSON file
async function writeJsonFile(filename, data) {
  try {
    const filePath = path.join(__dirname, 'public', 'data', filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Successfully wrote ${filename}`);
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw error;
  }
}

// API Routes

// Get all recognitions
app.get('/api/recognitions', async (req, res) => {
  try {
    const recognitions = await readJsonFile('recognition.json');
    res.json(recognitions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recognitions' });
  }
});

// Save recognitions
app.post('/api/recognitions', async (req, res) => {
  try {
    const newRecognition = req.body;
    const recognitions = await readJsonFile('recognition.json');
    
    // Add new recognition to the beginning of the array
    recognitions.unshift(newRecognition);
    
    // Write back to file
    await writeJsonFile('recognition.json', recognitions);
    
    res.json({ success: true, recognition: newRecognition });
  } catch (error) {
    console.error('Error saving recognition:', error);
    res.status(500).json({ error: 'Failed to save recognition' });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await readJsonFile('users.json');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user badge counts
app.put('/api/users/:userId/badges', async (req, res) => {
  try {
    const { userId } = req.params;
    const { badgeId, type } = req.body; // type: 'given' or 'received'
    
    const users = await readJsonFile('users.json');
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const badgeArray = type === 'given' ? users[userIndex].given_badges : users[userIndex].received_badges;
    const badge = badgeArray.find(b => b.id === badgeId);
    
    if (badge) {
      badge.number += 1;
      
      // Write back to file
      await writeJsonFile('users.json', users);
      
      res.json({ success: true, user: users[userIndex] });
    } else {
      res.status(404).json({ error: 'Badge not found' });
    }
  } catch (error) {
    console.error('Error updating user badges:', error);
    res.status(500).json({ error: 'Failed to update user badges' });
  }
});

// Update like status
app.put('/api/recognitions/:recognitionId/like', async (req, res) => {
  try {
    const { recognitionId } = req.params;
    const { userId } = req.body;
    
    const recognitions = await readJsonFile('recognition.json');
    const recognitionIndex = parseInt(recognitionId) - 1;
    
    if (recognitionIndex < 0 || recognitionIndex >= recognitions.length) {
      return res.status(404).json({ error: 'Recognition not found' });
    }
    
    const recognition = recognitions[recognitionIndex];
    const likeIndex = recognition.likes.findIndex(like => like.id === userId);
    
    if (likeIndex > -1) {
      // Remove like
      recognition.likes.splice(likeIndex, 1);
    } else {
      // Add like
      recognition.likes.push({ id: userId });
    }
    
    // Write back to file
    await writeJsonFile('recognition.json', recognitions);
    
    res.json({ success: true, recognition });
  } catch (error) {
    console.error('Error updating like:', error);
    res.status(500).json({ error: 'Failed to update like' });
  }
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('API endpoints:');
  console.log('  GET  /api/recognitions - Get all recognitions');
  console.log('  POST /api/recognitions - Save new recognition');
  console.log('  GET  /api/users - Get all users');
  console.log('  PUT  /api/users/:userId/badges - Update user badge counts');
  console.log('  PUT  /api/recognitions/:recognitionId/like - Update like status');
});
