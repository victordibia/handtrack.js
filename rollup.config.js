
import resolve from 'rollup-plugin-node-resolve';

export default {
    input: 'src/index.js',
    output: {
      file: 'srcdist/index.js',
      format: 'umd',
      name: 'handTrack',
    },
    plugins: [ resolve() ]
  }