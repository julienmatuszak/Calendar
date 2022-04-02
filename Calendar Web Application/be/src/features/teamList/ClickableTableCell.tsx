import { TableCell } from '@mui/material';
import { User } from '../userList/usersSlice';
import React, { useState } from 'react';
import EditTeamForm from './EditTeamForm';

export default function TeamTableCel({
  id,
  name,
  users,
}: {
  id: number | undefined;
  name: string;
  users: User[];
}) {
  const [open, setOpen] = useState(false);
  const handleEditing = () => {
    setOpen(true);
  };

  return (
    <>
      <TableCell
        onClick={handleEditing}
        sx={{ color: '#404CFA', fontWeight: '600', '&:hover': { cursor: 'pointer' } }}
      >
        {name}
      </TableCell>
      <EditTeamForm id={id} name={name} teamUsers={users} open={open} setOpen={setOpen} />
    </>
  );
}
