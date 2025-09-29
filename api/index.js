// This is the entry point for Vercel serverless functions
let app;

module.exports = async (req, res) => {
  if (!app) {
    // Initialize the app only once
    const initializeApp = (await import("../dist/serverless.js")).default;
    app = await initializeApp();
  }

  return app(req, res);
};
