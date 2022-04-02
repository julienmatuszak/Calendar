import { Button } from '@mui/material';
import React from 'react';

const StyledAddButton = (props: any) => {
  const { sx, ...restProps } = props;

  return (
    <Button
      sx={{
        fontFamily: 'Poppins',
        fontSize: 13,
        lineHeight: '16px',
        fontWeight: 600,
        letterSpacing: 1.25,
        color: '#404CFA',
        boxSizing: 'border-box',
        border: 'solid 1px #21212120',
        borderRadius: '4px',
        height: 36,
        padding: '6px 6px 6px 6px',
        cursor: 'auto',
        ...props?.sx,
      }}
      {...restProps}
    >
      <span className="plus" />
      {props.children}
    </Button>
  );
};

export default StyledAddButton;
