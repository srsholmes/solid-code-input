import withSolid from 'rollup-preset-solid';
import postcss from 'rollup-plugin-postcss';

export default withSolid({
  targets: ['esm', 'cjs'],
  input: 'src/index.tsx',
  plugins: [
    postcss({
      extract: false,
      modules: true,
    }),
  ],
});
