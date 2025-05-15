'use client'
import { IEventResponse } from '@/types/eventTypes'
import { ILang } from '@/types/langTypes'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Box, Button, Container, Divider, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { Eye, House } from 'lucide-react'
import Link from 'next/link'
import React, { FC } from 'react'

interface StartListClientProps {
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

const StartListClient: FC<StartListClientProps> = ({ event, days }) => {
  const [value, setValue] = React.useState(`${days?.[0].date}`);


  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const sortedData = (days ?? []).map(day => ({
    ...day,
    events: day.events.sort((a, b) => {
      const timeA = new Date(a.start_time).getTime();
      const timeB = new Date(b.start_time).getTime();
      return timeA - timeB;
    })
  }));

  return (
    <Container maxWidth="xl">
      <Box>

        <Box sx={{ my: 3 }}>
          <Button>
            <Link href='/' className='flex items-center gap-3'>
              <House />
              На главную
            </Link>
          </Button>
        </Box>
        <Box>
          <Typography variant='h5' sx={{ textAlign: 'center', mb: 2 }}>UzAthletic Federation</Typography>
          <Divider />
        </Box>
        <Box sx={{ my: 3 }}>
          <Typography variant="h5">{event.name.ru}</Typography>
          <Typography sx={{ mb: 1, color: 'gray' }} variant='subtitle1' component={'p'}>{event.date_from.replace('2024-', ' ')} - {event.date_to.replace('2024-', ' ')}</Typography>
        </Box>


        <Box>
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                  {
                    sortedData?.map((day, index) => <Tab key={day.date} label={`День ${index + 1}`} value={day.date} />)
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
                                    <TableCell>
                                      <Link href={`/startlist/${event.event_id}/registration/${event.id}`}>
                                        <Eye className='cursor-pointer' size={17} />
                                      </Link>
                                      {/* <Trash2 size={17} onClick={() => handleDelete(event.id)} color='red' className='cursor-pointer' /> */}
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
      </Box>
    </Container>
  )
}

export default StartListClient