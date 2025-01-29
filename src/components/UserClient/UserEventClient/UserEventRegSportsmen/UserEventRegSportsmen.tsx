'use client'
import { IUserData } from '@/types/authTypes'
import { IEventRegistrationResponse } from '@/types/eventRegistrationTypes'
import { IStartList, StartListSportsmen } from '@/types/startListType'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Box, Button, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React, { FC } from 'react'
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, Table as DocxTable, TableCell as DocxTableCell, TableRow as DocxTableRow, WidthType, TextRun } from "docx";
import { FaFileWord } from "react-icons/fa";
import { BsFiletypeTxt } from "react-icons/bs";
import { Controller, FieldValues, useForm } from 'react-hook-form'

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
  const { register, handleSubmit, reset, control, resetField, getValues } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues: {
      position: '',
    }
  })
  const attempts = eventRegistration.attempts


  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const downloadDoc = () => {
    const tables: any = startList?.map((startListItem: any, index) => {
      return Object.keys(startListItem.sportsmen || {}).map((key) => {
        const titleParagraph = new Paragraph({
          children: [new TextRun({ text: key, bold: true, size: 20 })],
          spacing: { after: 200 },
        });

        const tableRows = startListItem.sportsmen[key]?.map((athlete: any) => {
          if (!athlete.sportsman) return null;

          return new DocxTableRow({
            children: [
              new DocxTableCell({ children: [new Paragraph((index + 1).toString())] }),
              new DocxTableCell({ children: [new Paragraph(athlete.sportsman.chest_number)] }),
              new DocxTableCell({ children: [new Paragraph(athlete.sportsman.name || "")] }),
              new DocxTableCell({ children: [new Paragraph(athlete.sportsman.family_name || "")] }),
              new DocxTableCell({ children: [new Paragraph(athlete.sportsman.address || "")] }),
              new DocxTableCell({
                children: [new Paragraph(
                  athlete.sportsman.sportsmen_disciplines?.map((discipline: any) => discipline.sb).join(", ") || ""
                )]
              }),
            ],
          });
        }).filter((row: any) => row !== null);

        const table = new DocxTable({
          rows: [
            new DocxTableRow({
              children: [
                new DocxTableCell({ children: [new Paragraph("Очередность")] }),
                new DocxTableCell({ children: [new Paragraph("BIB")] }),
                new DocxTableCell({ children: [new Paragraph("Имя")] }),
                new DocxTableCell({ children: [new Paragraph("Фамилия")] }),
                new DocxTableCell({ children: [new Paragraph("Год рождения")] }),
                new DocxTableCell({ children: [new Paragraph("Заявленый результат")] }),
              ],
            }),
            ...tableRows,
          ],
          width: { size: 100, type: WidthType.PERCENTAGE },
        });
        return [titleParagraph, table];
      }).flat();
    }).flat();

    const dateParagraph = new Paragraph({
      children: [new TextRun({ text: "Дата проведения: (число.месяц.год)", size: 14 })],
    });

    const cityParagraph = new Paragraph({
      children: [new TextRun({ text: "Город:", size: 14 })],
    });

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [dateParagraph, cityParagraph, ...tables],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "Athletes.docx");
    });
  };

  const downloadTxt = () => {
    const rows: any = startList?.map((startListItem: any) => {
      return Object.keys(startListItem.sportsmen).map((key) => {
        return startListItem.sportsmen[key].map((athlete: any) => (
          `A,${athlete.sportsman.name},${athlete.sportsman.family_name},${athlete.sportsman.birth},${athlete.sportsman.gender_id === 1 ? 'M' : 'F'},${athlete.sportsman.address},${athlete.sportsman.sportsmen_disciplines?.map((discipline: any) => discipline.sb).join(", ")},M\n`
        )
        ).join("\n")
      })
    })
    const blob = new Blob(rows, { type: "text/plain;charset=utf-8" });
    saveAs(blob, "Athletes.txt");
  };





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
          <Box sx={{ display: 'flex', gap: 2 }}>
            {
              startList && <Button onClick={downloadDoc} type='button' variant='contained' sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <FaFileWord />
                Скачать стартлист</Button>
            }
            {/* {
              startList && <Button onClick={downloadTxt} type='button' variant='contained' sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <BsFiletypeTxt />
                Скачать TXT</Button>
            } */}
          </Box>

          {
            startList.map((startList, index) => (
              <Box key={index}>
                {
                  Object.keys(startList.sportsmen).map((key, index) => (
                    <Box sx={{ my: 5 }} key={index}>
                      <Typography sx={{ mb: 2 }} variant='h4'>{key}</Typography>
                      <form action="">
                        {
                          eventRegistration.event_registration_setting.condition.status === 'true' ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Controller
                                name={`condition`}
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    id="outlined-basic"
                                    label="Ветер"
                                    variant="outlined"
                                    size='small'
                                    sx={{ my: 2 }}
                                  />
                                )}
                              />

                              {/* <Button type='submit' variant='contained'>
                              Сохранить
                            </Button> */}
                            </Box>
                          )
                            : null
                        }
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
                                  {
                                    eventRegistration.user_id === currentUser.id && eventRegistration.sport_type_id >= 1 && eventRegistration.sport_type_id <= 49 ? (
                                      null
                                    ) : <TableCell align="center">
                                      Попытки
                                    </TableCell>
                                  }
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
                                              <Box key={index} sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                                                <TextField inputProps={{
                                                  style: { height: '7px' }
                                                }} placeholder={`Попытка № ${index + 1}`} />
                                                {
                                                  eventRegistration.event_registration_setting.condition.status === 'false' &&
                                                  <TextField inputProps={{
                                                    style: { height: '7px' }
                                                  }} placeholder={`Ветер`} />
                                                }
                                              </Box>
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
                      </form>
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