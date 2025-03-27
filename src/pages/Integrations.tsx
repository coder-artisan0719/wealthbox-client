import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { getIntegrationConfig, saveIntegrationConfig } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Integrations: React.FC = () => {
  const { user } = useAuth();
  const [apiToken, setApiToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [configLoading, setConfigLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchIntegrationConfig = async () => {
      if (!user) return;

      setConfigLoading(true);
      try {
        const config = await getIntegrationConfig('wealthbox');
        setApiToken(config.apiToken);
      } catch (error) {
        console.error('Failed to fetch integration config:', error);
      } finally {
        setConfigLoading(false);
      }
    };

    fetchIntegrationConfig();
  }, [user]);

  const handleSaveConfig = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await saveIntegrationConfig({
        integrationType: 'wealthbox',
        apiToken,
      });
      setSuccess('Wealthbox integration configured successfully');
    } catch (error) {
      console.error('Failed to save integration config:', error);
      setError('Failed to save integration configuration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Integrations
      </Typography>

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

      <Card sx={{ maxWidth: 600, mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Wealthbox CRM Integration
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Connect to your Wealthbox CRM account to sync users. You'll need an API token from your Wealthbox account.
          </Typography>
          
          {configLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <TextField
              fullWidth
              label="Wealthbox API Token"
              variant="outlined"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
              margin="normal"
              type="password"
              helperText="You can find your API token in your Wealthbox account settings"
            />
          )}
        </CardContent>
        <CardActions>
          <Button 
            variant="contained" 
            onClick={handleSaveConfig}
            disabled={loading || !apiToken}
          >
            {loading ? 'Saving...' : 'Save Configuration'}
          </Button>
        </CardActions>
      </Card>

      <Typography variant="h6" gutterBottom>
        How to get your Wealthbox API Token
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1" component="div">
          <ol>
            <li>Log in to your Wealthbox account</li>
            <li>Go to Settings &gt; API Access</li>
            <li>Generate a new API token or copy your existing token</li>
            <li>Paste the token in the field above and click Save Configuration</li>
          </ol>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Integrations;