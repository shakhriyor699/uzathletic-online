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
  startList: IStartList
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

  console.log(eventRegistration.sport_type_id >= 1 && eventRegistration.sport_type_id <= 49);



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
          <Paper sx={{ width: '100%', mt: 10 }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell>№</TableCell>
                    <TableCell>Имя</TableCell>
                    <TableCell>Фамилия</TableCell>
                    <TableCell>Регион</TableCell>
                    <TableCell>Нагрудной номер</TableCell>

                    {
                      true && (
                        <TableCell align='center'>Попытки {attempts.length}</TableCell>
                      )
                    }
                    <TableCell>Итоговый результат</TableCell>
                    <TableCell>Занятое место</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                {/* <TableBody>
                  {
                    startList.sportsmen_sortable.map((start, index) => (
                      <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell component="th" scope="row">
                          {start.name}
                        </TableCell>
                        <TableCell>
                          {start.family_name}
                        </TableCell>
                        <TableCell>{start.address}</TableCell>
                        <TableCell>
                          {start.chest_number}
                        </TableCell>
                        {
                          true && eventRegistration.sport_type_id >= 1 && eventRegistration.sport_type_id <= 49 ? (
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
                </TableBody> */}
              </Table>
            </TableContainer>
          </Paper>
        </TabPanel>
        {/* <TabPanel value="3">Item Three</TabPanel> */}
      </TabContext>
    </Box >
  )
}

export default UserEventRegSportsmen