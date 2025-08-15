import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';

import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const sidebarWidth = 280;
  const sidebarOpen = !isMobile; // Always open on desktop, closed on mobile

  return (
    <Box
      className={`layout-container ${!sidebarOpen ? 'sidebar-closed' : ''}`}
      sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}
    >
      {/* Header */}
      <Header />

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => {}} // No close functionality - always open
        width={sidebarWidth}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <Box
        component="main"
        className="main-content"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: isMobile ? '100%' : sidebarOpen ? 'calc(100% - 280px)' : '100%',
          minHeight: '100vh',
          marginTop: '64px', // Account for header height
          marginLeft: isMobile ? 0 : sidebarOpen ? '280px' : 0, // Use margin for proper positioning
          transition: theme.transitions.create(['margin-left', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          backgroundColor: theme.palette.background.default,
          overflow: 'auto',
        }}
      >
        <Box
          className="form-container"
          sx={{
            flex: 1,
            p: 0.5, // Further reduced padding
            pl: 1, // Minimal left padding
            pr: 1, // Minimal right padding
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
            margin: 0,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
