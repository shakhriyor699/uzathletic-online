'use client'
import useEventCreateModal from '@/hooks/useEventCreateModal'
import { IGetUser } from '@/types/userTypes'
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import axios from 'axios'
import { Pen, Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { FC } from 'react'
import { toast } from 'sonner'

interface UsersClientProps {
  users: IGetUser[]
}

const UsersClient: FC<UsersClientProps> = ({ users }) => {
  const { handleOpen, handleClose } = useEventCreateModal()
  const router = useRouter()

  const onDelete = async (id: number) => {
    const res = await axios.delete(`/api/users/${id}`)
    if (res.status === 200) {
      toast.success('Пользователь успешно удален')
    }
    handleClose()
    router.refresh()
  }


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ height: 400, width: '70%' }}>
        <Typography variant='h4' sx={{ mb: 3 }}>Пользователи</Typography>
        <Button onClick={handleOpen} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, marginLeft: 'auto' }} variant='contained'>
          <Pen size={15} />
          Создать
        </Button>
        <Paper sx={{ width: '100%' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>Имя</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Роль</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  Array.isArray(users) && users.map((user) => (
                    <TableRow
                      key={user.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>
                        {user.name}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role.display_name}</TableCell>
                      <TableCell sx={{ display: 'flex', gap: 3 }}>
                        <Pencil className='cursor-pointer' size={20} color='blue' />
                        <Trash2 onClick={() => onDelete(user.id)} className='cursor-pointer' size={20} color='red' />
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  )
}

export default UsersClient