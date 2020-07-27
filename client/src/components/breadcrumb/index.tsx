import React, { memo, useEffect, useState } from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Breadcrumbs, Link } from '@material-ui/core';
import { capitalize } from '../../utils';

const uuidRegex = new RegExp(/^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-5][0-9a-f]{3}-?[089ab][0-9a-f]{3}-?[0-9a-f]{12}$/i);

export const Breadcrumb = memo(() => {
  const location = useLocation();
  const [crumbs, setCrumbs] = useState<any[]>([]);

  useEffect(() => {
    const split = location.pathname.split('/').filter(Boolean);

    const crumbs = split.map((s, idx) => {
      let prev = '/' + split.slice(0, idx).join('/');

      if (prev.endsWith('/')) {
        prev = prev.slice(0, -1);
      }

      return {
        label: uuidRegex.test(s) ? 'Details' : capitalize(s),
        ...(idx < (split.length - 1)) && {
          path: `${prev}/${s}`,
        },
      }
    });

    setCrumbs(crumbs.length > 1 ? crumbs : []);

  }, [location]);

  return (
    <Box pb={2}>
      <Breadcrumbs aria-label="breadcrumb">
        {crumbs.map(crumb => (
          crumb.path ? (
            <Link color="inherit" component={RouterLink} to={crumb.path} key={crumb.label}>
              {crumb.label}
            </Link>
          ) : (
            <Typography color="textPrimary" key={crumb.label}>{crumb.label}</Typography>
          )
        ))}
      </Breadcrumbs>
    </Box>
  )
});
