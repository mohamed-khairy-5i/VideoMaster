/**
 * Video Service
 * Handles video information extraction and download using yt-dlp-like functionality
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const NodeCache = require('node-cache');

// Cache for video information (5 minutes TTL)
const infoCache = new NodeCache({ stdTTL: 300 });

class VideoService {
  constructor() {
    this.supportedPlatforms = [
      'youtube.com',
      'youtu.be', 
      'tiktok.com',
      'instagram.com',
      'facebook.com',
      'fb.watch',
      'twitter.com',
      'x.com',
      'vimeo.com',
      'dailymotion.com',
      'reddit.com',
      'streamable.com',
      'twitch.tv'
    ];
  }

  /**
   * Check if URL is supported
   */
  isSupportedUrl(url) {
    try {
      const urlObj = new URL(url);
      return this.supportedPlatforms.some(platform => 
        urlObj.hostname.includes(platform) || 
        urlObj.hostname.replace('www.', '').includes(platform)
      );
    } catch (error) {
      return false;
    }
  }

  /**
   * Get video information without downloading
   */
  async getVideoInfo(url) {
    // Check cache first
    const cacheKey = `info_${Buffer.from(url).toString('base64')}`;
    const cached = infoCache.get(cacheKey);
    if (cached) {
      console.log('📋 Video info retrieved from cache');
      return cached;
    }

    if (!this.isSupportedUrl(url)) {
      throw new Error('Unsupported URL or platform');
    }

    try {
      // Simulate video info extraction (in production, would use yt-dlp)
      const videoInfo = await this.simulateVideoExtraction(url);
      
      // Cache the result
      infoCache.set(cacheKey, videoInfo);
      
      return videoInfo;
    } catch (error) {
      console.error('❌ Error getting video info:', error.message);
      throw new Error(`Failed to extract video information: ${error.message}`);
    }
  }

  /**
   * Simulate video extraction for demo purposes
   * In production, this would use actual yt-dlp
   */
  async simulateVideoExtraction(url) {
    return new Promise((resolve) => {
      // Simulate processing time
      setTimeout(() => {
        const urlObj = new URL(url);
        const platform = this.identifyPlatform(urlObj.hostname);
        
        // Generate realistic video information
        const videoInfo = {
          id: uuidv4(),
          url: url,
          title: `Sample Video from ${platform}`,
          description: 'This is a sample video description for demonstration purposes.',
          thumbnail: `https://via.placeholder.com/640x360.png?text=${platform}+Video`,
          duration: 180, // 3 minutes
          uploader: `Sample Creator`,
          upload_date: '20240826',
          view_count: Math.floor(Math.random() * 1000000),
          platform: platform,
          formats: this.generateFormats(platform),
          available_qualities: ['144p', '240p', '360p', '480p', '720p', '1080p'],
          audio_formats: ['mp3', 'm4a', 'webm'],
          filesize_approx: {
            '360p': '25MB',
            '720p': '85MB', 
            '1080p': '180MB',
            'mp3': '4MB'
          }
        };

        resolve(videoInfo);
      }, 1000); // Simulate 1 second processing time
    });
  }

  /**
   * Identify platform from hostname
   */
  identifyPlatform(hostname) {
    const platformMap = {
      'youtube.com': 'YouTube',
      'youtu.be': 'YouTube',
      'tiktok.com': 'TikTok',
      'instagram.com': 'Instagram',
      'facebook.com': 'Facebook',
      'fb.watch': 'Facebook',
      'twitter.com': 'Twitter',
      'x.com': 'Twitter',
      'vimeo.com': 'Vimeo',
      'dailymotion.com': 'Dailymotion',
      'reddit.com': 'Reddit',
      'streamable.com': 'Streamable',
      'twitch.tv': 'Twitch'
    };

    for (const [domain, platform] of Object.entries(platformMap)) {
      if (hostname.includes(domain)) {
        return platform;
      }
    }

    return 'Unknown Platform';
  }

  /**
   * Generate available formats for different platforms
   */
  generateFormats(platform) {
    const baseFormats = [
      {
        format_id: '18',
        ext: 'mp4',
        quality: '360p',
        width: 640,
        height: 360,
        filesize: 26214400, // ~25MB
        fps: 30,
        vcodec: 'avc1',
        acodec: 'mp4a'
      },
      {
        format_id: '22',
        ext: 'mp4', 
        quality: '720p',
        width: 1280,
        height: 720,
        filesize: 89128960, // ~85MB
        fps: 30,
        vcodec: 'avc1',
        acodec: 'mp4a'
      }
    ];

    // Add platform-specific formats
    if (platform === 'YouTube') {
      baseFormats.push({
        format_id: '137',
        ext: 'mp4',
        quality: '1080p',
        width: 1920,
        height: 1080,
        filesize: 188743680, // ~180MB
        fps: 30,
        vcodec: 'avc1',
        acodec: 'mp4a'
      });
    }

    return baseFormats;
  }

  /**
   * Generate download URL (simulated)
   */
  async generateDownloadUrl(url, format = 'mp4', quality = '720p') {
    const videoInfo = await this.getVideoInfo(url);
    
    // Find matching format
    const selectedFormat = videoInfo.formats.find(f => 
      f.quality === quality && f.ext === format
    );

    if (!selectedFormat) {
      throw new Error(`Format ${quality} ${format} not available for this video`);
    }

    // In production, this would return actual download URL from yt-dlp
    const downloadUrl = `https://demo-download-server.com/download/${videoInfo.id}/${selectedFormat.format_id}`;
    
    return {
      downloadUrl,
      filename: `${videoInfo.title.replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 50)}.${format}`,
      filesize: selectedFormat.filesize,
      quality: quality,
      format: format,
      expires: new Date(Date.now() + 3600000).toISOString() // 1 hour
    };
  }

  /**
   * Get supported platforms list
   */
  getSupportedPlatforms() {
    return this.supportedPlatforms.map(domain => ({
      domain,
      name: this.identifyPlatform(domain),
      supported_formats: ['mp4', 'webm', 'mp3'],
      max_quality: domain.includes('youtube') ? '4K' : '1080p'
    }));
  }

  /**
   * Clear cache
   */
  clearCache() {
    infoCache.flushAll();
    console.log('🗑️ Video info cache cleared');
  }
}

module.exports = new VideoService();