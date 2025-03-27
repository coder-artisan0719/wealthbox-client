import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
} from '@mui/material';
import { getWealthboxUsers, syncWealthboxUsers, updateUserOrganization, getOrganizations } from '../services/api';
import { WealthboxUser, Organization } from '../types';
import { usePagination } from '../contexts/PaginationContext';

const Users: React.FC = () => {
  const { paginationState, updateUsersPagination } = usePagination();
  const [wealthboxUsers, setWealthboxUsers] = useState<WealthboxUser[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingUser, setEditingUser] = useState<WealthboxUser | null>(null);
  const [filterOrgId, setFilterOrgId] = useState<string | number>(paginationState.users.selectedOrgId);
  const [assignOrgId, setAssignOrgId] = useState<number>(organizations[0]?.id || 0);
  const [openDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(paginationState.users.page);
  const [rowsPerPage, setRowsPerPage] = useState(paginationState.users.rowsPerPage);

  const fetchOrganizations = async () => {
    try {
      const data = await getOrganizations();
      setOrganizations(data);
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
    }
  };

  const truncateName = (name: string | undefined) => {
    if (!name) return '-';
    return name.length > 20 ? `${name.substring(0, 20)}...` : name;
  };
  
  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchWealthboxUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getWealthboxUsers(filterOrgId);
      setWealthboxUsers(data);
    } catch (error) {
      console.error('Failed to fetch Wealthbox users:', error);
      setError('Failed to fetch Wealthbox users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWealthboxUsers();
  }, [filterOrgId]);

  const handleSyncUsers = async () => {
    setSyncLoading(true);
    setError('');
    setSuccess('');
    try {
      const result = await syncWealthboxUsers();
      setSuccess(`Successfully synced ${result.count} users from Wealthbox`);
      fetchWealthboxUsers();
    } catch (error) {
      console.error('Failed to sync Wealthbox users:', error);
      setError('Failed to sync Wealthbox users');
    } finally {
      setSyncLoading(false);
    }
  };

  const handleOpenOrgDialog = (user: WealthboxUser) => {
    setEditingUser(user);
    setAssignOrgId(user.organizationId ? Number(user.organizationId) : 0);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setAssignOrgId(0);
  };

  const handleUpdateOrganization = async () => {
    if (!editingUser || !assignOrgId) return;
    
    setError('');
    setSuccess('');
    
    try {
      await updateUserOrganization(editingUser.id, assignOrgId as number);
      setSuccess('User organization updated successfully');
      fetchWealthboxUsers();
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to update user organization:', error);
      setError('Failed to update user organization');
    }
  };

  const handleOrgChange = (value: string | number) => {
    setFilterOrgId(value);
    updateUsersPagination({ selectedOrgId: value });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    updateUsersPagination({ page: newPage });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    updateUsersPagination({ 
      rowsPerPage: newRowsPerPage,
      page: 0 
    });
  };

  const paginatedUsers = wealthboxUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Wealthbox Users</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Organization</InputLabel>
            <Select
              value={filterOrgId}
              label="Organization"
              onChange={(e) => handleOrgChange(e.target.value)}
            >
              <MenuItem value="all">All Organizations</MenuItem>
              {organizations.map((org) => (
                <MenuItem key={org.id} value={org.id}>
                  {truncateName(org.name)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleSyncUsers}
            disabled={syncLoading}
          >
            {syncLoading ? 'Syncing...' : 'Sync with Wealthbox'}
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="70px">No</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Account</TableCell>
                  <TableCell>Organization</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((wbUser, index) => (
                    <TableRow key={wbUser.id}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{wbUser.name}</TableCell>
                      <TableCell>{wbUser.email}</TableCell>
                      <TableCell>{wbUser.account || '-'}</TableCell>
                      <TableCell>
                        {truncateName(organizations.find(org => org.id === Number(wbUser.organizationId))?.name)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleOpenOrgDialog(wbUser)}
                        >
                          Assign Organization
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No users found. Please sync with Wealthbox.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={wealthboxUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Assign Organization</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <Select
              value={assignOrgId}
              onChange={(e) => setAssignOrgId(e.target.value as number)}
              displayEmpty
            >
              {organizations.map((org) => (
                <MenuItem key={org.id} value={org.id}>
                  {truncateName(org.name)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleUpdateOrganization} 
            variant="contained"
            disabled={!assignOrgId}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;