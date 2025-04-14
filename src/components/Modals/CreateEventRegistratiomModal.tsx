'use client'
import { getAllSportTypes } from '@/app/actions/getAllSportTypes';
import { getEventRegistrationById } from '@/app/actions/getEventRegistrationById';
import { useAddCitiesModal } from '@/hooks/useAddCountriesModal';
import useEventProceduresModal from '@/hooks/useAddEventProceduresModal';
import useEventRegistrationCreateModal from '@/hooks/useEventRegistrationCreateModal'
import { ICityByCountry } from '@/types/countryTypes';
import { IEventProcedure } from '@/types/eventProcedures';
import { IEventResponse } from '@/types/eventTypes';
import { ISportType } from '@/types/sportTypeTypes';
import { IGetUser } from '@/types/userTypes';
import { Autocomplete, Box, Button, Input, InputLabel, Modal, TextField, Typography } from '@mui/material'
import axios from 'axios';
import { CircleX } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { FC, useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form';
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

interface CreateEventRegistratiomModalProps {
  sportTypes: ISportType[]
  users: IGetUser[]
  eventProcedures: IEventProcedure[]
  event: IEventResponse
  cityByCountry: ICityByCountry
}

const CreateEventRegistratiomModal: FC<CreateEventRegistratiomModalProps> = ({
  sportTypes,
  users,
  eventProcedures,
  event,
  cityByCountry
}) => {
  const { open, handleClose, id } = useEventRegistrationCreateModal()
  const { handleOpen } = useEventProceduresModal()
  const { handleOpen: handleOpenAddCity } = useAddCitiesModal()
  const [options, setOptions] = useState(sportTypes);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const { register, handleSubmit, reset, control, setValue } = useForm({
    mode: 'onChange',
    // defaultValues: {
    //   sportType: ,
    //   datestart: '',
    //   dateend: '',
    //   country: cityByCountry.name.ru,
    //   city: '',
    //   judge: '',
    //   procedures: [],
    //   attempts: 0,
    //   wind: false
    // }
  })
  const params = useParams()
  const router = useRouter()



  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const data = await getEventRegistrationById(id)
        console.log(data);
        setValue('sportType', { id: data.sport_type_id, label: data.name.ru, gender_id: data.gender_id });
        setValue("datestart", data.start_time.replace(" ", "T"))
        setValue("wind", data.event_registration_setting.condition.status === 'true' ? true : false)
        setValue("city", { id: data.city.id, label: data.city.name.ru })
        data.user && setValue("judge", { id: data.user.id, label: data.user.name })
        setValue("attempts", data.attempts.length)
        if (data.event_procedures && data.event_procedures.length > 0) {
          const proceduresData = data.event_procedures.map((proc: any) => ({
            id: proc.id,
            label: proc.name.ru,
          }))
          setSelectedOptions(proceduresData)
          // setValue("procedures", proceduresData)
        }

      } else {
        reset()
      }
    }
    fetchData()
  }, [id, setValue, reset, open, router])



  useEffect(() => {
    loadOptions(80);
  }, [page]);

  const loadOptions = async (page: number) => {
    const newOptions = await getAllSportTypes(page);
    // setOptions((prevOptions) => [...prevOptions, ...newOptions]);
    setOptions(newOptions);
  };

  // const handleScroll = (event: any) => {
  //   const bottom =
  //     event.target.scrollHeight - event.target.scrollTop ===
  //     event.target.clientHeight;
  //   if (bottom) {
  //     setPage((prevPage) => prevPage + 1);
  //   }
  // };

  const handleDelete = (optionToDelete: any) => {
    const updatedOptions = selectedOptions.filter(option => option.id !== optionToDelete.id);
    setSelectedOptions(updatedOptions);
    setValue('procedures', updatedOptions);
  };

  const onSubmit = async (data: any) => {
    console.log(data);

    const newData = {
      user_id: data.judge.id,
      event_id: Number(params.eventId),
      city_id: data.city.id,
      gender_id: data.sportType.gender_id,
      sport_type_id: data.sportType.length === 1 ? data.sportType[0].id : null,
      name: {
        ru: data.sportType.label,
        uz: data.sportType.label,
        en: data.sportType.label
      },
      attempts: Number(data.attempts),
      type: data.sportType.label,
      description: '',
      start_time: data.datestart.replace('T', ' '),
      end_time: /* data.dateend.replace('T', ' ') */ '2025-01-10 10:01:12',
      condition: {
        status: String(data.wind)
      },
      condition_type: 'wind',
      procedure: selectedOptions.map((option: any) => (
        {
          name: {
            ru: option.label,
            uz: option.label,
            en: option.label
          },
          type: {
            ru: option.label,
            uz: option.label,
            en: option.label
          }
        }
      )),
      sportsmen: [],
      sport_types: data.sportType.length > 1 ? data.sportType.map((item: any) => item.id) : []
    }
    console.log(newData);


    try {
      const res = id ? await axios.put(`/api/eventRegistration/${id}`, newData) : await axios.post('/api/eventRegistration', newData)
      if (res.status === 200) {
        toast.success('Событие создано')
      }
    } catch (error) {
      toast.error('Событие не создано')
    } finally {
      reset()
      handleClose()
      router.refresh()
    }

  }

  const proceduresOptions = [
    ...eventProcedures.map((option) => ({ id: option.id, label: option.name.ru })),
    { id: 'add-new', label: 'Добавить, если нет подходящего?' }
  ];
  const cytiesOptions = [
    ...cityByCountry.cities.map((option) => ({ id: option.id, label: option.name.ru })),
    { id: 'add-new', label: 'Добавить, если нет подходящего?' }
  ];

  const handleOpenAddEventProcedure = () => {
    handleOpen()
    handleClose()
  }

  const handleOpenAddCities = () => {
    handleClose()
    handleOpenAddCity()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: 'center' }}>
          {id ? 'Редактирование типа соревнования' : 'Создание типа соревнования'}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <InputLabel id="demo-simple-select-label" htmlFor='sportType'>Тип соревнования</InputLabel>
            <Controller
              name="sportType"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  // ListboxProps={{
                  //   onScroll: handleScroll
                  // }}
                  id="sportType"
                  multiple
                  options={options.map((option) => ({
                    id: option.id,
                    label: option.sport_type_name.en,
                    gender_id: option.gender_id,
                  }))}
                  value={field.value || []}
                  isOptionEqualToValue={(option, value) => option.id === value?.id}
                  getOptionLabel={(option) => option.label || ""}
                  onChange={(event, value) => {
                    field.onChange(value)
                  }}
                  renderInput={(params) => <TextField {...params} label="Вид" />}
                />
              )}
            />
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <InputLabel sx={{ cursor: 'pointer', userSelect: 'none' }} htmlFor='wind'>Имеется ли общий ветер?</InputLabel>
              <Input sx={{ cursor: 'pointer' }} id='wind' type="checkbox" {...register('wind')} />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ width: '100%' }}>
                <InputLabel sx={{ mb: 2 }} htmlFor='datestart'>Дата начала</InputLabel>
                <TextField {...register('datestart', { required: true })} name="datestart" id="datestart" type="datetime-local" variant="outlined" sx={{ width: '100%' }} />
              </Box>
              {/* <Box sx={{ width: '50%' }}>
                <InputLabel sx={{ mb: 2 }} htmlFor='dateend'>Дата конца</InputLabel>
                <TextField {...register('dateend', { required: true })} name="dateend" id="dateend" type="datetime-local" variant="outlined" sx={{ width: '100%' }} />
              </Box> */}
            </Box>
            <Box>
              <InputLabel sx={{ mb: 2 }} id="demo-simple-select-label" htmlFor='country'>Страна</InputLabel>
              <TextField name="country" id="country" type="text" variant="outlined" sx={{ width: '100%' }} defaultValue={cityByCountry.name.ru} disabled />
            </Box>
            <Box>
              <InputLabel sx={{ mb: 2 }} id="demo-simple-select-label" htmlFor='city'>Город</InputLabel>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    id='city'
                    options={cytiesOptions}
                    value={field.value || null}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    getOptionLabel={(option) => option.label}
                    onChange={(event, value) => {
                      field.onChange(value)

                    }}
                    renderInput={(params) => <TextField {...params} label="Город" />}
                    renderOption={(props, option) => (
                      <li {...props} onClick={option.id === 'add-new' ? handleOpenAddCities : props.onClick}>
                        {option.label}
                      </li>
                    )}
                  />
                )}
              />
            </Box>
            <Box>
              <InputLabel sx={{ mb: 2 }} id="demo-simple-select-label" htmlFor='judge'>Назначение судьи</InputLabel>
              <Controller
                name="judge"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    id='judge'
                    options={users.filter((user) => user.name !== 'Admin').map((option) => ({ id: option.id, label: option.name }))}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    getOptionLabel={(option) => option.label}
                    onChange={(event, value) => {
                      field.onChange(value)
                    }}
                    renderInput={(params) => <TextField {...params} label="Судья" />}
                  />
                )}
              />
            </Box>
            <Box>
              <InputLabel sx={{ mb: 2 }} id="demo-simple-select-label" htmlFor='procedures'>Выберите этапы (если они имеются)</InputLabel>
              <Controller
                name="procedures"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    id='procedures'
                    options={proceduresOptions}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    value={field.value || null}
                    getOptionLabel={(option) => option.label}
                    onChange={(event, value) => {
                      field.onChange(value)
                      if (value && !selectedOptions.includes(value)) {
                        setSelectedOptions([...selectedOptions, value]);
                        setValue('procedures', value);
                      }
                    }}
                    renderInput={(params) => <TextField {...params} label="Этапы" />}
                    renderOption={(props, option) => (
                      <li {...props} onClick={option.id === 'add-new' ? handleOpenAddEventProcedure : props.onClick}>
                        {option.label}
                      </li>
                    )}
                  />
                )}
              />
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {selectedOptions.map((option, index) => (
                  <Box sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }} key={index}>
                    <Typography component='p'>{option.label.toUpperCase()}:</Typography>
                    <Box sx={{ display: 'flex', gap: 0.7, alignItems: 'center' }}>
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
              <Box>
                <InputLabel sx={{ my: 2 }} id="demo-simple-select-label" htmlFor='attempts'>Добавить попытки</InputLabel>
                <TextField {...register('attempts')} name="attempts" id="attempts" type="number" variant="outlined" sx={{ width: '100%' }} />
              </Box>
            </Box>
            <Button type='submit' variant='contained'>Создать</Button>
          </Box>
        </form>
      </Box>
    </Modal>
  )
}
export default CreateEventRegistratiomModal