'use client'
import { getAllEventRegistrations } from '@/app/actions/getAllEventRegistration';
import { getCitiesByCountryId } from '@/app/actions/getCitiesByCountry';
import useSportsmenModal from '@/hooks/useSportsmenModal';
import { ICountry } from '@/types/countryTypes';
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
  countries: ICountry[]
}

const CreateSportsmenModal: FC<CreateSportsmenModalProps> = ({
  genders,
  eventRegistrationTypes,
  countries
}) => {
  const { open, handleClose, id, sportsmanToEdit } = useSportsmenModal()
  const [selectedOptions, setSelectedOptions] = useState<any[]>(sportsmanToEdit?.sportsmen_disciplines || []);
  const { register, control, reset, formState: { errors }, handleSubmit, setValue } = useForm({
    mode: 'onChange',
  });
  const [options, setOptions] = useState(eventRegistrationTypes);
  const [cities, setCities] = useState([]);
  const [page, setPage] = useState(1);
  const router = useRouter()

  console.log(sportsmanToEdit);

  useEffect(() => {
    if (id) {
      setValue('name', sportsmanToEdit?.name)
      setValue('surname', sportsmanToEdit?.family_name)
      // { id: option.id, label: `${option.name.ru}/${option.name.uz}/${option.name.en}` }
      // const selectedOptions = sportsmanToEdit?.coaches.map((coach: any) => ({ id: coach.id, label: `${coach.name}/${coach.family_name}` }));
      // setValue('input1', selectedOptions);
      setValue('gender', { id: sportsmanToEdit?.gender.id, label: `${sportsmanToEdit?.gender.name.ru}/${sportsmanToEdit?.gender.name.uz}/${sportsmanToEdit?.gender.name.en}` })
      setValue('birth', sportsmanToEdit?.birth)
      setValue('bib', sportsmanToEdit?.chest_number)
      console.log('asd');

    }
  }, [id, sportsmanToEdit]);





  useEffect(() => {
    loadOptions(page + 1);
  }, [page]);




  const handleModalClose = () => {
    handleClose()
    reset()
  }


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





  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', ':', '.'];
    const isNumber = /^[0-9]$/.test(event.key);

    if (!isNumber && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  };



  const { fields, append, remove } = useFieldArray({
    control,
    name: 'inputs'
  });


  const handleDelete = (optionToDelete: any) => {
    setSelectedOptions(selectedOptions.filter(option => option !== optionToDelete));
  };

  const countriesOptions = [
    ...countries.map((option) => ({ id: option.id, label: option.name.ru })),
    // { id: 'add-new', label: 'Добавить, если нет подходящего?' }
  ];

  const fetchCities = async (id: string) => {
    try {
      const res = await getCitiesByCountryId(id)
      setCities(res.cities.map((item: { id: string; name: { ru: string } }) => ({
        id: item.id,
        label: item.name.ru,
      })))
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  }

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const newData = {
      name: data.name,
      family_name: data.surname,
      gender_id: data.gender.id,
      chest_number: data.bib,
      birth: data.birth,
      address: data.address ? data.address.label : data.country.label,
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


    // const url = isEdit ? `/api/sportsmens/${sportsmanToEdit.id}` : '/api/sportsmens';
    // const method = isEdit ? 'put' : 'post';
    // const res = await axios({ url, method, data: newData });

    // if (res.status === 200) {
    //   handleClose();
    //   reset();
    //   toast.success(`Спортсмен ${isEdit ? 'обновлен' : 'добавлен'}`);
    //   setSelectedOptions([]);
    //   router.refresh();
    // } else {
    //   toast.error(`Спортсмен не ${isEdit ? 'обновлен' : 'добавлен'}`);
    // }


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
      onClose={handleModalClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: 'center', mb: 5 }}>
          {id ? 'Редактирование спортсмена' : 'Добавление спортсмена'}
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
          {!id && <Box sx={{ mt: 2 }}>
            <InputLabel sx={{ mb: 2 }} htmlFor="address">Страна</InputLabel>
            {/* <TextField {...register('address', { required: true })} type="text" fullWidth name="address" id="address" placeholder='Регион (например: Ташкент)' /> */}

            <Controller
              name="country"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={countriesOptions}
                  getOptionLabel={(option) => option.label}
                  onChange={(event, value) => {
                    field.onChange(value)
                    if (value) fetchCities(value.id)
                  }}
                  renderInput={(params) => <TextField {...params} label="Страна" />}
                  renderOption={(props, option) => (
                    <li {...props} /* onClick={option.id === 'add-new' ? handleOpenAddCountries : props.onClick} */>
                      {option.label}
                    </li>
                  )}
                />
              )}
            />
            {cities.length > 0 && <Box sx={{ mt: 2 }}>
              <InputLabel sx={{ mb: 2 }} htmlFor="address">Регион</InputLabel>
              <Controller
                name="address"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={cities}
                    getOptionLabel={(option) => option.label}
                    onChange={(event, value) => {
                      field.onChange(value)
                    }}
                    renderInput={(params) => <TextField {...params} label="Регион" />}
                    renderOption={(props, option) => (
                      <li {...props} /* onClick={option.id === 'add-new' ? handleOpenAddCountries : props.onClick} */>
                        {option.label}
                      </li>
                    )}
                  />
                )}
              />
            </Box>}
          </Box>}
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
                  value={genders.map((option) => ({ id: option.id, label: `${option.name.ru}/${option.name.uz}/${option.name.en}` })).find((option) => option.id === field.value?.id) || null}
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
                  options={options.map((option) => ({
                    id: option.id,
                    label: `${option.event?.name?.ru ? option.event.name.ru : ''}, ${option.name.ru}`,
                    gender_id: option.gender_id,
                    sport_type_id: option.sport_type_id
                  }))}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  getOptionLabel={(option) => option.label}
                  onChange={(event, value) => {
                    field.onChange(value)
                    if (value && !selectedOptions.includes(value)) {
                      if (value && !selectedOptions.some(selectedOption => selectedOption.id === value.id) && selectedOptions.length < 4) {
                        setSelectedOptions([...selectedOptions, { ...value, sb: '', pb: '' }]);
                      }
                    }
                  }}
                  renderInput={(params) => <TextField {...params} label="Вид" />}
                />
              )}
            />
            {selectedOptions.map((option, index) => {
              const isTimeFormat = option.sport_type_id >= 1 && option.sport_type_id <= 49;
              return (
                <Box sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }} key={index}>
                  <Typography sx={{ mb: 1 }} component='p'>{option.label.toUpperCase()}:</Typography>

                  <Box sx={{ display: 'flex', gap: 0.7, alignItems: 'center' }}>
                    <InputLabel sx={{ mb: 2 }} htmlFor="pb">PB</InputLabel>
                    <TextField
                      id='pb'
                      label={`PB`}
                      value={option.pb}
                      onChange={(e) => handleInputChange(option.id, 'pb', e.target.value)}
                      placeholder={isTimeFormat ? '00:00:00' : '00.00'}
                      onKeyDown={handleKeyDown}
                    />
                    <InputLabel sx={{ mb: 2 }} htmlFor="sb">SB</InputLabel>
                    <TextField
                      id='sb'
                      label={`SB`}
                      value={option.sb}
                      onChange={(e) => handleInputChange(option.id, 'sb', e.target.value)}
                      placeholder={isTimeFormat ? '00:00:00' : '00.00'}
                      onKeyDown={handleKeyDown}
                    />
                    <button
                      type="button"
                      onClick={() => handleDelete(option)}
                    >
                      <CircleX />
                    </button>
                  </Box>
                </Box>
              )
            })}
          </Box>
          <Button sx={{ width: '100%', mt: 4 }} type='submit' variant='contained'>{id ? 'Обновить' : 'Создать'}</Button>
        </form>
      </Box>
    </Modal>
  )
}

export default CreateSportsmenModal