import React from 'react';

const StyledHeader = (props: any) => {
  const { text, ...restProps } = props;
  return (
    <h1
      style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '28px', letterSpacing: '-1.5px' }}
      {...restProps}
    >
      {' '}
      {props.children}
    </h1>
  );
};

export default StyledHeader;
