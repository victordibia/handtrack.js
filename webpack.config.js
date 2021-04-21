const path = require("path");

const serverConfig = {
  entry: "./src/index.js",
  target: "node",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "handtrack.node.js",
  },
};

const clientConfig = {
  entry: "./src/index.js",
  target: "web",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "handtrack.min.js",
    libraryTarget: "umd",
    library: "handTrack",
  },
};

// const clientConfigDemo= {
//   entry: "./src/index.js",
//   target: "web",
//   output: {
//     path: path.resolve(__dirname, "demo"),
//     filename: "handtrack.min.js",
//     libraryTarget: "umd",
//     library: "handTrack",
//   },
// };

module.exports = [serverConfig, clientConfig];
