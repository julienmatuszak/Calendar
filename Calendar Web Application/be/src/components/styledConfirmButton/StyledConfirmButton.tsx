import { Button } from '@mui/material';
import React from 'react';

const StyledConfirmButton = (props: any) => {
  const { sx, ...restProps } = props;

  return (
    <Button
      sx={{
        '&:hover': {
          backgroundColor: '#404CFA',
          color: '#FFFFFF',
        },
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        float: 'right',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        padding: '6px 6px 6px 8px',
        background: '#FFFFFF',
        borderRadius: '4px',
        fontFamily: 'Poppins',
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: '13px',
        lineHeight: '16px',
        letterSpacing: '1.25px',
        textTransform: 'uppercase',
        color: '#404CFA',
        ...props?.sx,
      }}
      {...restProps}
    >
      {props.children}
    </Button>
  );
};

export default StyledConfirmButton;
