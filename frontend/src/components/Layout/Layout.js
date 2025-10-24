import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';

import Header from './Header';
import Sidebar from './Sidebar';
import BackendStatus from '../Common/BackendStatus';
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
          minHeight: 'calc(100vh - 64px)', // Subtract header height
          marginTop: '64px', // Account for fixed header height
          marginLeft: isMobile ? 0 : sidebarOpen ? '280px' : 0,
          paddingTop: '16px', // Add padding to create space below header
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
            p: 2, // Proper padding for content
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        >
          <BackendStatus />
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
