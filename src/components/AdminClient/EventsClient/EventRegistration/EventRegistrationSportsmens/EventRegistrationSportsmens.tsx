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
  eventSportsmen?: any
}

const EventRegistrationSportsmens: FC<EventRegistrationSportsmens> = ({
  eventRegistration,
  startList,
  currentUser,
  eventSportsmen
}) => {
  const [value, setValue] = React.useState('1');
  const [open, setOpen] = React.useState(false)
  const [selectedAthletes, setSelectedAthletes] = useState<any[]>([]);
  const { register, handleSubmit, reset, control, resetField, getValues } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues: {
      position: '',
    }
  })
  const [groups, setGroups] = useState<any[]>([]);
  const [groupName, setGroupName] = useState<string>('');
  const router = useRouter()

  console.log(eventRegistration, startList, eventSportsmen, 'asd');




  // const addGroup = () => {
  //   setGroups([...groups, { name: groupName, sportsmen: [] }]);
  //   setGroupName('');
  // };

  const addGroup = () => {
    if (!groupName.trim()) {
      toast.error('Название группы не может быть пустым');
      return;
    }
    if (groups.some(group => group.name === groupName)) {
      toast.error('Группа с таким названием уже существует');
      return;
    }
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
    // const processedData = {} as any;

    // for (const groupName in data) {
    //   if (Array.isArray(data[groupName])) {
    //     processedData[groupName] = data[groupName].map((sportsman: any) => ({
    //       sportsman_id: sportsman.id,
    //       position: sportsman.position,
    //     }));
    //   } else {
    //     console.error(`data[${groupName}] не является массивом:`, data[groupName]);
    //   }

    //   // processedData[groupName] = data[groupName].map((sportsman: any) => ({
    //   //   sportsman_id: sportsman.id,
    //   //   position: sportsman.position,
    //   // }));
    // }


    // const payload = {
    //   event_registration_id: Number(eventRegistration.id),
    //   sportsmen: processedData,
    // };
    // const res = await axios.post('/api/startList', payload)
    // if (res.status === 200) {
    //   toast.success('Спортсмен добавлен в стартлист')
    // } else {
    //   toast.error('Произошла ошибка при добавлении спортсмена в стартлист')
    // }
    // setOpen(false)
    // reset()
    // setGroups([])
    // resetField('sportsmen')
    // router.refresh()

    // console.log(data);


    try {
      const processedData = {} as Record<string, any>;

      for (const groupName in data) {
        if (groupName === 'position' || groupName === 'result') {
          continue; // пропускаем эти ключи
        }

        if (Array.isArray(data[groupName])) {
          processedData[groupName] = data[groupName]
            .filter((sportsman: any, index: number) => {
              if (!sportsman || typeof sportsman !== 'object') {
                console.error(`Invalid sportsman at index ${index} in group ${groupName}:`, sportsman);
                return false;
              }
              if (!('id' in sportsman) || !('position' in sportsman)) {
                console.error(`Missing id or position at index ${index} in group ${groupName}:`, sportsman);
                return false;
              }
              return true;
            })
            .map((sportsman: any) => ({
              sportsman_id: sportsman.id,
              position: sportsman.position,
            }));

          console.log(`Processed group ${groupName}:`, processedData[groupName]);
        } else {
          console.error(`Invalid data for group: ${groupName}`, data[groupName]);
        }
      }


      const payload = {
        event_registration_id: Number(eventRegistration.id),
        sportsmen: processedData,
      };

      console.log(payload, processedData);



      const res = await axios.post('/api/startList', payload);
      if (res.status === 200) {
        toast.success('Спортсмен добавлен в стартлист');
        reset();
        setGroups([]);
        resetField('sportsmen');
        router.refresh();
      } else {
        throw new Error('Failed to add sportsman');
      }
    } catch (error) {
      console.error('Error submitting start list:', error);
      toast.error('Произошла ошибка при добавлении спортсмена в стартлист');
    }
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
              new DocxTableCell({ children: [new Paragraph(athlete.sportsman.birth || "")] }),
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
                new DocxTableCell({ children: [new Paragraph("Регион")] }),
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



  const onSubmitSportsmans = async (data: FieldValues, id: number) => {
    // console.log(data, id);

    const payload = {
      event_registration_id: Number(eventRegistration.id),
      sportsman_id: id,
      attempts: data.attempts ? data.attempts : '',
      result: data.result,
      position: data.position,
      condition: data.condition
    };

    console.log(payload);

    try {
      const res = await axios.post('/api/eventSportsmen', payload);
      if (res.status === 200) {
        toast.success('Сохранено');
        router.refresh();
      }
    } catch (error) {
      console.error('Error submitting start list:', error);
      toast.error('Произошла ошибка');
    }

  }

  // const handleSubmitWithId = (id: number) => {
  //   handleSubmit((data) => onSubmitSportsmans(data, id))();
  // };


  const handleSubmitWithId = (id: number) => {
    handleSubmit((data) => {
      const sportsman = eventSportsmen.sportsmen.find((s: any) => s.id === id)
      if (sportsman) {
        onSubmitSportsmans(
          {
            result: data.result[id],
            position: data.position[id],
            attempts: data.attempts ? data.attempts[id] : "",
            condition: data.condition,
          },
          id,
        )
      }
    })()
  }

  console.log(startList, '23');

  const deleteStartListItem = async (id: number) => {
    
  }
  


  const downloadTxt = () => {
    // const rows: any = startList?.map((startListItem: any) => {
    //   return Object.keys(startListItem.sportsmen).map((key) => {
    //     return startListItem.sportsmen[key].map((athlete: any) => (
    //       `A,${athlete.sportsman.name},${athlete.sportsman.family_name},${athlete.sportsman.birth},${athlete.sportsman.gender_id === 1 ? 'M' : 'F'},${athlete.sportsman.address},${athlete.sport_type_number},${athlete.sportsman.sportsmen_disciplines?.map((discipline: any) => discipline.sb)},M\n`
    //     )
    //     ).join("\n")
    //   })
    // })

    const rows: any = eventSportsmen.sportsmen.map((athlete: any) => {
      return `A,${athlete.name},${athlete.family_name},${athlete.gender_id === 1 ? 'M' : 'F'},${athlete.address.split(" - ")[1]},${eventSportsmen.sport_type.sport_type_number},${athlete.sportsmen_disciplines?.map((discipline: any) => discipline.sb)},M\n`
    })
    const blob = new Blob(rows, { type: "text/plain;charset=utf-8" });
    saveAs(blob, "Athletes.txt");
  };


 


  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <Typography variant='h4' mb={5}>{eventSportsmen.name.ru}</Typography>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Спортсмены" value="1" />
            <Tab label="Стартлист" value="2" />
            {eventSportsmen && !Array.isArray(eventSportsmen) && <Tab label="Результаты" value="3" />}
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
                    <TableCell>Регион</TableCell>
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
                        <TableCell>{sportsmen.address}</TableCell>
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
                          options={eventRegistration.sportsmen.map((athletes) => ({ id: athletes.id, label: `${athletes.name} ${athletes.family_name}` }))}
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
                                  <TableCell>Год рождения</TableCell>
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
                                  startList.sportsmen[key].map((sportsmen: any, index: number) => {
                                    return (
                                      (
                                        <TableRow
                                          key={index}
                                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                          <TableCell>{index + 1}</TableCell>
                                          <TableCell component="th" scope="row">
                                            {sportsmen.sportsman.name} {sportsmen.sportsman.family_name}
                                          </TableCell>
                                          <TableCell>{sportsmen.sportsman.address}</TableCell>
                                          <TableCell>{sportsmen.sportsman.birth}</TableCell>
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
                                          {currentUser?.name === 'Admin' &&
                                            <>
                                              <TableCell>
                                                <Controller
                                                  name={`result.${sportsmen.sportsman.id}`}
                                                  control={control}
                                                  render={({ field }) => (
                                                    <TextField inputProps={{
                                                      style: { height: '7px' }
                                                    }}
                                                      placeholder='Результат'
                                                      {...field}
                                                    // {...register(`result`)}
                                                    />
                                                  )}
                                                />
                                              </TableCell>
                                              <TableCell>
                                                <Controller
                                                  name={`position.${sportsmen.sportsman.id}`}
                                                  control={control}
                                                  render={({ field }) => (
                                                    <TextField inputProps={{
                                                      style: { height: '7px' }
                                                    }}
                                                      placeholder='Место'
                                                      {...field}
                                                    // {...register(`position`)}
                                                    />
                                                  )}
                                                />
                                              </TableCell>
                                              <TableCell>
                                                <Button onClick={() => handleSubmitWithId(sportsmen.sportsman.id)} variant='contained'>Сохранить</Button>
                                              </TableCell>
                                            </>
                                          }
                                          {currentUser?.name === 'Admin' &&
                                            <TableCell>
                                              <Trash2 color='red' className='cursor-pointer' />
                                            </TableCell>}
                                        </TableRow>
                                      )
                                    )
                                  })
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
        {eventSportsmen && !Array.isArray(eventSportsmen) && <TabPanel value="3">
          <Box>
            <Typography variant='h4' mb={5}>Результаты</Typography>
          </Box>
          <Paper sx={{ width: '100%' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell>№</TableCell>
                    <TableCell>Спортсмен</TableCell>
                    <TableCell>Вид</TableCell>
                    {eventSportsmen?.attempts.length > 0 && <TableCell>
                      {
                        eventSportsmen?.attempts.map((item: any) => {
                          // const filteredAttempts = item.event_registration.attempts.filter((item: any) => {
                          //   return Object.values(item).some((value: any) => value.trim() !== "");
                          // });
                          return (
                            item.length > 0 && 'Попытки'
                          )
                        })
                      }
                    </TableCell>}
                    <TableCell>Результат</TableCell>
                    <TableCell>Занятое место</TableCell>
                    <TableCell>Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    eventSportsmen.sportsmen.map((sportsmen: any, index: number) => (
                      <TableRow key={eventSportsmen.id}>
                        <TableCell>{sportsmen.id}</TableCell>
                        <TableCell>{sportsmen.name} {sportsmen.family_name}</TableCell>
                        <TableCell>{eventSportsmen.name.ru}</TableCell>
                        <TableCell>{sportsmen.pivot.result || 'нет результата'}</TableCell>
                        <TableCell>{sportsmen.pivot.position || 'нет результата'}</TableCell>

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
        </TabPanel>}
      </TabContext>
    </Box >
  )
}

export default EventRegistrationSportsmens