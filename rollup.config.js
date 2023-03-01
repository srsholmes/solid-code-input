import withSolid from 'rollup-preset-solid';
import postcss from 'rollup-plugin-postcss';

export default withSolid({
  targets: ['esm', 'cjs'],
  input: 'src/index.tsx',
  plugins: [
    postcss({
      include: ['**/*.module.css', '**/*.scss'],
      // extract: 'dist/source/components/CodeInput/styles.module.css',
      // extract: false,
      modules: true,
    }),
  ],
});
