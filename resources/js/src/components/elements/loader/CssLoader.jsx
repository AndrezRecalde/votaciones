import cx from 'clsx';
import { forwardRef } from 'react';
import { Box } from '@mantine/core';
import classes from '../../../assets/styles/modules/loader/LoaderCustom.module.css';

export const CssLoader = forwardRef(({ className, ...others }, ref) => (
  <Box component="span" className={cx(classes.loader, className)} {...others} ref={ref} />
));
