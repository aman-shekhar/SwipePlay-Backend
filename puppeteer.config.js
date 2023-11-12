module.exports = {
    launch: {
      headless: true,
      executablePath: '/usr/bin/google-chrome' || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  };
  