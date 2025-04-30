import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  IconButton,
  FormControlLabel,
  Typography,
} from '@mui/material';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { fetchData } from '../../components/FetchData';
import { UsersUrl } from '../../services/ApiUrls';
import { SERVER, GoogleLoginStatusUrl } from '../../services/ApiUrls';
import { AntSwitch } from '../../components/CustomSwitch';
import axios from 'axios';

const headCells = [
  { id: 'email', label: 'Email Address' },
  { id: 'role', label: 'Role' },
  { id: 'google_login', label: 'Google Login' },
];

interface User {
  id: string;
  role: string;
  googleLoginEnabled: boolean;
  user_details: {
    id: string;
    email: string;
    profile_pic?: string;
    is_active?: boolean;
  };
}

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [googleLoginSettings, setGoogleLoginSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    getUsers();
    fetchGoogleLoginStatuses();
  }, []);

  const getUsers = async () => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org') || '',
    };

    try {
      const res = await fetchData(`${UsersUrl}/`, 'GET', null as any, Header);
      if (!res.error && res.active_users && res.active_users.active_users) {
        console.log(res.active_users.active_users, 'users');
        setUsers(res.active_users.active_users);
      } else {
        console.warn('No active users found');
        setUsers([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchGoogleLoginStatuses = async () => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org') || '',
    };

    try {
      const response = await fetchData(
        `${GoogleLoginStatusUrl}/`,
        'GET',
        null as any,
        Header
      );
      console.log('Fetched all Google login settings:', response);
      setGoogleLoginSettings(response); // Save the response to state
    } catch (error) {
      console.error('Error fetching Google login statuses:', error);
      setError('Failed to fetch Google login settings.');
    }
  };

  const toggleGoogleLogin = async (userDetailsId: string, enabled: boolean) => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org') || '',
    };

    // Prepare the data to be sent in the PUT request body
    const data = {
      user_id: userDetailsId,
      google_login_enabled: enabled,
    };

    try {
      const response = await fetchData(
        `${GoogleLoginStatusUrl}/`, // Make sure this is the correct URL
        'PUT',
        JSON.stringify(data), // The request body should be a JSON string
        Header
      );

      console.log('Update Google Login setting response:', response);
      // Update googleLoginSettings immediately instead of refetching
      setGoogleLoginSettings((prevSettings) =>
        prevSettings.map((setting) =>
          setting.user_id === userDetailsId
            ? { ...setting, google_login_enabled: enabled }
            : setting
        )
      );
      setSuccess('Google login setting updated successfully.');
      setTimeout(() => setSuccess(null), 3000); // Clear after 3 seconds
    } catch (error) {
      console.error('Error updating Google login setting:', error);
      setError('Failed to update Google login setting.');
    }
  };

  // Update the toggle button state based on the googleLoginSettings array
  const getGoogleLoginStatus = (userId: string) => {
    const userSetting = googleLoginSettings.find(
      (setting) => setting.user_id === userId
    );
    return userSetting ? userSetting.google_login_enabled : false;
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flexGrow: 1, mt: '60px', p: 3 }}>
        <Container sx={{ width: '100%' }}>
          <Paper sx={{ width: '100%', mb: 2, p: '15px' }}>
            {error && <Typography color="error">{error}</Typography>}
            {success && (
              <Typography sx={{ color: 'green', mb: 2 }}>{success}</Typography>
            )}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {headCells.map((headCell) => (
                      <TableCell key={headCell.id}>{headCell.label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4}>Loading...</TableCell>
                    </TableRow>
                  ) : users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          {user.user_details?.email || 'N/A'}
                        </TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <FormControlLabel
                            control={
                              <AntSwitch
                                checked={getGoogleLoginStatus(
                                  user.user_details.id
                                )} // Directly use state
                                onChange={(e) =>
                                  toggleGoogleLogin(
                                    user.user_details.id,
                                    e.target.checked
                                  )
                                } // Update state on toggle
                              />
                            }
                            label={
                              getGoogleLoginStatus(user.user_details.id)
                                ? 'Enabled'
                                : 'Disabled'
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4}>No users found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
