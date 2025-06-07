'use client'
import { IEventResponse } from '@/types/eventTypes'
import { ILang } from '@/types/langTypes'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Box, Button, Collapse, IconButton, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { ArrowLeftFromLine, CircleChevronDown, CircleChevronUp, Eye } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { FC, useState } from 'react'

interface UserEventClientProps {
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
      sport_types: any[]
      type: string
      user_id: number
    }[]
  }[] | undefined
}

const UserEventClient: FC<UserEventClientProps> = ({ event, days }) => {
  const [value, setValue] = React.useState(`${days?.[0].date}`);
  const router = useRouter()
  const [openRows, setOpenRows] = useState<Record<string, boolean>>({})

  const toggleRow = (id: string) => {
    setOpenRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }


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
    <>
      <Box>
        <Button variant="outlined" startIcon={<ArrowLeftFromLine />} onClick={() => router.back()}></Button>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5">{event.name.ru}</Typography>
            <Typography sx={{ mb: 1, color: 'gray' }} variant='subtitle1' component={'p'}>{event.date_from.replace('2024-', ' ')} - {event.date_to.replace('2024-', ' ')}</Typography>
          </Box>

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
                                day.events.map((event) => {
                                  const isOpen = openRows[event.id] || false;
                                  return (
                                    <>
                                      <TableRow sx={{
                                        padding: 20,
                                      }}
                                        key={event.id}
                                      >
                                        <TableCell>{event.start_time.split(' ')[1]}</TableCell>
                                        {/* <TableCell>{event.name.ru}</TableCell> */}
                                        <TableCell>  {Array.isArray(event.sport_types) ? (
                                          event.sport_types.length === 10 ? 'Decathlon' :
                                            event.sport_types.length === 8 ? 'Octathlon' :
                                              event.sport_types.length === 7 ? 'Heptathlon' :
                                                event.sport_types.length === 5 ? 'Pentathlon' :
                                                  event.name?.ru ?? ''
                                        ) : event.name?.ru ?? ''}
                                        </TableCell>
                                        <TableCell>
                                          {event.type === 'multievent' && (
                                            <IconButton size="small" onClick={() => toggleRow(event.id)}>
                                              {isOpen ? <CircleChevronUp /> : <CircleChevronDown />}
                                            </IconButton>
                                          )}
                                        </TableCell>
                                        <TableCell>
                                          <Link href={`/user/events/${event.event_id}/event-registration/${event.id}`}>
                                            <Eye className='cursor-pointer' size={17} />
                                          </Link>
                                        </TableCell>
                                      </TableRow>

                                      {event.type === 'multievent' && (
                                        <TableRow>
                                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                                            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                              <Box margin={2}>
                                                <Typography variant="subtitle1" gutterBottom>
                                                  Дисциплины {event.sport_types.length}
                                                </Typography>
                                                <Table size="small">
                                                  <TableHead>
                                                    <TableRow>
                                                      <TableCell>Время</TableCell>
                                                      <TableCell align='center'>Дата</TableCell>
                                                      <TableCell>Дисциплина</TableCell>
                                                    </TableRow>
                                                  </TableHead>
                                                  <TableBody>
                                                    {event.sport_types.map((e, idx) => (
                                                      <TableRow key={idx}>
                                                        <TableCell>
                                                          {new Date(e.start_time).toLocaleString('ru-RU', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                          }).split(', ')[1]}
                                                        </TableCell>
                                                        <TableCell align='center'>
                                                          {new Date(e.start_time).toLocaleString('ru-RU', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                          }).split(', ')[0]}
                                                        </TableCell>
                                                        <TableCell>{e.sport_type_name}</TableCell>
                                                      </TableRow>
                                                    ))}
                                                  </TableBody>
                                                </Table>
                                              </Box>
                                            </Collapse>
                                          </TableCell>
                                        </TableRow>
                                      )}
                                    </>
                                  )
                                })
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

export default UserEventClient