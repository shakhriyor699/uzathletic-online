'use client'
import { IEventRegistrationResponse } from '@/types/eventRegistrationTypes'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Autocomplete, Box, Button, InputLabel, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Typography } from '@mui/material'
import { CircleX, Trash2 } from 'lucide-react'
import React, { FC, useState } from 'react'
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form'

interface EventRegistrationSportsmens {
  eventRegistration: IEventRegistrationResponse
}

const EventRegistrationSportsmens: FC<EventRegistrationSportsmens> = ({ eventRegistration }) => {
  const [value, setValue] = React.useState('1');
  const [open, setOpen] = React.useState(false)
  const [selectedAthletes, setSelectedAthletes] = useState<any[]>([]);
  const { register, handleSubmit, reset, control, resetField } = useForm<FieldValues>({
    mode: 'onChange',
  })

  console.log(eventRegistration);


  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleVisibleForm = () => {
    setOpen(!open)
  }

  const handleDelete = (optionToDelete: any) => {
    setSelectedAthletes(selectedAthletes.filter(option => option !== optionToDelete));
  };

  const onSubmit:SubmitHandler<FieldValues> = async (data) => {
    resetField('sportsmen')
    console.log(data);
  }



  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Спортсмены" value="1" />
            <Tab label="Стартлист" value="2" />
            <Tab label="Item Three" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Paper sx={{ width: '100%' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell>№</TableCell>
                    <TableCell>Имя</TableCell>
                    <TableCell>Фамилия</TableCell>
                    <TableCell>Дата рождения</TableCell>
                    <TableCell>Нагрудной номер</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    eventRegistration?.sportsmen.map((sportsmen, index) => (
                      <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell component="th" scope="row">
                          {sportsmen.name}
                        </TableCell>
                        <TableCell>{sportsmen.family_name}</TableCell>
                        <TableCell>{sportsmen.birth}</TableCell>
                        <TableCell>{sportsmen.chest_number}</TableCell>
                        <TableCell>
                          <Trash2 color='red' className='cursor-pointer' />
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </TabPanel>
        <TabPanel value="2">
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant='h4'>Стартлист</Typography>
            <Button onClick={handleVisibleForm} type='button' variant='contained'>Создать стартлист</Button>
          </Box>
          {
            open &&
            <Box>
              <form onSubmit={handleSubmit(onSubmit)}>
                <InputLabel sx={{ mb: 2 }} id="demo-simple-select-label">Выбор спортсмена</InputLabel>
                <Controller
                  name="sportsmen"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={eventRegistration.sportsmen.map((athletes) => ({ label: athletes.name }))}
                      getOptionLabel={(option) => option.label}
                      onChange={(event, value) => {
                        field.onChange(value)
                        if (value && !selectedAthletes.includes(value)) {
                          setSelectedAthletes([...selectedAthletes, { ...value }]);
                          // resetField('sportsmen')
                        }
                      }}
                      renderInput={(params) => <TextField {...params} label="Спортсмены" />}

                    />
                  )}
                />
                {selectedAthletes.map((option, index) => (
                  <Box sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }} key={index}>
                    <TextField value={option.label} disabled  />
                    <Box sx={{ display: 'flex', gap: 0.7, alignItems: 'center' }}>
                      <InputLabel sx={{ mb: 2 }} htmlFor="pb">Позиция в соревновании:</InputLabel>
                      <TextField
                        id='pb'
                        label={`Позиция в соревновании`}
                        value={option.pb}
                        {...register('position', { required: true })}
                        name='position'
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
                <Button disabled={selectedAthletes.length === 0} sx={{ width: '100%', mt: 4 }} type='submit' variant='contained'>Добавить</Button>
              </form>
            </Box>
          }
        </TabPanel>
        <TabPanel value="3">Item Three</TabPanel>
      </TabContext>
    </Box>
  )
}

export default EventRegistrationSportsmens