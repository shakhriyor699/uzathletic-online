'use client'
import { Box, Button, Card, CardContent, Checkbox, CircularProgress, FormControlLabel, TextField, Typography } from '@mui/material'
import axios from 'axios'
import { LogIn } from 'lucide-react'
import React, { FC, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import useUser from '@/hooks/useUser'


const LoginClient: FC = () => {
  const { register, handleSubmit, reset } = useForm({
    mode: 'onChange',
  })
  const { setUser }: any = useUser();
  const [loginining, setLoginining] = useState(false)
  const router = useRouter()


  const onSubmit = async (data: any) => {
    setLoginining(true)
    try {
      const { data: res } = await axios.post('/api/login', data)
      const role = res['user-data'].role.name
      setUser(res['user-data'])
      if (role === 'admin') {
        router.replace('/admin')
      }
      if (role === 'judge' || role === 'operator') {
        router.replace('/user')
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoginining(false)
    }

  }

  return (
    <Box className='user h-screen flex flex-col items-center justify-center'>
      <Card sx={{ minWidth: 350 }}>
        <CardContent>
          <Box className='bg-[purple] rounded-full w-10 h-10 flex items-center justify-center mx-auto'>
            <LogIn size={30} color='#fff' />
          </Box>
          <Typography variant="h5" className='text-center mt-5'>
            Вход
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
            <TextField
              {...register('email')}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoFocus
            />
            <TextField
              type='password'
              {...register('password')}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="password"
              label="Пароль"
              name="password"

            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Запомнить меня"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className='mt-5'
            >
              {loginining ? <CircularProgress color="secondary" /> : 'Войти'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default LoginClient