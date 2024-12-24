import cx from 'clsx';
import { Container, DEFAULT_THEME, Loader, createTheme, mergeMantineTheme } from '@mantine/core';
import classes from "./assets/styles/Container.module.css";
import { CssLoader } from './components';

export const themeOrverride = createTheme({
  /* Put your mantine theme override here */
  //fontFamilyMonospace: 'Monaco, Courier, monospace',
  fontFamily: 'Poppins, Greycliff CF, sans-serif',
  headings: { fontFamily: 'Poppins, Greycliff CF, sans-serif' },
  primaryColor: 'indigo',
  components: {
    Container: Container.extend({
      classNames: (_, { size }) => ({
        root: cx({ [classes.responsiveContainer]: size === 'responsive' }),
      }),
    }),
    Loader: Loader.extend({
        defaultProps: {
          loaders: { ...Loader.defaultLoaders, custom: CssLoader },
          type: 'custom',
        },
      }),
  },
});

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOrverride);
