import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import dts from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';

export default [
  // 
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named'
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        sourcemap: true
      }
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        //declaration: false,
        outDir: 'dist',
        module: 'esnext',
      })
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/bundle.global.js',
      format: 'iife',
      name: 'CollectionsJS',
      sourcemap: true,
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      
      typescript({ tsconfig: './tsconfig.json',outDir: 'dist', module: 'esnext' })
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/bundle.global.min.js',
      format: 'iife',
      name: 'CollectionsJS',
      sourcemap: false
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json',outDir: 'dist', module: 'esnext' }),
      terser() 
    ]
  },
  // typescript declaration files
  {
    input: 'lib/index.d.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es'
    },
    plugins: [dts()]
  }
];