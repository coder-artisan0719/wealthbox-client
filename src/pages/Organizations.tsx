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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  TablePagination,
} from '@mui/material';
import { getOrganizations, createOrganization, updateOrganization, deleteOrganization } from '../services/api';
import { Organization } from '../types';
import { usePagination } from '../contexts/PaginationContext';

const Organizations: React.FC = () => {
  const { paginationState, updateOrganizationsPagination } = usePagination();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [page, setPage] = useState(paginationState.organizations.page);
  const [rowsPerPage, setRowsPerPage] = useState(paginationState.organizations.rowsPerPage);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [organizationToDelete, setOrganizationToDelete] = useState<number | null>(null);

  const [formErrors, setFormErrors] = useState({
    name: '',
  });

  const fetchOrganizations = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getOrganizations();
      setOrganizations(data);
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
      setError('Failed to fetch organizations');
    } finally {
      setLoading(false);
    }
  };

  const truncateName = (name: string) => {
    return name.length > 20 ? `${name.substring(0, 20)}...` : name;
  };

  const truncateDescription = (description: string | null | undefined) => {
    if (!description) return '-';
    return description.length > 20 ? `${description.substring(0, 20)}...` : description;
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleOpenDialog = (organization?: Organization) => {
    if (organization) {
      setEditingOrganization(organization);
      setFormData({
        name: organization.name,
        description: organization.description || '',
      });
    } else {
      setEditingOrganization(null);
      setFormData({
        name: '',
        description: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'name' && formErrors.name) {
      setFormErrors(prev => ({...prev, name: ''}));
    }
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!formData.name.trim()) {
      setFormErrors(prev => ({...prev, name: 'Organization name is required'}));
      return;
    }

    const nameExists = organizations.some(
      org => org.name.toLowerCase() === formData.name.trim().toLowerCase() && 
      (!editingOrganization || org.id !== editingOrganization.id)
    );

    if (nameExists) {
      setError('Organization name must be unique');
      return;
    }

    try {
      if (editingOrganization) {
        await updateOrganization(editingOrganization.id, formData);
        setSuccess('Organization updated successfully');
      } else {
        await createOrganization(formData);
        setSuccess('Organization created successfully');
      }
      handleCloseDialog();
      fetchOrganizations();
    } catch (error) {
      console.error('Failed to save organization:', error);
      setError('Failed to save organization');
    }
  };

  const handleDelete = async (id: number) => {
    setOrganizationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (organizationToDelete) {
      setError('');
      setSuccess('');
  
      try {
        await deleteOrganization(organizationToDelete);
        setSuccess('Organization deleted successfully');
        fetchOrganizations();
      } catch (error) {
        console.error('Failed to delete organization:', error);
        setError('Failed to delete organization');
      }
    }
    setDeleteDialogOpen(false);
  };
  
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    updateOrganizationsPagination({ page: newPage });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    updateOrganizationsPagination({ 
      rowsPerPage: newRowsPerPage,
      page: 0 
    });
  };

  const paginatedOrganizations = organizations.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const tableData =["no"] 

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Organizations</Typography>
        <Button variant="contained" onClick={() => handleOpenDialog()}>
          Add Organization
        </Button>
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
                  <TableCell>Description</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedOrganizations.length > 0 ? (
                  paginatedOrganizations.map((org, index) => (
                    <TableRow key={org.id}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{truncateName(org.name)}</TableCell>
                      <TableCell>{truncateDescription(org.description)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() => handleOpenDialog(org)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleDelete(org.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No organizations found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={organizations.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingOrganization ? 'Edit Organization' : 'Add Organization'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Organization Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleInputChange}
            required
            error={!!formErrors.name}
            helperText={formErrors.name}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.description}
            onChange={handleInputChange}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this organization? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={confirmDelete} 
            variant="contained" 
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Organizations;