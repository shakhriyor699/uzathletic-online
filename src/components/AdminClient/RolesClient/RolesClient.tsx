'use client'
import { IRoles } from '@/types/rolesTypes'
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import axios from 'axios'
import { Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { FC } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface RolesClientProps {
  roles: IRoles[]
}

const RolesClient: FC<RolesClientProps> = ({ roles }) => {
  const { register, handleSubmit, reset } = useForm({
    mode: 'onChange'
  })
  const router = useRouter()





  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const res = await axios.post('/api/roles', data)
    if (res.status === 200) {
      toast.success('Роль создана')
    } else {
      toast.error('Произошла ошибка при создании роли')
    }
    router.refresh()
    reset()
  }

  const handleDelete = async (id: number) => {
    await axios.delete(`/api/roles/${id}`)
    toast.success('Роль удалена')
    router.refresh()
  }



  return (
    <div className='flex w-full gap-40'>
      <Box className='w-1/2'>
        <Typography variant='h4' sx={{ mb: 3, textAlign: 'center' }}>Создание роли</Typography>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5  m-auto'>
          <TextField {...register('name', { required: true })} label='Название роли' />
          <TextField {...register('display_name', { required: true })} label='Описание роли' />
          <button className='p-2 w-1/4 m-auto bg-black text-white rounded-md' type='submit'>Создать</button>
        </form>
      </Box>
      <Box className='w-1/2'>
        <Typography variant='h4' sx={{ mb: 3, textAlign: 'center' }}>Список ролей</Typography>
        <Paper sx={{ width: '100%' }}>
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>Название роли</TableCell>
                  <TableCell>Описание роли</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  roles.map((role, index) => (
                    <TableRow key={role.id}>
                      <TableCell>{role.name !== 'admin' && role.name}</TableCell>
                      <TableCell>{role.display_name !== 'Administrator' && role.display_name}</TableCell>
                      {index === 0 ? (
                        <TableCell></TableCell>
                      ) : (
                        <TableCell sx={{ display: 'flex', gap: 2 }}>
                          {/* <Pencil className='cursor-pointer' size={20} color='blue' /> */}
                          <Trash2 onClick={() => handleDelete(role.id)} className='cursor-pointer' color='red' />
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </div>
  )
}

export default RolesClient