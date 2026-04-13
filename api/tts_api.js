const express = require('express');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
app.use(express.json());

app.post('/generate-audio-url', async (req, res) => {
  try {
    const { text, vachana_api_key, upload_api_key } = req.body;

    if (!text || !vachana_api_key || !upload_api_key) {
      return res.status(400).json({
        error: "text, vachana_api_key, upload_api_key are required"
      });
    }

    const ttsResponse = await axios.post(
      'https://api.vachana.ai/api/v1/tts/inference',
      {
        audio_config: {
          bitrate: "192k",
          container: "mp3",
          encoding: "linear_pcm",
          num_channels: 1,
          sample_rate: 44100,
          sample_width: 2
        },
        model: "vachana-voice-v2",
        text: text,
        voice: "sia"
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key-ID': vachana_api_key
        },
        responseType: 'arraybuffer'
      }
    );

    const formData = new FormData();
    formData.append('phone_number', '919217090193');
    formData.append('file', ttsResponse.data, {
      filename: 'audio.mp3',
      contentType: 'audio/mpeg'
    });

    const uploadResponse = await axios.post(
      'https://api.onexaura.com/wa/mediaupload',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'apikey': upload_api_key,
          'accept': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      mediaUrl: uploadResponse.data
    });

  } catch (error) {
    res.status(500).json({
      error: "Failed",
      details: error.response?.data || error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});const express = require('express');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
app.use(express.json());

app.post('/generate-audio-url', async (req, res) => {
  try {
    const { text, vachana_api_key, upload_api_key } = req.body;

    if (!text || !vachana_api_key || !upload_api_key) {
      return res.status(400).json({
        error: "text, vachana_api_key, upload_api_key are required"
      });
    }

    const ttsResponse = await axios.post(
      'https://api.vachana.ai/api/v1/tts/inference',
      {
        audio_config: {
          bitrate: "192k",
          container: "mp3",
          encoding: "linear_pcm",
          num_channels: 1,
          sample_rate: 44100,
          sample_width: 2
        },
        model: "vachana-voice-v2",
        text: text,
        voice: "sia"
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key-ID': vachana_api_key
        },
        responseType: 'arraybuffer'
      }
    );

    const formData = new FormData();
    formData.append('phone_number', '919217090193');
    formData.append('file', ttsResponse.data, {
      filename: 'audio.mp3',
      contentType: 'audio/mpeg'
    });

    const uploadResponse = await axios.post(
      'https://api.onexaura.com/wa/mediaupload',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'apikey': upload_api_key,
          'accept': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      mediaUrl: uploadResponse.data
    });

  } catch (error) {
    res.status(500).json({
      error: "Failed",
      details: error.response?.data || error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
