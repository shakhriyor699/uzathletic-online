'use client'
import React, { FC, useEffect, useState } from 'react'
import { Autocomplete, Box, Button, CircularProgress, debounce, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material'
import { Pen, Pencil, Trash2 } from 'lucide-react'
import { ISportsman } from '@/types/sportsmanTypes'
import useSportsmenModal from '@/hooks/useSportsmenModal'
import axios from 'axios'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { getAllSportsmens } from '@/app/actions/getAllSportsmens'
import { IUserData } from '@/types/authTypes'
import { IGender } from '@/types/genderTypes'
import { Controller, FieldValues, useForm } from 'react-hook-form'
import { ICity, ICountry } from '@/types/countryTypes'
import { IEventRegistrationResponse } from '@/types/eventRegistrationTypes'
import { ISportType } from '@/types/sportTypeTypes'

interface SportsmentsClientProps {
  sportsmens: ISportsman[]
  currentUser?: IUserData | undefined
  totalPage: number
  genders?: IGender[]
  cities?: ICity[]
  sportTypes?: ISportType[]
  countries: ICountry[]
}

const SportsmensClient: FC<SportsmentsClientProps> = ({
  sportsmens,
  currentUser,
  totalPage,
  genders,
  cities,
  sportTypes,
  countries
}) => {
  const { handleOpen } = useSportsmenModal()
  const [rowsPerPage, setRowsPerPage] = React.useState(15);
  const [page, setPage] = React.useState(0);
  const [totalCount, setTotalCount] = React.useState(totalPage);
  const [data, setData] = React.useState<ISportsman[]>(sportsmens)
  const filteredData = data.filter((item) => item.status);
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register, control, reset, formState: { errors }, handleSubmit, setValue } = useForm<FieldValues>({
    mode: 'onChange',
  });

  useEffect(() => {
    loadEvents(page + 1, searchQuery)
  }, [page, searchQuery]);






  const loadEvents = async (page: number, name?: string) => {
    const res = await getAllSportsmens(page, name, null, '', null, true)
    setData(res.data)
    setTotalCount(res.total);
  }


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debounce(() => loadEvents(page, event.target.value), 500)
    setSearchQuery(event.target.value);
    setPage(0);
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  const handleDelete = async (id: number) => {
    const res = await axios.delete(`/api/sportsmens/${id}`)
    if (res.status === 200) {
      toast.success('Спортсмен удален')
      router.refresh()
    } else {
      toast.error('Произошла ошибка при удалении спортсмена')
    }
  }

  const handleEdit = (sportsman: ISportsman) => {
    useSportsmenModal.getState().handleOpen(sportsman);
  };


  const onSubmit = async (data: FieldValues) => {
    

    setSubmitting(true)

    try {
      const res = await getAllSportsmens(page, '', data.gender ? data.gender.id : '', data.cities ? data.cities.label : data.countries.label, data['event-type'] ? data['event-type'].id : '')
      setData(res.data)
    } catch (error) {
      throw error
    } finally {
      setSubmitting(false)
    }
  }

  const handleResetFitlers = () => {
    reset()
    router.refresh();
    setData(sportsmens)
  }





  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ height: 400, width: '70%' }}>
        <Typography variant='h4' sx={{ mb: 3 }}>Спортсмены</Typography>
        {(currentUser?.role.name === 'admin' || currentUser?.role.name === 'operator') && <Button onClick={handleOpen} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, marginLeft: 'auto' }} variant='contained'>
          <Pen size={15} />
          Создать
        </Button>}
        {
          <Box className='flex gap-3 items-center mb-3'>
            <TextField
              label={'Поиск'}
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              size="small"
              sx={{ width: '300px' }}
            />
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  sx={{
                    width: 300,
                  }}
                  id='gender'
                  options={genders?.map((option) => ({ id: option.id, label: `${option.name.ru}/${option.name.uz}/${option.name.en}` })) || []}
                  value={genders?.map((option) => ({ id: option.id, label: `${option.name.ru}/${option.name.uz}/${option.name.en}` })).find((option) => option.id === field.value?.id) || null}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  getOptionLabel={(option) => option.label}
                  onChange={(event, value) => field.onChange(value)}
                  renderInput={(params) => <TextField  {...params} label="Пол" />}
                />
              )}
            />
            <Controller
              name="cities"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  sx={{
                    width: 300,
                  }}
                  id='cities'
                  options={cities?.map((option) => ({ id: option.id, label: `${option.name.ru}` })) || []}
                  value={cities?.map((option) => ({ id: option.id, label: `${option.name.ru}` })).find((option) => option.id === field.value?.id) || null}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  getOptionLabel={(option) => option.label}
                  onChange={(event, value) => field.onChange(value)}
                  renderInput={(params) => <TextField  {...params} label="Регион" />}
                />
              )}
            />
            <Controller
              name="countries"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  sx={{
                    width: 300,
                  }}
                  id='cities'
                  options={countries?.map((option) => ({ id: option.id, label: typeof option.name === 'object' ? option.name.ru : option.name })) || []}
                  value={countries?.map((option) => ({ id: option.id, label: typeof option.name === 'object' ? option.name.ru : option.name })).find((option) => option.id === field.value?.id) || null}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  getOptionLabel={(option) => option.label}
                  onChange={(event, value) => field.onChange(value)}
                  renderInput={(params) => <TextField  {...params} label="Страна" />}
                />
              )}
            />
            <Controller
              name="event-type"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  sx={{
                    width: 300,
                  }}
                  id='event-type'
                  options={sportTypes?.map((option) => ({ id: option.id, label: `${option.sport_type_name.en}` })) || []}
                  value={sportTypes?.map((option) => ({ id: option.id, label: `${option.sport_type_name.en}` })).find((option) => option.id === field.value?.id) || null}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  getOptionLabel={(option) => option.label}
                  onChange={(event, value) => field.onChange(value)}
                  renderInput={(params) => <TextField  {...params} label="Вид" />}
                />
              )}
            />
            <Button variant='contained' onClick={handleSubmit(onSubmit)}>
              {submitting ? <CircularProgress size={24} color='warning' /> : 'Фильтр'}
            </Button>
            <Button variant='contained' onClick={handleResetFitlers}>Сбросить</Button>
          </Box>
        }

        {
          filteredData.length > 0 ?

            (
              <Paper sx={{ width: '100%' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell>№</TableCell>
                        <TableCell>Имя</TableCell>
                        <TableCell>Фамилия</TableCell>
                        <TableCell>Дата рождения</TableCell>
                        <TableCell>Номер</TableCell>
                        <TableCell>Регион</TableCell>
                        <TableCell>Тренер</TableCell>
                        <TableCell>Вид</TableCell>
                        <TableCell>Рекорд</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredData.map((row, i) => {
                        return (
                          <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">
                              {i + 1}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {row.name}
                            </TableCell>
                            <TableCell >{row.family_name}</TableCell>
                            <TableCell>{row.birth}</TableCell>
                            <TableCell>{row.chest_number}</TableCell>
                            <TableCell>{row.address}</TableCell>
                            <TableCell>
                              {
                                row.coaches.map((coach) => (
                                  <Typography component={'p'} key={coach.id}>{coach.name}</Typography>
                                ))
                              }
                            </TableCell>
                            <TableCell>
                              {
                                row.sportsmen_disciplines.map((event: any) => (
                                  <Typography component={'p'} key={event.id}>{event.name}</Typography>
                                ))
                              }
                            </TableCell>
                            <TableCell >
                              {
                                row.sportsmen_disciplines.map((discipline) => (
                                  <Typography key={discipline.name}>SB: {discipline.sb}</Typography>
                                ))
                              }
                            </TableCell>
                            <TableCell>
                              {/* <Button onClick={() => handleEdit(row)}>
                          <Pencil className='cursor-pointer' color='green' />
                        </Button> */}
                              <Button onClick={() => handleDelete(row.id)}>
                                <Trash2 className='cursor-pointer' color='red' />
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[15]}
                  component="div"
                  count={totalCount}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            ) : <Typography variant='h6' className='text-center'>Нет данных</Typography>

        }

      </Box>
    </Box>
  )
}

export default SportsmensClient