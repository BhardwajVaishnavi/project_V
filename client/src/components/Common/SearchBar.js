import React, { useState, useEffect } from 'react';
import {
  TextField,
  InputAdornment,
  Autocomplete,
  Box,
  Typography,
  Avatar,
  Chip,
} from '@mui/material';
import { Search, Person } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';

import { getSearchSuggestions, clearSearchSuggestions } from '../../store/slices/patientSlice';

const SearchBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchSuggestions } = useSelector((state) => state.patients);
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);

  // Debounced search function
  const debouncedSearch = debounce((query) => {
    if (query.length >= 2) {
      dispatch(getSearchSuggestions(query));
    } else {
      dispatch(clearSearchSuggestions());
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(searchValue);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchValue, debouncedSearch]);

  const handleInputChange = (event, newValue) => {
    setSearchValue(newValue);
  };

  const handleOptionSelect = (event, value) => {
    if (value && value.id) {
      navigate(`/patients/${value.id}`);
      setSearchValue('');
      setOpen(false);
    }
  };

  const formatOptionLabel = (option) => {
    return `${option.firstName} ${option.lastName} (${option.age}y, ${option.sex})`;
  };

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={searchSuggestions}
      getOptionLabel={formatOptionLabel}
      inputValue={searchValue}
      onInputChange={handleInputChange}
      onChange={handleOptionSelect}
      noOptionsText={
        searchValue.length < 2 
          ? "Type at least 2 characters to search" 
          : "No patients found"
      }
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search patients..."
          size="small"
          sx={{
            minWidth: 300,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.7)',
              },
            },
            '& .MuiInputBase-input': {
              color: 'white',
              '&::placeholder': {
                color: 'rgba(255, 255, 255, 0.7)',
                opacity: 1,
              },
            },
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
              </InputAdornment>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              <Person fontSize="small" />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" fontWeight="medium">
                {option.firstName} {option.lastName}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Chip
                  label={`${option.age}y`}
                  size="small"
                  variant="outlined"
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
                <Chip
                  label={option.sex}
                  size="small"
                  variant="outlined"
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
                <Typography variant="caption" color="text.secondary">
                  {option.patientId}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
      sx={{ width: '100%' }}
    />
  );
};

export default SearchBar;
