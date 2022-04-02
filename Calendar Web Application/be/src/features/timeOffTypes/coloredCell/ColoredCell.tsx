import React from 'react';
import { TableCell } from '@mui/material';
import './ColoredCell.css';

export function ColoredCell({ color, name }: { color: any; name: string }) {
  const newColor = color;
  const timeOffTypeLetter = name.charAt(0).toUpperCase();
  let letterColor = newColor.replace('#', '');
  let r = parseInt(letterColor.substr(0, 2), 16);
  let g = parseInt(letterColor.substr(2, 2), 16);
  let b = parseInt(letterColor.substr(4, 2), 16);
  let yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return (
    <TableCell sx={{ borderRight: 'solid 1px #21212120', padding: '6px 20px 6px 20px' }}>
      <div className="rectangle" style={{ backgroundColor: newColor }}>
        <p className="rectangle__letter" style={{ color: yiq >= 128 ? 'black' : 'white' }}>
          {timeOffTypeLetter}
        </p>
      </div>
    </TableCell>
  );
}
