import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import postcssUrl from 'postcss-url';
import html from "rollup-plugin-html";
import copy from 'rollup-plugin-copy';

export default {
    input: 'src/cardigan.ts',
    output: [{
            file: pkg.main,
            format: 'cjs'
        },
        {
            file: pkg.module,
            format: 'es'
        }
    ],
    external: [
        ...Object.keys(pkg.dependencies || {})
    ],
    plugins: [
        typescript({ typescript: require('typescript') }),
        postcss({
            modules: {
                camelCase: true,
                generateScopedName: '[name]__[local]___[hash:base64:5]'
            },
            plugins: [
                autoprefixer(),
                postcssUrl({ url: 'inline', encodeType: 'base64' }),
                cssnano()
            ]
        }),
        copy({
            targets: [
                { src: ['src/components/*.css', 'src/components/*.json'], dest: 'dist' },
            ]
        }),
        html(),
        terser({
            mangle: false
        })
    ]
}