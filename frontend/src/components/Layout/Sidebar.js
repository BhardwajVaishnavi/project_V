import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Collapse,
} from '@mui/material';
import {
  Dashboard,
  People,
  Science,
  LocalHospital,
  MedicalServices,
  Biotech,
  EventNote,
  ExpandLess,
  ExpandMore,
  Add,
  List as ListIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Sidebar = ({ open, onClose, width, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState({});

  const handleItemClick = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const handleExpandClick = (item) => {
    setExpandedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <Dashboard />,
      path: '/dashboard',
    },
    {
      title: 'Patients',
      icon: <People />,
      path: '/patients',
      children: [
        { title: 'All Patients', icon: <ListIcon />, path: '/patients' },
        { title: 'Add Patient', icon: <Add />, path: '/patients/new' },
      ],
    },
    {
      title: 'Investigations',
      icon: <Science />,
      path: '/investigations',
      children: [
        { title: 'All Investigations', icon: <ListIcon />, path: '/investigations' },
        { title: 'New Investigation', icon: <Add />, path: '/investigations/new' },
      ],
    },
    {
      title: 'Treatments',
      icon: <LocalHospital />,
      path: '/treatments',
      children: [
        { title: 'All Treatments', icon: <ListIcon />, path: '/treatments' },
        { title: 'New Treatment', icon: <Add />, path: '/treatments/new' },
      ],
    },
    {
      title: 'Surgery',
      icon: <MedicalServices />,
      path: '/surgery',
      children: [
        { title: 'All Surgeries', icon: <ListIcon />, path: '/surgery' },
        { title: 'New Surgery', icon: <Add />, path: '/surgery/new' },
      ],
    },
    {
      title: 'Liver Transplant',
      icon: <Biotech />,
      path: '/liver-transplant',
      children: [
        { title: 'All Evaluations', icon: <ListIcon />, path: '/liver-transplant' },
        { title: 'New Evaluation', icon: <Add />, path: '/liver-transplant/new' },
      ],
    },
    {
      title: 'Follow-up',
      icon: <EventNote />,
      path: '/follow-up',
      children: [
        { title: 'All Follow-ups', icon: <ListIcon />, path: '/follow-up' },
        { title: 'New Follow-up', icon: <Add />, path: '/follow-up/new' },
      ],
    },
  ];

  const drawerContent = (
    <Box sx={{ overflow: 'auto', height: '100%' }}>
      {/* Logo/Brand */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          Medical System
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Patient Management
        </Typography>
      </Box>
      
      <Divider />

      {/* Navigation Menu */}
      <List sx={{ pt: 1 }}>
        {menuItems.map((item) => (
          <React.Fragment key={item.title}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  if (item.children) {
                    handleExpandClick(item.title);
                  } else {
                    handleItemClick(item.path);
                  }
                }}
                selected={!item.children && isActive(item.path)}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 3,
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.title}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive(item.path) ? 600 : 400,
                  }}
                />
                {item.children && (
                  expandedItems[item.title] ? <ExpandLess /> : <ExpandMore />
                )}
              </ListItemButton>
            </ListItem>

            {/* Submenu */}
            {item.children && (
              <Collapse in={expandedItems[item.title]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <ListItem key={child.title} disablePadding>
                      <ListItemButton
                        onClick={() => handleItemClick(child.path)}
                        selected={isActive(child.path)}
                        sx={{
                          pl: 4,
                          minHeight: 40,
                          '&.Mui-selected': {
                            backgroundColor: 'primary.light',
                            color: 'primary.contrastText',
                            '& .MuiListItemIcon-root': {
                              color: 'primary.contrastText',
                            },
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: 2,
                            justifyContent: 'center',
                          }}
                        >
                          {child.icon}
                        </ListItemIcon>
                        <ListItemText 
                          primary={child.title}
                          primaryTypographyProps={{
                            fontSize: '0.8rem',
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={open}
      onClose={onClose}
      sx={{
        width: width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box',
          top: isMobile ? 0 : 64, // Account for header height
          height: isMobile ? '100%' : 'calc(100% - 64px)',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
