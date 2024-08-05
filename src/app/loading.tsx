'use client'
import { Box } from '@mui/material'
import React from 'react'
import { GridLoader } from 'react-spinners'

const loading = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <GridLoader color="#1976d2" />
    </Box>
  )
}

export default loading