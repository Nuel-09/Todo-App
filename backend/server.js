/**
 * Todo App Server Entry Point
 * Starts the Express server on the configured PORT
 * Default: http://localhost:8080
 */

const app = require("./src/app");
const PORT = process.env.PORT || 8080;

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
