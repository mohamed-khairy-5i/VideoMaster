import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing JSON
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// API routes for Netlify functions simulation
app.post('/api/video/info', (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({
      success: false,
      error: 'الرجاء تقديم رابط الفيديو',
      code: 'MISSING_URL'
    });
  }
  
  // Mock video info response
  const mockResponse = {
    success: true,
    data: {
      id: 'mock_video_' + Date.now(),
      title: 'فيديو تجريبي - تم تحليل الرابط بنجاح! ✅',
      description: 'هذا فيديو تجريبي لاختبار وظائف التحميل. الموقع يعمل بشكل صحيح والتصميم الجديد يبدو رائعاً.',
      uploader: 'قناة VidCatch Pro التجريبية',
      uploader_id: 'test_channel',
      duration: 180, // 3 minutes
      view_count: 1234567,
      like_count: 98765,
      upload_date: '20241201',
      thumbnail: 'https://via.placeholder.com/640x360/2563EB/FFFFFF?text=VidCatch+Pro+Test',
      extractor: 'test',
      extractor_key: 'TEST',
      webpage_url: url,
      formats: [
        {
          format_id: '1080p',
          ext: 'mp4',
          width: 1920,
          height: 1080,
          fps: 30,
          vcodec: 'avc1',
          acodec: 'mp4a',
          filesize: 104857600, // 100MB
          quality: '1080p',
          format_note: 'Full HD'
        },
        {
          format_id: '720p',
          ext: 'mp4',
          width: 1280,
          height: 720,
          fps: 30,
          vcodec: 'avc1',
          acodec: 'mp4a',
          filesize: 52428800, // 50MB
          quality: '720p',
          format_note: 'HD'
        },
        {
          format_id: '480p',
          ext: 'mp4',
          width: 854,
          height: 480,
          fps: 30,
          vcodec: 'avc1',
          acodec: 'mp4a',
          filesize: 31457280, // 30MB
          quality: '480p',
          format_note: 'SD'
        },
        {
          format_id: 'audio_mp3_320',
          ext: 'mp3',
          abr: 320,
          acodec: 'mp3',
          filesize: 7340032, // 7MB
          quality: 'Audio MP3 (320kbps)',
          format_note: 'High Quality Audio'
        },
        {
          format_id: 'audio_mp3_128',
          ext: 'mp3',
          abr: 128,
          acodec: 'mp3',
          filesize: 2949120, // 2.8MB
          quality: 'Audio MP3 (128kbps)',
          format_note: 'Standard Audio'
        }
      ],
      categories: ['التكنولوجيا'],
      tags: ['تجربة', 'اختبار', 'فيديو', 'تحميل'],
      age_limit: 0,
      is_live: false,
      availability: 'public'
    },
    timestamp: new Date().toISOString(),
    message: 'تم تحليل الفيديو بنجاح'
  };
  
  // Simulate processing delay
  setTimeout(() => {
    res.json(mockResponse);
  }, 1000);
});

app.post('/api/video/download', (req, res) => {
  const { url, format, quality } = req.body;
  
  if (!url) {
    return res.status(400).json({
      success: false,
      error: 'الرجاء تقديم رابط الفيديو',
      code: 'MISSING_URL'
    });
  }
  
  // Mock download response
  const fileFormat = format || 'mp4';
  const videoQuality = quality || '720p';
  const fileSize = videoQuality === '1080p' ? 104857600 : 
                   videoQuality === '720p' ? 52428800 : 
                   videoQuality === '480p' ? 31457280 : 10485760;
  
  const mockResponse = {
    success: true,
    data: {
      downloadUrl: `https://example.com/download/vidcatch_test_${Date.now()}.${fileFormat}`,
      filename: `video_${Date.now()}.${fileFormat}`,
      filesize: fileSize,
      filesizeFormatted: `${Math.round(fileSize / 1048576)} MB`,
      format: fileFormat,
      quality: videoQuality,
      platform: 'test',
      expiresIn: 3600,
      expiresAt: new Date(Date.now() + 3600000).toISOString()
    },
    message: 'تم تحضير الملف بنجاح! (هذا رابط تجريبي للاختبار)',
    instructions: {
      ar: 'هذا موقع تجريبي - في الإنتاج الحقيقي سيتم تحميل الملف الفعلي',
      en: 'This is a test site - real download will work in production'
    },
    timestamp: new Date().toISOString()
  };
  
  // Simulate processing delay
  setTimeout(() => {
    res.json(mockResponse);
  }, 1500);
});

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback - serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'حدث خطأ في الخادم',
    code: 'SERVER_ERROR'
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ VidCatch Pro server running on http://0.0.0.0:${port}`);
  console.log(`📱 Ready to test video download functionality`);
  console.log(`🚀 Enhanced UI and improved performance`);
});