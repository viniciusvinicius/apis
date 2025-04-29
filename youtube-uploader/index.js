require('dotenv').config();
const express = require('express');
const fs      = require('fs');
const { google } = require('googleapis');

const app = express();
app.use(express.json({ limit: '50mb' }));

// rota de health-check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// rota principal de upload
app.post('/upload', async (req, res) => {
  try {
    const {
      client_id, client_secret, refresh_token,
      filePath, title, description, tags, privacyStatus = 'public'
    } = req.body;

    if (!client_id || !client_secret || !refresh_token || !filePath || !title) {
      return res.status(400).json({
        error: 'client_id, client_secret, refresh_token, filePath e title são obrigatórios'
      });
    }

    // cria cliente OAuth2 dinâmico
    const oauth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      'urn:ietf:wg:oauth:2.0:oob'
    );
    oauth2Client.setCredentials({ refresh_token });

    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    const result = await youtube.videos.insert({
      part: ['snippet','status'],
      requestBody: {
        snippet: { title, description, tags },
        status:  { privacyStatus }
      },
      media: { body: fs.createReadStream(filePath) }
    });

    res.json({
      success: true,
      id:     result.data.id,
      url:    `https://youtu.be/${result.data.id}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`YouTube-uploader listening on port ${PORT}`);
});
