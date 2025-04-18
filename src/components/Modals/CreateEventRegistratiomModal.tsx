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
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Autocomplete, Box, Button, Checkbox, Input, InputLabel, Modal, Tab, TextField, Typography } from '@mui/material'
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [multiSportItems, setMultiSportItems] = useState<Array<{
    sportType: { id: number; label: string, gender_id: number } | null;
    datestart: { date: string; time: string } | null;
    country: { id: number; name: { [key: string]: string } } | null;
    city: { id: number; label: string } | null;
    judge: { id: number; label: string } | null;
    procedures: { id: number; label: string } | null;
    wind: boolean;
    attempts: number;
  }>>([
    {
      sportType: null,
      datestart: null,
      country: { id: cityByCountry.id, name: { ru: cityByCountry.name.ru } },
      city: null,
      judge: null,
      procedures: null,
      wind: false,
      attempts: 1,
    },
  ])
  const [page, setPage] = useState(1);
  const { register, handleSubmit, reset, control, setValue } = useForm({
    // mode: 'onChange',
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
    // defaultValues: {
    //   multisport: [
    //     {
    //       sportType: null,
    //       datestart: '',
    //       wind: false,
    //       attempts: 0,
    //     }
    //   ]
    // }
  })
  const params = useParams()
  const router = useRouter()
  const [value, setValueTab] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValueTab(newValue);
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'multisport'
  });



  useEffect(() => {
    const fetchData = async () => {
      if (id && value === '2') {
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
    // console.log(newData);


    // try {
    //   const res = id ? await axios.put(`/api/eventRegistration/${id}`, newData) : await axios.post('/api/eventRegistration', newData)
    //   if (res.status === 200) {
    //     toast.success('Событие создано')
    //   }
    // } catch (error) {
    //   toast.error('Событие не создано')
    // } finally {
    //   reset()
    //   handleClose()
    //   router.refresh()
    // }
  }

  const handleSubmitTab2 = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Tab 2 form submitted with data:", multiSportItems)
    setIsSubmitting(true)

    try {

      const validItems = multiSportItems.filter((item) => item.sportType)
      if (validItems.length === 0) {
        toast.error("Добавьте хотя бы одно соревнование с выбранным видом спорта")
        setIsSubmitting(false)
        return
      }

      const newData = {
        user_id: null,
        event_id: Number(params.eventId),
        city_id: multiSportItems[0].city?.id,
        gender_id: multiSportItems[0].sportType?.gender_id || null,
        name: {
          ru: "Многоборье",
          uz: "Многоборье",
          en: "Multi-sport",
        },
        attempts: 1,
        type: "multievent",
        description: "",
        start_time: multiSportItems[0].datestart,
        end_time: null,
        condition: {
          status: null,
        },
        condition_type: "wind",
        procedure: [],
        sportsmen: [],
        sport_types: multiSportItems.map((item) => {
          return {
            sport_type_id: item.sportType?.id,
            sport_type_name: item.sportType?.label,
            start_time: item.datestart,
            end_time: null,
            attempts: item.attempts,
            condition: {
              status: item.wind ? "true" : "false",
            },
            user_id: item.judge?.id
          }

        })/* .filter(Boolean) */,
      }

      console.log("Sending multi-sport data to API:", newData)

      // const res = id
      //   ? await axios.put(`/api/eventRegistration/${id}`, newData)
      //   : await axios.post("/api/eventRegistration", newData)

      // if (res.status === 200) {
      //   toast.success("Многоборье создано")
      //   setMultiSportItems([
      //     {
      //       sportType: null,
      //       datestart: "",
      //       wind: false,
      //       attempts: 1,
      //     },
      //   ])
      //   handleClose()
      //   router.refresh()
      // }
    } catch (error) {
      console.error("Error submitting multi-sport form:", error)
      toast.error("Многоборье не создано")
    } finally {
      setIsSubmitting(false)
    }
  }




  // Handle adding a new multi-sport item
  const addMultiSportItem = () => {
    setMultiSportItems([
      ...multiSportItems,
      {
        sportType: null,
        datestart: null,
        country: null,
        city: null,
        judge: null,
        procedures: null,
        wind: false,
        attempts: 1,
      },
    ])
  }

  // Handle removing a multi-sport item
  const removeMultiSportItem = (index: number) => {
    const newItems = [...multiSportItems]
    newItems.splice(index, 1)
    setMultiSportItems(newItems)
  }

  // Handle updating a multi-sport item
  const updateMultiSportItem = (index: number, field: string, value: any) => {
    const newItems = [...multiSportItems]
    newItems[index] = { ...newItems[index], [field]: value }
    setMultiSportItems(newItems)
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
      <>

        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: 'center' }}>
            {id ? 'Редактирование типа соревнования' : 'Создание типа соревнования'}
          </Typography>

          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Обычное соревнование" value="1" />
                <Tab label="Многоборье" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
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
                        // multiple
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
            </TabPanel>




            <TabPanel value="2">
              <Box>

                <form onSubmit={handleSubmitTab2}>
                  {multiSportItems.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        mb: 4,
                        p: 2,
                        border: "1px solid #e0e0e0",
                        borderRadius: "4px",
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                        Соревнование #{index + 1}
                      </Typography>

                      <InputLabel>Тип соревнования</InputLabel>
                      <Autocomplete
                        id={`sportType-${index}`}
                        options={options.map((option) => ({
                          id: option.id,
                          label: option.sport_type_name.en,
                          gender_id: option.gender_id,
                        }))}
                        value={item.sportType ? { ...item.sportType, id: item.sportType.id.toString(), gender_id: item.sportType.gender_id } : null}
                        onChange={(_, value) => updateMultiSportItem(index, "sportType", value)}
                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                        getOptionLabel={(option) => option?.label || ""}
                        renderInput={(params) => <TextField {...params} label="Вид" required />}
                      />
                      {/* 
                      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        <InputLabel htmlFor={`wind-${index}`}>Имеется ли ветер?</InputLabel>
                        <Input
                          type="checkbox"
                          id={`wind-${index}`}
                          checked={item.wind}
                          onChange={(e) => updateMultiSportItem(index, "wind", e.target.checked)}
                        />
                      </Box> */}

                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <InputLabel sx={{ cursor: 'pointer', userSelect: 'none' }} htmlFor={`wind-${index}`}>Имеется ли общий ветер?</InputLabel>
                        <Checkbox id={`wind-${index}`} sx={{ cursor: 'pointer' }} checked={item.wind} onChange={(e) => updateMultiSportItem(index, "wind", e.target.checked)} />
                      </Box>

                      <TextField
                        label="Дата начала"
                        type="datetime-local"
                        value={item.datestart}
                        onChange={(e) => updateMultiSportItem(index, "datestart", e.target.value)}
                        fullWidth
                        required
                        InputLabelProps={{ shrink: true }}
                      />

                      <Box>
                        <InputLabel sx={{ mb: 2 }} id="demo-simple-select-label" htmlFor='country'>Страна</InputLabel>
                        <TextField name="country" id="country" type="text" variant="outlined" sx={{ width: '100%' }} defaultValue={cityByCountry.name.ru} disabled />
                      </Box>

                      <Autocomplete

                        id='city'
                        options={cytiesOptions}
                        value={item.city ? { id: item.city.id, label: item.city.label } : null}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        getOptionLabel={(option) => option.label}
                        onChange={(event, value) => {
                          updateMultiSportItem(index, "city", value)
                        }}
                        renderInput={(params) => <TextField {...params} label="Город" />}
                        renderOption={(props, option) => (
                          <li {...props} onClick={option.id === 'add-new' ? handleOpenAddCities : props.onClick}>
                            {option.label}
                          </li>
                        )}
                      />

                      <Autocomplete
                        id='judge'
                        options={users.filter((user) => user.name !== 'Admin').map((option) => ({ id: option.id, label: option.name }))}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        getOptionLabel={(option) => option.label}
                        onChange={(event, value) => {
                          updateMultiSportItem(index, "judge", value)
                        }}
                        renderInput={(params) => <TextField {...params} label="Судья" />}
                      />
                      <InputLabel sx={{ mb: 2 }} id="demo-simple-select-label" htmlFor='procedures'>Выберите этапы (если они имеются)</InputLabel>
                      <Autocomplete

                        id='procedures'
                        options={proceduresOptions}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        value={item.procedures ? { id: item.procedures.id.toString(), label: item.procedures.label } : null}
                        getOptionLabel={(option) => option.label}
                        onChange={(event, value) => {
                          updateMultiSportItem(index, "procedures", value)
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

                      <TextField
                        label="Попытки"
                        type="number"
                        value={item.attempts}
                        onChange={(e) => updateMultiSportItem(index, "attempts", Number.parseInt(e.target.value) || 1)}
                        fullWidth
                        required
                        inputProps={{ min: 1 }}
                      />

                      {multiSportItems.length > 1 && (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => removeMultiSportItem(index)}
                          sx={{ alignSelf: "flex-start", mt: 1 }}
                        >
                          Удалить соревнование
                        </Button>
                      )}
                    </Box>
                  ))}

                  <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                    <Button type="button" variant="outlined" onClick={addMultiSportItem}>
                      Добавить соревнование
                    </Button>

                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                      {isSubmitting ? "Отправка..." : "Отправить"}
                    </Button>
                  </Box>
                </form>
              </Box>
            </TabPanel>
          </TabContext>






        </Box>
      </>





    </Modal>
  )
}
export default CreateEventRegistratiomModal