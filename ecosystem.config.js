module.exports = {
  apps: [{
    name: 'vidcatch-pro',
    script: 'server.js',
    cwd: process.cwd(),
    env: {
      NODE_ENV: 'production',
      PORT: process.env.PORT || 3000,
      HOST: '0.0.0.0'
    },
    watch: false,
    instances: 1,
    autorestart: true,
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    merge_logs: true
  }]
};