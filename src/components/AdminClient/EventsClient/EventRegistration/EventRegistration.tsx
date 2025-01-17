'use client'
import { IEventResponse } from '@/types/eventTypes'
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React, { FC } from 'react'
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { ILang } from '@/types/langTypes';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useEventRegistrationCreateModal from '@/hooks/useEventRegistrationCreateModal';

interface EventRegistrationProps {
  event: IEventResponse
  days: {
    date: string
    events: {
      id: string
      name: ILang
      city_id: number
      description: ILang
      end_time: string
      event_id: number
      start_time: string
      gender_id: number
      status: number | null
      parent_id?: null
      sport_type_id: number
      type: string
      user_id: number
    }[]
  }[] | undefined
}

const EventRegistration: FC<EventRegistrationProps> = ({ event, days }) => {
  const [value, setValue] = React.useState(`${days?.[0].date}`);
  const router = useRouter()
  const { handleOpen } = useEventRegistrationCreateModal()

  console.log(event);


  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`/api/eventRegistration/${id}`)
    toast.success('Событие удаленно')
    router.refresh()
  }

  return (
    <>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5">{event.name.ru}</Typography>
            <Typography sx={{ mb: 1, color: 'gray' }} variant='subtitle1' component={'p'}>{event.date_from.replace('2024-', ' ')} - {event.date_to.replace('2024-', ' ')}</Typography>
          </Box>
          <Button
            type="button"
            className="btn btn-outline-primary gap-1 flex items-center"
            variant='contained'
            onClick={handleOpen}
          >
            <Pencil size={17} />
            Создать
          </Button>
        </Box>
        <Box>
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                  {
                    days?.map((day, index) => <Tab key={day.date} label={`День ${index + 1}`} value={day.date} />)
                  }
                </TabList>
              </Box>
              {
                days?.map((day, index) => (
                  <TabPanel value={day.date} key={day.date}>
                    {
                      day.events.length === 0 ? <p>Соревнования еще не созданы</p> :
                        <TableContainer component={Paper}>
                          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                            <TableHead>
                              <TableRow>
                                <TableCell>Время</TableCell>
                                <TableCell>Событие</TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {
                                day.events.map((event) => (
                                  <TableRow sx={{
                                    padding: 20,
                                  }}
                                    key={event.id}
                                  >
                                    <TableCell>{event.start_time.split(' ')[1]}</TableCell>
                                    <TableCell>{event.name.ru}</TableCell>
                                    <TableCell >
                                      <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Link href={`/admin/events/${event.event_id}/registration/${event.id}`}>
                                          <Eye className='cursor-pointer' size={17} />
                                        </Link>
                                        <Trash2 size={17} onClick={() => handleDelete(event.id)} color='red' className='cursor-pointer' />
                                      </Box>
                                    </TableCell>
                                  </TableRow>
                                ))
                              }
                            </TableBody>
                          </Table>
                        </TableContainer>
                    }
                  </TabPanel>
                ))
              }
            </TabContext>
          </Box>
        </Box>
      </Box >

    </>
  )
}

export default EventRegistration