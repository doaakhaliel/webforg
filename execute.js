const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Execute code (simulated sandbox)
router.post('/', authenticateToken, (req, res) => {
  const { code, language } = req.body;
  const db = req.app.get('db');

  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  // Save execution attempt
  db.run(
    'INSERT INTO code_executions (user_id, code, language) VALUES (?, ?, ?)',
    [req.user.userId, code, language || 'javascript'],
    (err) => {
      if (err) console.error('Error saving execution:', err);
    }
  );

  // Simulate code execution (for demo)
  let output = '';
  let error = null;

  try {
    if (language === 'javascript' || language === 'js') {
      // Safe evaluation with limited scope
      const sandbox = {
        console: {
          log: (...args) => { output += args.join(' ') + '\n'; }
        }
      };
      
      // Very basic simulation - in production use VM2 or similar
      const fn = new Function('sandbox', `with(sandbox) { ${code} }`);
      fn(sandbox);
      output = output || 'Code executed successfully (no output)';
    } else {
      output = `Execution for ${language} is simulated. Your code:\n${code.substring(0, 200)}`;
    }
  } catch (e) {
    error = e.message;
  }

  res.json({
    output: error || output,
    error: error || null,
    executedAt: new Date().toISOString()
  });
});

module.exports = router;