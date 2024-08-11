'use client'
import { IUserData } from '@/types/authTypes'
import { IEventRegistrationResponse } from '@/types/eventRegistrationTypes'
import { IStartList, StartListSportsmen } from '@/types/startListType'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Box, Button, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React, { FC } from 'react'

interface UserEventRegSportsmenProps {
  eventRegistration: IEventRegistrationResponse
  startList: StartListSportsmen[]
  currentUser: IUserData
}

const UserEventRegSportsmen: FC<UserEventRegSportsmenProps> = ({
  eventRegistration,
  startList,
  currentUser
}) => {
  const [value, setValue] = React.useState('1');
  const attempts = eventRegistration.attempts
  console.log(eventRegistration, currentUser);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

console.log(eventRegistration);




  return (
    <Box>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Спортсмены" value="1" />
            <Tab label="Стартлист" value="2" />
            {/* <Tab label="Item Three" value="3" /> */}
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
          </Box>

          {
            startList.map((startList, index) => (
              <Box key={index}>
                {
                  Object.keys(startList.sportsmen).map((key, index) => (
                    <Box sx={{ my: 5 }} key={index}>
                      <Typography sx={{ mb: 2 }} variant='h4'>{key}</Typography>
                      <Paper sx={{ width: '100%' }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                          <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                              <TableRow>
                                <TableCell>№</TableCell>
                                <TableCell>Спортсмен</TableCell>
                                <TableCell>Регион</TableCell>
                                <TableCell>BIB</TableCell>
                                <TableCell>Заявленый результат</TableCell>
                                <TableCell>Результат</TableCell>
                                <TableCell>Место</TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                            </TableHead>  
                            <TableBody>
                              {
                                startList.sportsmen[key].map((sportsmen: any, index: number) => (
                                  <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                  >
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell component="th" scope="row">
                                      {sportsmen.sportsman.name} {sportsmen.sportsman.family_name}
                                    </TableCell>
                                    <TableCell>{sportsmen.sportsman.address}</TableCell>
                                    <TableCell>{sportsmen.sportsman.chest_number}</TableCell>
                                    <TableCell>
                                      {
                                        sportsmen.sportsman.sportsmen_disciplines.map((discipline: any, index: number) => (
                                          <Typography key={discipline.id} component={'span'}>
                                            {discipline.sb}
                                          </Typography>
                                        ))
                                      }
                                    </TableCell>
                                    {
                                      eventRegistration.user_id === currentUser.id && eventRegistration.sport_type_id >= 1 && eventRegistration.sport_type_id <= 49 ? (
                                        null
                                      ) : <TableCell sx={{ display: 'flex', gap: 1 }} align='center'>
                                        {
                                          attempts.map((attempt, index) => (
                                            <TextField inputProps={{
                                              style: { height: '7px' }
                                            }} key={index} placeholder={`Попытка № ${index + 1}`} />
                                          ))
                                        }
                                      </TableCell>
                                    }
                                    <TableCell>
                                      <TextField inputProps={{
                                        style: { height: '7px' }
                                      }} placeholder='Результат' />
                                    </TableCell>
                                    <TableCell>
                                      <TextField inputProps={{
                                        style: { height: '7px' }
                                      }} placeholder='Место' />
                                    </TableCell>
                                    <TableCell>
                                      <Button variant='contained'>Сохранить</Button>
                                    </TableCell>
                                  </TableRow>
                                ))
                              }
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Paper>
                    </Box>
                  ))
                }
              </Box>
            ))

          }
        </TabPanel>
        {/* <TabPanel value="3">Item Three</TabPanel> */}
      </TabContext>
    </Box >
  )
}

export default UserEventRegSportsmen