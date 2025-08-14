import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import Header from './Header';
import Sidebar from './Sidebar';
import { setSidebarOpen } from '../../store/slices/uiSlice';

const Layout = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { sidebarOpen } = useSelector((state) => state.ui);

  const handleSidebarToggle = () => {
    dispatch(setSidebarOpen(!sidebarOpen));
  };

  const sidebarWidth = 280;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Header */}
      <Header onSidebarToggle={handleSidebarToggle} />

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => dispatch(setSidebarOpen(false))}
        width={sidebarWidth}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 8, // Account for header height
          pl: isMobile ? 0 : sidebarOpen ? `${sidebarWidth}px` : 0,
          transition: theme.transitions.create(['padding-left'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
        }}
      >
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
