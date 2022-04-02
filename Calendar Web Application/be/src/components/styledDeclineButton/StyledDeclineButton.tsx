import { Button } from '@mui/material';
import React from 'react';

const StyledDeclineButton = (props: any) => {
  const { sx, ...restProps } = props;

  return (
    <Button
      sx={{
        display: 'flex',
        flexDirection: 'row',
        float: 'right',
        padding: '6px 6px 6px 8px',
        background: '#FFFFFF',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        boxSizing: 'border-box',
        borderRadius: '4px',
        fontFamily: 'Poppins',
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: '13px',
        lineHeight: '16px',
        letterSpacing: '1.25px',
        textTransform: 'uppercase',
        color: '#404CFA',
        ...sx,
      }}
      {...restProps}
    >
      {props.children}
    </Button>
  );
};

export default StyledDeclineButton;
