// server.js - Node.js Express backend for AI API proxy
// Handles OpenAI and Anthropic Claude API calls securely
// Install: npm install express cors dotenv node-fetch
// Run: npm start

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve frontend files

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// ===================================
// HEALTH CHECK ENDPOINT
// ===================================
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Finance Tracker API running',
        timestamp: new Date().toISOString()
    });
});

// ===================================
// AI CHAT ENDPOINT
// Handles both OpenAI and Anthropic Claude
// ===================================
app.post('/api/ai/chat', async (req, res) => {
    try {
        const { messages, provider = 'openai' } = req.body;
        
        // Validate input
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ 
                success: false,
                error: 'Invalid request: messages array required and cannot be empty' 
            });
        }
        
        if (provider === 'openai') {
            return await handleOpenAI(messages, res);
        } else if (provider === 'anthropic') {
            return await handleAnthropic(messages, res);
        } else {
            return res.status(400).json({ 
                success: false,
                error: `Invalid provider: "${provider}". Use "openai" or "anthropic"` 
            });
        }
        
    } catch (error) {
        console.error('API Error:', error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Internal server error'
        });
    }
});

// ===================================
// OPENAI HANDLER
// ===================================
async function handleOpenAI(messages, res) {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
        return res.status(500).json({ 
            success: false,
            error: 'OpenAI API key not configured on server. Set OPENAI_API_KEY in .env'
        });
    }
    
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    
    const requestBody = {
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
        top_p: 0.9
    };
    
    try {
        console.log('📤 Calling OpenAI API...');
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error?.message || `OpenAI API error: ${response.status}`;
            console.error('❌ OpenAI Error:', errorMessage);
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        const aiMessage = data.choices[0]?.message?.content;
        
        if (!aiMessage) {
            throw new Error('No response from OpenAI');
        }
        
        console.log('✅ OpenAI response received');
        return res.json({ 
            success: true,
            provider: 'openai',
            message: aiMessage.trim()
        });
        
    } catch (error) {
        console.error('OpenAI Error:', error.message);
        return res.status(500).json({ 
            success: false,
            error: `OpenAI Error: ${error.message}`
        });
    }
}

// ===================================
// ANTHROPIC CLAUDE HANDLER
// ===================================
async function handleAnthropic(messages, res) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
        return res.status(500).json({ 
            success: false,
            error: 'Anthropic API key not configured on server. Set ANTHROPIC_API_KEY in .env'
        });
    }
    
    const apiUrl = 'https://api.anthropic.com/v1/messages';
    
    // Separate system message from user messages
    const systemMessage = messages.find(m => m.role === 'system');
    const userMessages = messages.filter(m => m.role !== 'system');
    
    const requestBody = {
        model: 'claude-3-haiku-20240307',
        max_tokens: 500,
        system: systemMessage?.content || 'You are a helpful financial advisor. Provide advice in Indian Rupees (₹). Be concise and practical.',
        messages: userMessages
    };
    
    try {
        console.log('📤 Calling Anthropic Claude API...');
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error?.message || `Claude API error: ${response.status}`;
            console.error('❌ Claude Error:', errorMessage);
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        const aiMessage = data.content[0]?.text;
        
        if (!aiMessage) {
            throw new Error('No response from Claude');
        }
        
        console.log('✅ Claude response received');
        return res.json({ 
            success: true,
            provider: 'anthropic',
            message: aiMessage.trim()
        });
        
    } catch (error) {
        console.error('Claude Error:', error.message);
        return res.status(500).json({ 
            success: false,
            error: `Claude Error: ${error.message}`
        });
    }
}

// ===================================
// FALLBACK ROUTE
// ===================================
app.use((req, res) => {
    res.status(404).json({ 
        success: false,
        error: `Route not found: ${req.path}`,
        available: ['/api/health', '/api/ai/chat']
    });
});

// ===================================
// START SERVER
// ===================================
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 Finance Tracker Backend Server Started');
    console.log('='.repeat(60));
    console.log(`📍 Server: http://localhost:${PORT}`);
    console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`💬 AI Chat Endpoint: POST http://localhost:${PORT}/api/ai/chat`);
    console.log('='.repeat(60) + '\n');
    
    // Check API keys
    const openaiKey = process.env.OPENAI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    
    console.log('🔐 API Key Status:');
    console.log(`  ✅ OpenAI:    ${openaiKey ? '✓ Configured' : '✗ Missing'}`);
    console.log(`  ✅ Anthropic: ${anthropicKey ? '✓ Configured' : '✗ Missing'}`);
    console.log();
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n⛔ Server shutting down...');
    process.exit(0);
});
