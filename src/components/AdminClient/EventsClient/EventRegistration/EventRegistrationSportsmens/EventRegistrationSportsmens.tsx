'use client'
import { IEventRegistrationResponse } from '@/types/eventRegistrationTypes'
import { StartListSportsmen } from '@/types/startListType'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Autocomplete, Box, Button, InputLabel, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Typography } from '@mui/material'
import axios from 'axios'
import { CircleX, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { FC, useState } from 'react'
import { Controller, FieldValues, SubmitHandler, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, Table as DocxTable, TableCell as DocxTableCell, TableRow as DocxTableRow, WidthType, TextRun } from "docx";
import { FaFileWord } from "react-icons/fa";
import { BsFiletypeTxt } from "react-icons/bs";
import { IUserData } from '@/types/authTypes'

interface EventRegistrationSportsmens {
  eventRegistration: IEventRegistrationResponse
  startList: StartListSportsmen[]
  currentUser?: IUserData | undefined
}

const EventRegistrationSportsmens: FC<EventRegistrationSportsmens> = ({ eventRegistration, startList, currentUser }) => {
  const [value, setValue] = React.useState('1');
  const [open, setOpen] = React.useState(false)
  const [selectedAthletes, setSelectedAthletes] = useState<any[]>([]);
  const { register, handleSubmit, reset, control, resetField, getValues } = useForm<FieldValues>({
    mode: 'onChange',
  })
  const [groups, setGroups] = useState<any[]>([]);
  const [groupName, setGroupName] = useState<string>('');
  const router = useRouter()

  console.log(startList);


  const addGroup = () => {
    setGroups([...groups, { name: groupName, sportsmen: [] }]);
    setGroupName('');
  };


  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleVisibleForm = () => {
    setOpen(!open)
  }

  const handleDelete = (optionToDelete: any) => {
    setSelectedAthletes(selectedAthletes.filter(option => option !== optionToDelete));
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const processedData = {} as any;
    for (const groupName in data) {
      processedData[groupName] = data[groupName].map((sportsman: any) => ({
        sportsman_id: sportsman.id,
        position: sportsman.position,
      }));
    }
    const payload = {
      event_registration_id: Number(eventRegistration.id),
      sportsmen: processedData,
    };
    const res = await axios.post('/api/startList', payload)
    if (res.status === 200) {
      toast.success('Спортсмен добавлен в стартлист')
    } else {
      toast.error('Произошла ошибка при добавлении спортсмена в стартлист')
    }
    setOpen(false)
    reset()
    setGroups([])
    resetField('sportsmen')
    router.refresh()
  }

  const selectedSportsmen = useWatch({
    control,
    name: groups.map(group => group.name),
  });
  const isSubmitDisabled = () => {
    return groups.some(group => {
      const selectedSportsmen = getValues(group.name);
      return !selectedSportsmen || selectedSportsmen.length === 0;
    });
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
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Спортсмены" value="1" />
            <Tab label="Стартлист" value="2" />
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
                          {currentUser?.name === 'Admin' && <Trash2 color='red' className='cursor-pointer' />}
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
            {currentUser?.name === 'Admin' && <Button onClick={handleVisibleForm} type='button' variant='contained'>Создать стартлист</Button>}
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {
              startList && <Button onClick={downloadDoc} type='button' variant='contained' sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <FaFileWord />
                Скачать стартлист</Button>
            }
            {
              currentUser?.name === 'Admin' && startList && <Button onClick={downloadTxt} type='button' variant='contained' sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <BsFiletypeTxt />
                Скачать TXT</Button>
            }
          </Box>
          {
            open &&
            <Box>
              <form onSubmit={handleSubmit(onSubmit)}>
                <InputLabel sx={{ mb: 2 }} id="demo-simple-select-label">Создание группы</InputLabel>
                <TextField
                  label="Название группы"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  fullWidth
                />
                {currentUser?.name === 'Admin' && <Button disabled={!groupName} variant="contained" sx={{ my: 2 }} type="button" onClick={addGroup}>
                  Создать группу
                </Button>}
                {groups.map((group, index) => (
                  <div key={index}>
                    <h3>{group.name}</h3>
                    <Controller
                      name={group.name}
                      control={control}
                      defaultValue={[]}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          multiple
                          options={eventRegistration.sportsmen.map((athletes) => ({ id: athletes.id, label: athletes.name }))}
                          getOptionLabel={(option) => option.label}
                          renderInput={(params) => <TextField {...params} label="Спортсмены" />}
                          onChange={(event, value) => {
                            const sportsmenWithPositions = value.map((sportsman, i) => ({
                              ...sportsman,
                              id: sportsman.id,
                              position: i + 1,
                            }));
                            field.onChange(sportsmenWithPositions);
                          }}
                        />
                      )}
                    />
                  </div>
                ))}
                {
                  currentUser?.name === 'Admin' && groups.length > 0 && <Button disabled={isSubmitDisabled()} sx={{ width: '100%', mt: 4 }} type='submit' variant='contained'>Добавить</Button>
                }
              </form>
            </Box>
          }
          {
            startList.map((startList, index) => (
              <Box key={index}>
                {
                  Object.keys(startList.sportsmen).map((key, index) => (
                    <Box sx={{ my: 5 }} key={index}>
                      <Typography sx={{ mb: 2 }} variant='h4'>{key}</Typography>
                      <form>
                        {
                          currentUser?.name === 'Admin' && eventRegistration.event_registration_setting.condition.status === 'true' ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <TextField
                                id="outlined-basic"
                                label="Ветер"
                                variant="outlined"
                                size='small'
                                sx={{ my: 2 }}
                              />
                              <Button type='submit' variant='contained'>
                                Сохранить
                              </Button>
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
                                  {currentUser?.name === 'Admin' &&
                                    <>
                                      <TableCell>Результат</TableCell>
                                      <TableCell>Занятое место</TableCell>
                                      <TableCell></TableCell>
                                      <TableCell></TableCell>
                                    </>
                                  }
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
                                        {/* {
                                          sportsmen.sportsman.sportsmen_disciplines.map((discipline: any, index: number) => (
                                            <Typography key={discipline.id} component={'span'}>
                                              {discipline.sb}
                                            </Typography>
                                          ))
                                        } */
                                      
                                        
                                        }
                                      </TableCell>
                                      {currentUser?.name === 'Admin' &&
                                        <>
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
                                        </>
                                      }
                                      {currentUser?.name === 'Admin' &&
                                        <TableCell>
                                          <Trash2 color='red' className='cursor-pointer' />
                                        </TableCell>}
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
    </Box>
  )
}

export default EventRegistrationSportsmens