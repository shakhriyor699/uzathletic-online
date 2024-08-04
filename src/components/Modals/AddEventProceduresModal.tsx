'use client'
import useEventProceduresModal from '@/hooks/useAddEventProceduresModal';
import useEventRegistrationCreateModal from '@/hooks/useEventRegistrationCreateModal';
import { IEventProcedure } from '@/types/eventProcedures';
import { Box, Button, FormControl, InputLabel, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material'
import axios from 'axios';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { FC } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  height: 700,
  overflow: 'auto',
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
};

interface AddEventProceduresModalProps {
  eventProcedures: IEventProcedure[]
}

const AddEventProceduresModal: FC<AddEventProceduresModalProps> = ({ eventProcedures }) => {
  const { open, handleClose } = useEventProceduresModal()
  const { handleOpen } = useEventRegistrationCreateModal()
  const { register, handleSubmit, reset, control, setValue } = useForm<FieldValues>({
    mode: 'onChange'
  })
  const router = useRouter()

  const handleCloseModal = () => {
    handleClose()
    handleOpen()
  }

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const newData = {
      name: {
        uz: data.nameuz,
        ru: data.nameru,
        en: data.nameen
      },
      type: {
        uz: data.nameuz,
        ru: data.nameru,
        en: data.nameen
      }
    }
    const res = await axios.post('/api/eventProcedures', newData)
    router.refresh()
    if (res.status === 200) {
      toast.success('Этап добавлен')
    } else {
      toast.error('Произошла ошибка при добавлении этапа')

    }
    reset()
  }

  const handleDelete = async (id: string | undefined) => {
    const res = await axios.delete(`/api/eventProcedures/${id}`)
    router.refresh()
    if (res.status === 200) {
      toast.success('Этап удален')
    } else {
      toast.error('Произошла ошибка при удалении этапа')
    }
  }


  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Button
          onClick={handleCloseModal}
          sx={{ position: 'absolute', top: 10, left: 10, fontWeight: 'bold' }}
        >
          <ChevronLeft />
          Вернуться назад
        </Button>
        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: 'center' }}>
          Добавление нового этапа
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <InputLabel id="demo-simple-select-label" htmlFor='nameuz'>Название этапа</InputLabel>
            <TextField {...register('nameuz', { required: true })} name="nameuz" id="name" type="text" variant="outlined" sx={{ width: '100%' }} placeholder="Название этапа uz" />
            <TextField {...register('nameru', { required: true })} name="nameru" id="name" type="text" variant="outlined" sx={{ width: '100%' }} placeholder="Название этапа ru" />
            <TextField {...register('nameen', { required: true })} name="nameen" id="name" type="text" variant="outlined" sx={{ width: '100%' }} placeholder="Название этапа en" />
            <Button type='submit' variant="contained">Сохранить</Button>
          </Box>
        </form>
        <Box sx={{ mt: 4 }}>
          <Paper sx={{ width: '100%' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      Название
                    </TableCell>
                    <TableCell>
                      Управление
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {eventProcedures
                    .map((row) => {
                      return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                          <TableCell>
                            {row.name.ru}
                          </TableCell>
                          <TableCell>
                            <Button onClick={() => handleDelete(row.id)} type='button'><Trash2 color="red" /></Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            {/* <TablePagination
                rowsPerPageOptions={[15]}
                component="div"
                count={events.filter(row => row.status === 1).length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              /> */}
          </Paper>
        </Box>
      </Box>
    </Modal>
  )
}

export default AddEventProceduresModal