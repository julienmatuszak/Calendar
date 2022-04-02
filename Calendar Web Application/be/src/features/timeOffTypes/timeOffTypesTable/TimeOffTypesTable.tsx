import React from 'react';
import { TableContainer, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

import { TimeOffTypeRow } from '../timeOffTypeRow/TimeOffTypeRow';
import { NewTypeRow } from '../newTimeOffType/NewTimeOffType';
import { useAppSelector } from '../../../app/hooks';
import {
  selectTimeOffTypes,
  selectIsAddNewType,
  selectTimeOffTypesGetState,
} from '../timeOffTypesSlice';

export default function TimeOffTypeTable() {
  const timeOffTypes = useAppSelector(selectTimeOffTypes);
  const isAddNewType = useAppSelector(selectIsAddNewType);
  const timeOffTypesGetState = useAppSelector(selectTimeOffTypesGetState);

  const renderUnavailableServiceMessage = (state: string) => {
    if (state === 'error') {
      return (
        <TableRow>
          <TableCell colSpan={2}>Time Off Types Service is currently unavailable</TableCell>
        </TableRow>
      );
    }
  };
  return (
    <TableContainer sx={{ borderTop: 'solid 1px #21212120' }}>
      <Table>
        <TableHead>
          <TableRow
            sx={{
              background:
                'linear-gradient(0deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), #c2c9d1',
            }}
          >
            <TableCell sx={{ width: '43px' }}></TableCell>
            <TableCell
              sx={{
                fontFamily: 'Open Sans',
                fontWeight: 600,
                fontSize: 12,
                lineHeight: '16px',
                paddingTop: '14px',
                paddingBottom: '6px',
                paddingRight: 0,
                color: 'rgba(0, 0, 0, 0.5)',
              }}
            >
              Description
            </TableCell>
          </TableRow>
        </TableHead>
        {renderUnavailableServiceMessage(timeOffTypesGetState)}
        <TableBody>
          {timeOffTypes.map((timeOffType) => (
            <TimeOffTypeRow
              key={timeOffType.id}
              id={timeOffType.id}
              name={timeOffType.name}
              color={timeOffType.color}
            />
          ))}
          {isAddNewType && <NewTypeRow />}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
