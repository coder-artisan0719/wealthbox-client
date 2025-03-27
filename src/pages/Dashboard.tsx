import React from 'react';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Welcome, {user?.name}!
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 200,
              justifyContent: 'space-between',
            }}
          >
            <div>
              <Typography variant="h6" gutterBottom>
                Users
              </Typography>
              <Typography variant="body1">
                Manage users from your Wealthbox CRM
              </Typography>
            </div>
            <Button
              variant="contained"
              onClick={() => navigate('/users')}
            >
              View Users
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 200,
              justifyContent: 'space-between',
            }}
          >
            <div>
              <Typography variant="h6" gutterBottom>
                Organizations
              </Typography>
              <Typography variant="body1">
                Manage your organizations
              </Typography>
            </div>
            <Button
              variant="contained"
              onClick={() => navigate('/organizations')}
            >
              View Organizations
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 200,
              justifyContent: 'space-between',
            }}
          >
            <div>
              <Typography variant="h6" gutterBottom>
                Integrations
              </Typography>
              <Typography variant="body1">
                Configure your Wealthbox integration
              </Typography>
            </div>
            <Button
              variant="contained"
              onClick={() => navigate('/integrations')}
            >
              Configure Integrations
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;