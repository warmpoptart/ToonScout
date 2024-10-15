module.exports = {
    apps: [
      {
        name: 'ScoutSite', // Name of your application
        script: 'npm', // Command to run the app
        args: 'start', // Arguments to pass
        env: {
          NODE_ENV: 'production', // Set the environment to production
          PORT: 3001, // Specify the port if needed
          // Add any other environment variables here
        },
      },
    ],
  };
  