import React, { useState } from 'react';
import { TableCell, TableRow } from '@mui/material';
import { TimeOffType } from '../timeOffTypesSlice';
import { ColoredCell } from '../coloredCell/ColoredCell';
import { EditTypeRow } from '../editTimeOffType/EditTimeOffType';
import DeleteTimeOffType from '../deleteTimeOffType/DeleteTimeOffType';

export function TimeOffTypeRow({ id, name, color }: TimeOffType) {
  const [editable, setEditable] = useState<boolean>(false);

  const handleEditRow = () => {
    setEditable(true);
  };

  return !editable ? (
    <TableRow key={id} sx={{ '&:last-child td': { borderBottom: 0 }, padding: 0 }}>
      <ColoredCell color={'#' + color} name={name}></ColoredCell>
      <TableCell
        sx={{
          fontFamily: 'Open Sans',
          fontWeight: 400,
          fontSize: 12,
          lineHeight: '16px',
          borderRight: 'none',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: '10px 16px 10px 16px',
        }}
      >
        <span
          style={{ width: '75%' }}
          className="time_off_types__editable_name"
          onClick={handleEditRow}
        >
          {name}
        </span>
        <DeleteTimeOffType id={id!} />
      </TableCell>
    </TableRow>
  ) : (
    <EditTypeRow id={id} name={name} color={color} setEditable={setEditable} />
  );
}
