'use client'
import { getAllEventRegistrations } from '@/app/actions/getAllEventRegistration';
import { getAllSportTypes } from '@/app/actions/getAllSportTypes';
import useSportsmenModal from '@/hooks/useSportsmenModal';
import { IEventRegistrationResponse } from '@/types/eventRegistrationTypes';
import { IGender } from '@/types/genderTypes';
import { ISportType } from '@/types/sportTypeTypes';
import { Autocomplete, Box, Button, InputLabel, Modal, TextField, Typography } from '@mui/material'
import axios from 'axios';
import { CircleFadingPlus, CircleX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { FC, useEffect, useState } from 'react'
import { Controller, FieldValues, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
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


interface CreateSportsmenModalProps {
  genders: IGender[]
  eventRegistrationTypes: IEventRegistrationResponse[]
}

const CreateSportsmenModal: FC<CreateSportsmenModalProps> = ({ genders, eventRegistrationTypes }) => {
  const { open, handleClose } = useSportsmenModal()
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const { register, control, reset, formState: { errors }, handleSubmit } = useForm({
    mode: 'onChange',
  });
  const [options, setOptions] = useState(eventRegistrationTypes.filter((option) => option.event.status === true));
  const [page, setPage] = useState(1);
  const router = useRouter()

  useEffect(() => {
    loadOptions(page + 1);
  }, [page]);




  const loadOptions = async (page: number) => {
    const newOptions = await getAllEventRegistrations(page);
    setOptions((prevOptions) => [...prevOptions, ...newOptions]);
  };
  
  const handleScroll = (event: any) => {
    const bottom =
      event.target.scrollHeight - event.target.scrollTop ===
      event.target.clientHeight;
    if (bottom) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleInputChange = (id: number, type: string, value: string) => {
    setSelectedOptions(prevOptions =>
      prevOptions.map(option =>
        option.id === id ? { ...option, [type]: value } : option
      )
    );
  };



  const { fields, append, remove } = useFieldArray({
    control,
    name: 'inputs'
  });


  const handleDelete = (optionToDelete: any) => {
    setSelectedOptions(selectedOptions.filter(option => option !== optionToDelete));
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const newData = {
      name: data.name,
      family_name: data.surname,
      gender_id: data.gender.id,
      chest_number: data.bib,
      birth: data.birth,
      address: data.address,
      coaches: data.input1.map((item: any, index: number) => {
        return {
          gender_id: 2,
          name: item.value,
          family_name: data.input2[index].value
        };
      }),
      sportsmen_disciplines: selectedOptions.map((option: any) => (
        {
          name: option.label.replace(/^[^,]+, /, ""),
          pb: option.pb,
          sb: option.sb
        }
      )),
      event_registration: selectedOptions.map((option: any) => (
        {
          id: option.id
        }
      ))
    }
    const res = await axios.post('/api/sportsmens', newData)

    if (res.status === 200) {
      handleClose()
      reset()
      toast.success('Спортсмен добавлен')
      setSelectedOptions([]);
      router.refresh()
    } else {
      toast.error('Спортсмен не добавлен')
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
        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: 'center', mb: 5 }}>
          Добавление спортсмена
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box sx={{ width: '50%' }}>
              <InputLabel sx={{ mb: 2 }} htmlFor="name">Имя</InputLabel>
              <TextField {...register('name', { required: true })} type="text" fullWidth name="name" id="name" placeholder='Имя' />
            </Box>
            <Box sx={{ width: '50%' }}>
              <InputLabel sx={{ mb: 2 }} htmlFor="surname">Фамилия</InputLabel>
              <TextField {...register('surname', { required: true })} type="text" fullWidth name="surname" id="surname" placeholder='Фамилия' />
            </Box>
          </Box>
          <Box sx={{ mt: 2 }}>
            <InputLabel sx={{ mb: 2 }} htmlFor="address">Регион</InputLabel>
            <TextField {...register('address', { required: true })} type="text" fullWidth name="address" id="address" placeholder='Регион (например: Ташкент)' />
          </Box>
          <Box>
            <InputLabel sx={{ mb: 2, mt: 2 }} htmlFor="gender">Выберите пол</InputLabel>
            <Controller
              rules={{ required: true }}
              name="gender"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  id='gender'
                  options={genders.map((option) => ({ id: option.id, label: `${option.name.ru}/${option.name.uz}/${option.name.en}` }))}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  getOptionLabel={(option) => option.label}
                  onChange={(event, value) => field.onChange(value)}
                  renderInput={(params) => <TextField  {...params} label="Пол" />}
                />
              )}
            />
          </Box>
          <Box>
            <InputLabel sx={{ mb: 2, mt: 2 }} htmlFor="birth">Дата рождения</InputLabel>
            <Controller
              rules={{ required: true }}
              name="birth"
              control={control}
              render={({ field }) => (
                <TextField
                  type="date"
                  id='birth'
                  {...field}
                  sx={{ width: '100%' }}
                />
              )}
            />
          </Box>
          <Box>
            <InputLabel sx={{ mb: 2, mt: 2 }} htmlFor="bib">Нагрудной номер</InputLabel>
            <TextField {...register('bib', { required: true })} type="number" inputProps={{ min: 0 }} fullWidth name="bib" id="bib" placeholder='Нагрудной номер' />
          </Box>
          <Box sx={{ my: 3 }}>
            <InputLabel sx={{ mb: 2, mt: 2 }} htmlFor="coachSurname">ФИО тренера</InputLabel>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
              {
                fields.map((field, index) => (
                  <Box sx={{ width: '100%', display: 'flex', gap: 1 }} key={field.id}>
                    <TextField
                      id='coachSurname'
                      sx={{ width: '50%' }}
                      key={field.id}
                      type="text"
                      placeholder="Фамилия"
                      {...register(`input1.${index}.value` as const, { required: true })}
                    />
                    <TextField
                      id='coachName'
                      sx={{ width: '50%' }}
                      key={field.id}
                      type="text"
                      placeholder="Имя"
                      {...register(`input2.${index}.value` as const, { required: true })}
                    />
                    <button type="button" onClick={() => remove(index)}>
                      <CircleX />
                    </button>
                  </Box>
                ))
              }
              <Button
                sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}
                type="button"
                onClick={() => {
                  append({ value: '' })
                }}
              >
                <CircleFadingPlus />
                Добавить тренера
              </Button>
            </Box>
          </Box>
          <Box>
            <InputLabel sx={{ mb: 2, mt: 2 }} htmlFor="sportType">Выберите соревнование</InputLabel>
            <Controller
              name="sportType"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  ListboxProps={{
                    onScroll: handleScroll
                  }}
                  id='sportType'
                  options={options.map((option) => ({ id: option.id, label: `${option.event.name.ru}, ${option.name.ru}`, gender_id: option.gender_id }))}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  getOptionLabel={(option) => option.label}
                  onChange={(event, value) => {
                    field.onChange(value)
                    if (value && !selectedOptions.includes(value)) {
                      if (value && !selectedOptions.some(selectedOption => selectedOption.id === value.id)) {
                        setSelectedOptions([...selectedOptions, { ...value, sb: '', pb: '' }]);
                      }
                    }
                  }}
                  renderInput={(params) => <TextField {...params} label="Вид" />}
                />
              )}
            />
            {selectedOptions.map((option, index) => (
              <Box sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }} key={index}>
                <Typography sx={{ mb: 1 }} component='p'>{option.label.toUpperCase()}:</Typography>
                <Box sx={{ display: 'flex', gap: 0.7, alignItems: 'center' }}>
                  <InputLabel sx={{ mb: 2 }} htmlFor="pb">PB</InputLabel>
                  <TextField
                    id='pb'
                    label={`PB`}
                    value={option.pb}
                    onChange={(e) => handleInputChange(option.id, 'pb', e.target.value)}

                  />
                  <InputLabel sx={{ mb: 2 }} htmlFor="sb">SB</InputLabel>
                  <TextField
                    id='sb'
                    label={`SB`}
                    value={option.sb}
                    onChange={(e) => handleInputChange(option.id, 'sb', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => handleDelete(option)}
                  >
                    <CircleX />
                  </button>
                </Box>
              </Box>
            ))}
          </Box>
          <Button sx={{ width: '100%', mt: 4 }} type='submit' variant='contained'>Создать</Button>
        </form>
      </Box>
    </Modal>
  )
}

export default CreateSportsmenModal