'use client'
import useEventCreateModal from '@/hooks/useEventCreateModal';
import { IRoles } from '@/types/rolesTypes';
import { Autocomplete, Box, Button, InputLabel, Modal, TextField, Typography } from '@mui/material'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { FC } from 'react'
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form';
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

interface CreateUserModalProps {
  roles: IRoles[]
}
const CreateUserModal: FC<CreateUserModalProps> = ({ roles }) => {
  const { register, handleSubmit, reset, control, formState: { errors }, watch } = useForm({
    mode: 'onChange',
  })
  const { open, handleClose } = useEventCreateModal()
  const password = watch('password', '');
  const router = useRouter()

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const { confirmPassword, ...restData } = data;
    const newData = {
      ...restData,
      role_id: data.role.id,
      password_confirmation: confirmPassword
    }
    const res = await axios.post('/api/users', newData)
    if (res.status === 200) {
      toast.success('Пользователь успешно создан')
    }
    reset()
    handleClose()
    router.refresh()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: 'center', mb: 5 }}>
          Добавление пользователя
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-col gap-5'>
          <TextField {...register('name', { required: true })} id="1" label="Имя" variant="outlined" sx={{ width: '100%' }} />
          <TextField {...register('email', { required: true })} id="2" label="Email" variant="outlined" sx={{ width: '100%' }} />
          <TextField {...register('password', {
            required: 'Пароль обязателен', minLength: {
              value: 6,
              message: 'Минимальная длина пароля 6 символов',
            }
          })} type='password' id="3" label="Пароль" variant="outlined" sx={{ width: '100%' }} />
          {errors.password && <p className='text-red-500'>Пароль должен содержать минимум 6 символов</p>}
          <TextField {...register('confirmPassword', {
            required: 'Подтверждение пароля обязательно',
            validate: (value) =>
              value === password || 'Пароли не совпадают',
          })}
            type='password' id="outlined-basic" label="Подтвердите пароль" variant="outlined" sx={{ width: '100%' }} />
          {errors.password && <p className='text-red-500'>Пароли не совпадают</p>}
          <Box sx={{ width: '100%' }}>
            <InputLabel sx={{ mb: 2 }} id="demo-simple-select-label">Выберите роль</InputLabel>
            <Controller
              name="role"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={roles.map((option) => ({ id: option.id, label: option.name }))}
                  getOptionLabel={(option) => option.label}
                  onChange={(event, value) => field.onChange(value)}
                  renderInput={(params) => <TextField {...params} label="Роль" />}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              )}
            />
            <Button sx={{ mt: 5 }} type='submit' variant='contained'>Создать</Button>
          </Box>
        </form>
      </Box>
    </Modal>
  )
}

export default CreateUserModal