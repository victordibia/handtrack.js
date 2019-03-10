import minify from 'rollup-plugin-babel-minify';
import resolve from 'rollup-plugin-node-resolve';
import fs from 'fs';
import path from 'path';

const copyPlugin = function (options) {
  return {
    generateBundle() {
      const targDir = path.dirname(options.targ);
      if (!fs.existsSync(targDir)) {
        fs.mkdirSync(targDir);
      }
      fs.writeFileSync(options.targ, fs.readFileSync(options.src));

    }
  };
};

export default {
  input: 'src/index.js',
  output: [{
    file: 'dist/handtrack.min.js',
    format: 'umd',
    name: 'handTrack',
  }, {
    file: 'demo/handtrack.min.js',
    format: 'umd',
    name: 'handTrack',
  }],
  plugins: [resolve(), minify()]
  // plugins: [resolve()]
  // plugins: [resolve(), copyPlugin({
  //   src: 'src/index.js',
  //   targ: 'demoreact/node_modules/handtrackjs/src/index.js'
  // })]
}