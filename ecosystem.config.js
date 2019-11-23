module.exports = {
  apps : [{
    name: 'prmon',
    script: 'index.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 3000,
      TZ: 'Europe/Ljubljana'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3012,
      TZ: 'Europe/Ljubljana'
    }
  }],

  deploy : {
    production : {
      user : 'anze',
      host : 'host.anze.xyz',
      ref  : 'origin/master',
      repo : 'prmon:fri/prmon.git',
      path : '/opt/prmon',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
