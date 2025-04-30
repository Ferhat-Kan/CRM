import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import InviteUsersModal from '../../components/InviteUsersModal';
import { fetchData } from '../../components/FetchData';
import { UsersUrl } from '../../services/ApiUrls';

// Yerel user tipi
interface UserType {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await fetchData(UsersUrl, 'GET', null, {
        /* headers*/
      });
      setUsers(data.users || []);
      setLoading(false);
    })();
  }, []);

  const handleInvite = async (emails: string[]) => {
    await fetchData(`${UsersUrl}/invite`, 'POST', JSON.stringify({ emails }), {
      /* headers */
    });
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        All Users
      </Typography>
      <Button variant="contained" onClick={() => setModalOpen(true)}>
        Invite Users
      </Button>
      {loading ? (
        <CircularProgress sx={{ mt: 2 }} />
      ) : (
        <Table sx={{ mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Joined On</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>
                  {new Date(u.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <InviteUsersModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSend={(emails) => handleInvite(emails)}
      />
    </Box>
  );
}
