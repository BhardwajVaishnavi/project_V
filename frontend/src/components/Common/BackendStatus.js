import React, { useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Typography,
  Collapse,
  IconButton
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { checkBackendHealth, checkAuthStatus } from '../../utils/healthCheck';

const BackendStatus = () => {
  const [backendStatus, setBackendStatus] = useState({ healthy: null, checking: true });
  const [authStatus, setAuthStatus] = useState({ authenticated: null, checking: true });
  const [expanded, setExpanded] = useState(false);
  const [lastCheck, setLastCheck] = useState(null);

  const checkStatus = async () => {
    setBackendStatus({ healthy: null, checking: true });
    setAuthStatus({ authenticated: null, checking: true });

    const [backend, auth] = await Promise.all([
      checkBackendHealth(),
      checkAuthStatus()
    ]);

    setBackendStatus({ ...backend, checking: false });
    setAuthStatus({ ...auth, checking: false });
    setLastCheck(new Date());
  };

  useEffect(() => {
    checkStatus();
    
    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (healthy, checking) => {
    if (checking) return <RefreshIcon className="rotating" />;
    if (healthy === true) return <CheckCircleIcon color="success" />;
    if (healthy === false) return <ErrorIcon color="error" />;
    return <WarningIcon color="warning" />;
  };

  const getStatusColor = (healthy, checking) => {
    if (checking) return 'info';
    if (healthy === true) return 'success';
    if (healthy === false) return 'error';
    return 'warning';
  };

  const getStatusText = (healthy, checking, type) => {
    if (checking) return `Checking ${type}...`;
    if (healthy === true) return `${type} OK`;
    if (healthy === false) return `${type} Error`;
    return `${type} Unknown`;
  };

  // Don't show if both are healthy
  if (backendStatus.healthy && authStatus.authenticated && !expanded) {
    return null;
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Alert 
        severity={
          !backendStatus.healthy ? 'error' : 
          !authStatus.authenticated ? 'warning' : 
          'info'
        }
        action={
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton
              size="small"
              onClick={checkStatus}
              disabled={backendStatus.checking || authStatus.checking}
            >
              <RefreshIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setExpanded(!expanded)}
            >
              <ExpandMoreIcon 
                sx={{ 
                  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s'
                }}
              />
            </IconButton>
          </Box>
        }
      >
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Typography variant="body2">
            System Status:
          </Typography>
          
          <Chip
            icon={getStatusIcon(backendStatus.healthy, backendStatus.checking)}
            label={getStatusText(backendStatus.healthy, backendStatus.checking, 'Backend')}
            color={getStatusColor(backendStatus.healthy, backendStatus.checking)}
            size="small"
          />
          
          <Chip
            icon={getStatusIcon(authStatus.authenticated, authStatus.checking)}
            label={getStatusText(authStatus.authenticated, authStatus.checking, 'Auth')}
            color={getStatusColor(authStatus.authenticated, authStatus.checking)}
            size="small"
          />
          
          {lastCheck && (
            <Typography variant="caption" color="text.secondary">
              Last check: {lastCheck.toLocaleTimeString()}
            </Typography>
          )}
        </Box>

        <Collapse in={expanded}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Detailed Status:
            </Typography>
            
            <Box sx={{ ml: 2 }}>
              <Typography variant="body2">
                <strong>Backend:</strong> {
                  backendStatus.healthy ? 
                    '✅ Connected and responding' : 
                    `❌ ${backendStatus.error || 'Not responding'}`
                }
              </Typography>
              
              <Typography variant="body2">
                <strong>Authentication:</strong> {
                  authStatus.authenticated ? 
                    '✅ Valid session' : 
                    `❌ ${authStatus.reason || 'Not authenticated'}`
                }
              </Typography>
              
              {backendStatus.data && (
                <Typography variant="body2">
                  <strong>Server:</strong> {backendStatus.data.status} (Uptime: {Math.floor(backendStatus.data.uptime)}s)
                </Typography>
              )}
            </Box>

            {!backendStatus.healthy && (
              <Alert severity="error" sx={{ mt: 1 }}>
                <Typography variant="body2">
                  <strong>Backend Server Issue:</strong><br/>
                  {backendStatus.code === 'SERVER_DOWN' && 
                    'The backend server is not running. Please start it with: cd backend && node server.js'
                  }
                  {backendStatus.code === 'TIMEOUT' && 
                    'The backend server is not responding. Please check if it\'s running properly.'
                  }
                  {backendStatus.code === 'UNKNOWN' && 
                    `Unknown error: ${backendStatus.error}`
                  }
                </Typography>
              </Alert>
            )}

            {!authStatus.authenticated && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                <Typography variant="body2">
                  <strong>Authentication Issue:</strong><br/>
                  {authStatus.reason === 'NO_CREDENTIALS' && 
                    'No login credentials found. Please log in.'
                  }
                  {authStatus.reason === 'TOKEN_EXPIRED' && 
                    'Your session has expired. Please log in again.'
                  }
                  {authStatus.reason === 'INVALID_TOKEN' && 
                    'Invalid session token. Please log in again.'
                  }
                </Typography>
              </Alert>
            )}
          </Box>
        </Collapse>
      </Alert>

      <style jsx>{`
        .rotating {
          animation: rotate 1s linear infinite;
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
};

export default BackendStatus;
