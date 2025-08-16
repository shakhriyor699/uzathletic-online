"use client"
import type { IUserData } from "@/types/authTypes"
import type { IEventRegistrationResponse } from "@/types/eventRegistrationTypes"
import type { StartListSportsmen } from "@/types/startListType"
import TabContext from "@mui/lab/TabContext"
import TabList from "@mui/lab/TabList"
import TabPanel from "@mui/lab/TabPanel"
import {
  Box,
  Button,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material"
import React, { useEffect, useMemo, type FC } from "react"
import { saveAs } from "file-saver"
import {
  Document,
  Packer,
  Paragraph,
  Table as DocxTable,
  TableCell as DocxTableCell,
  TableRow as DocxTableRow,
  WidthType,
  TextRun,
} from "docx"
import { FaFileWord } from "react-icons/fa"
import { Controller, type FieldValues, useFieldArray, useForm } from "react-hook-form"
import { ArrowLeftFromLine, CircleMinus, CirclePlus } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "sonner"
import SportsmanRow from "./SportsmenRow"

interface UserEventRegSportsmenProps {
  eventRegistration: IEventRegistrationResponse
  startList: StartListSportsmen[]
  currentUser: IUserData
  eventSportsmen?: any
}

type Sportsman = {
  id: number; // уникальный ID спортсмена
  firstName: string;
  lastName: string;
  age: number;
  gender: "male" | "female"; // или string, если не ограничивать
  country?: string; // необязательное поле
  team?: string; // необязательное поле
  sport?: string; // вид спорта
  pivot: {
    position: number | string; // позиция в списке (число или строка)
    [key: string]: any; // если в pivot могут быть дополнительные поля
  };
  [key: string]: any; // дополнительные поля спортсмена
};

const UserEventRegSportsmen: FC<UserEventRegSportsmenProps> = ({
  eventRegistration,
  startList,
  currentUser,
  eventSportsmen,
}) => {
  const [value, setValue] = React.useState("1")
  const [startListSpostsmen, setStartListSportsmen] = React.useState<StartListSportsmen[]>([])
  // const isSpecialSportType = useMemo(() => [51, 52, 54, 55, 56, 57, 65, 66, 68, 69, 70, 71].includes(eventRegistration.sport_type_id), [
  //   eventRegistration.sport_type_id])

  const isSpecialSportType = useMemo(() =>
    [51, 52, 54, 55, 56, 57, /* 65, */ 64, 66, 68, 69, 70, 71].includes(eventRegistration.sport_type_id),
    []);

  const shouldShowWindField = useMemo(() =>
    [51, 52, 64, 66].includes(eventRegistration.sport_type_id),
    []);

  const isSpecialSportTypeWithPoints = useMemo(() => [50, 53, /* 64, */ 65, 67].includes(eventRegistration.sport_type_id), [])

  const isSpecialSportTypeWithHight = useMemo(() => [50].includes(eventRegistration.sport_type_id), [])


  // useEffect(() => {
  //   const dataWithState = startList.map((s) => ({
  //     ...s,
  //     sportsmen: Object.keys(s.sportsmen).reduce<Record<string, any[]>>((acc, key) => {
  //       acc[key] = s.sportsmen[key].map((sportsman: any) => ({
  //         ...sportsman,
  //         isDisabled: false,
  //       }))
  //       return acc
  //     }, {}),
  //   }));
  //   // console.log(dataWithState, 'dataWithState');
  //   setStartListSportsmen(dataWithState);

  // }, [startList])
  // console.log(startListSpostsmen, 'dataWithState');

  // const sortedSportsmen = [...eventSportsmen?.sportsmen].sort((a, b) => {
  //   const posA = isNaN(Number(a.pivot.position)) ? Infinity : Number(a.pivot.position);
  //   const posB = isNaN(Number(b.pivot.position)) ? Infinity : Number(b.pivot.position);
  //   return posA - posB;
  // });

  const sortedGroups = (Object.entries(eventSportsmen?.sportsmen || {}) as [string, any[]][])
    .map(([groupKey, sportsmen]) => {
      const sortedSportsmen = [...sportsmen].sort((a, b) => {
        const posA = isNaN(Number(a.pivot.position)) ? Infinity : Number(a.pivot.position);
        const posB = isNaN(Number(b.pivot.position)) ? Infinity : Number(b.pivot.position);
        return posA - posB;
      });

      return { groupKey, sportsmen: sortedSportsmen };
    });

  const defaultValues = useMemo(() => ({
    position: {},
    result: {},
    attempts: {},
    wind: {},
    resultAfterThreeAttempts: {},
    points: {},
  }), []);

  const { register, handleSubmit, reset, control, resetField, getValues } = useForm<FieldValues>({
    mode: "onChange",
    defaultValues
  })

  const router = useRouter()
  const attempts = eventRegistration.attempts

  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: "points"
  // });

  // const handleAddPoint = () => {
  //   append({ point: "" });
  // }

  // const handleRemovePoint = (index: number) => {
  //   remove(index);
  // }



  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const downloadDoc = () => {
    const tables: any = startList?.flatMap((startListItem: any, index) => {
      return Object.keys(startListItem.sportsmen || {}).flatMap((key) => {
        const titleParagraph = new Paragraph({
          children: [new TextRun({ text: key, bold: true, size: 20 })],
          spacing: { after: 200 },
        })

        const tableRows = startListItem.sportsmen[key]
          ?.map((athlete: any) => {
            if (!athlete.sportsman) return null

            return new DocxTableRow({
              children: [
                new DocxTableCell({ children: [new Paragraph((index + 1).toString())] }),
                new DocxTableCell({ children: [new Paragraph(athlete.sportsman.chest_number)] }),
                new DocxTableCell({ children: [new Paragraph(athlete.sportsman.name || "")] }),
                new DocxTableCell({ children: [new Paragraph(athlete.sportsman.family_name || "")] }),
                new DocxTableCell({ children: [new Paragraph(athlete.sportsman.address || "")] }),
                new DocxTableCell({
                  children: [
                    new Paragraph(
                      athlete.sportsman.sportsmen_disciplines?.map((discipline: any) => discipline.sb).join(", ") || "",
                    ),
                  ],
                }),
              ],
            })
          })
          .filter((row: any) => row !== null)

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
        })
        return [titleParagraph, table]
      })
    })

    const dateParagraph = new Paragraph({
      children: [new TextRun({ text: "Дата проведения: (число.месяц.год)", size: 14 })],
    })

    const cityParagraph = new Paragraph({
      children: [new TextRun({ text: "Город:", size: 14 })],
    })

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [dateParagraph, cityParagraph, ...tables],
        },
      ],
    })

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "Athletes.docx")
    })
  }



  const downloadTxt = () => {
    const rows: any = startList?.map((startListItem: any) => {
      return Object.keys(startListItem.sportsmen).map((key) => {
        return startListItem.sportsmen[key]
          .map(
            (athlete: any) =>
              `A,${athlete.sportsman.name},${athlete.sportsman.family_name},${athlete.sportsman.birth},${athlete.sportsman.gender_id === 1 ? "M" : "F"},${athlete.sportsman.address},${athlete.sportsman.sportsmen_disciplines?.map((discipline: any) => discipline.sb).join(", ")},M\n`,
          )
          .join("\n")
      })
    })
    const blob = new Blob(rows, { type: "text/plain;charset=utf-8" })
    saveAs(blob, "Athletes.txt")
  }

  const onSubmitSportsmans = async (data: FieldValues, id: number) => {


    let formattedAttempts: any = []

    if (data.attempts && typeof data.attempts === "object") {
      formattedAttempts = Object.entries(data.attempts).map(([key, value]) => ({
        id,
        value,
      }))
    }





    const payload: any = {
      event_registration_id: Number(eventRegistration.id),
      sportsman_id: id,
      attempts: formattedAttempts,
      result: data.result,
      position: data.position,
      condition: {
        wind: data.wind,
        sport_type_number: eventSportsmen.sport_type.sport_type_number
      },
    }


    if (isSpecialSportType) {
      formattedAttempts.push({ key: "resultAfterThreeAttempts", value: data.resultAfterThreeAttempts || "" })
      // payload.resultAfterThreeAttempts = data.resultAfterThreeAttempts || ""
      payload.condition = {
        wind: data.condition || "",
        sport_type_number: eventSportsmen.sport_type.sport_type_number
      }
    }

    if (isSpecialSportTypeWithPoints && data.pointsAttachment) {
      payload.attempts = data.pointsAttachment.map((point: any) => ({
        height: point.height,
        point: point.point
      }))
    }

    console.log(data);

    console.log("Sending payload:", payload, data, 'data');




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

  const handleSubmitWithId = (id: number) => {
    handleSubmit((data) => {
      console.log(data, 'asdasd');


      // const sportsman = eventSportsmen.sportsmen.find((s: any) => s.id === id)
      const allSportsmen = Object.values(eventSportsmen?.sportsmen || {}).flat()
      const sportsman = allSportsmen.find((s: any) => s.id === id)
      if (sportsman) {

        const attemptValues: any = {}
        for (let i = 1; i <= (isSpecialSportType ? 6 : 3); i++) {
          if (data.attempt && data.attempt[i]) {
            attemptValues[i] = data.attempt[i]
          }
        }

        const payload: any = {
          event_registration_id: Number(eventRegistration.id),
          sportsman_id: id,
          result: data.result[id],
          position: data.position[id],
          attempts: attemptValues,
          condition: data.condition,
        }


        if (isSpecialSportType) {
          console.log(data, 'data');

          payload.resultAfterThreeAttempts = data.resultAfterThreeAttempts ? data.resultAfterThreeAttempts[id] : ""

          payload.attempts = data.attempt[id].map((attempt: any, i: number) => ({
            key: id,
            value: attempt
          }))

          if (shouldShowWindField) {
            payload.condition = data.wind[id].map((wind: any, i: number) => ({
              key: id,
              value: wind
            }))
          }



          console.log(payload, 'payload1');



          // const windValues: any = {}
          // for (let i = 1; i <= 6; i++) {
          //   if (data.wind && data.wind[i]) {
          //     windValues[i] = data.wind[i]
          //   }
          // }
          // payload.wind = windValues
        }



        if (isSpecialSportTypeWithPoints && data.points) {

          const heightsArray: any[] = [];

          Object.entries(data.points).forEach(([key, value]) => {
            if (!Array.isArray(value) && typeof value === "object" && value !== null && "heights" in value) {
              heightsArray.push({
                height: value.heights
              });
            }
          });

          payload.heights = heightsArray.flat();


          payload.pointsAttachment = data.points[id].map((point: any) => ({
            height: heightsArray,
            point: point.point,
          }))
          // console.log(data.points[id], 'data');
          console.log(payload, 'payload');


        }


        onSubmitSportsmans(payload, id)
      }
    })()
  }



  return (
    <Box>
      <Button variant="outlined" startIcon={<ArrowLeftFromLine />} onClick={() => router.back()}></Button>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Спортсмены" value="1" />
            <Tab label="Стартлист" value="2" />
            {eventSportsmen && !Array.isArray(eventSportsmen) && <Tab label="Результаты" value="3" />}
            {/* <Tab label="Item Three" value="3" /> */}
          </TabList>
        </Box>
        <TabPanel value="1">
          <Paper sx={{ width: "100%" }}>
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
                  {eventRegistration?.sportsmen.map((sportsmen, index) => (
                    <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell component="th" scope="row">
                        {sportsmen.name}
                      </TableCell>
                      <TableCell>{sportsmen.family_name}</TableCell>
                      <TableCell>{sportsmen.birth}</TableCell>
                      <TableCell>{sportsmen.chest_number}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </TabPanel>
        <TabPanel value="2">
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h4">Стартлист</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            {startList && (
              <Button
                onClick={downloadDoc}
                type="button"
                variant="contained"
                sx={{ my: 2, display: "flex", alignItems: "center", gap: 1 }}
              >
                <FaFileWord />
                Скачать стартлист
              </Button>
            )}
            {/* {
              startList && <Button onClick={downloadTxt} type='button' variant='contained' sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <BsFiletypeTxt />
                Скачать TXT</Button>
            } */}
          </Box>

          {startList.map((startList, index) => (
            <Box key={index}>
              {Object.keys(startList.sportsmen).map((key, index) => (
                <Box sx={{ my: 5 }} key={index}>
                  <Typography sx={{ mb: 2 }} variant="h4">
                    {key}
                  </Typography>
                  <form className=" w-[100%] mx-auto">
                    {eventRegistration.event_registration_setting.condition.status === "true" ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Controller
                          name={`condition`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              id="outlined-basic"
                              label="Ветер"
                              disabled={startList.isDisabled}
                              variant="outlined"
                              size="small"
                              sx={{ my: 2 }}
                            />
                          )}
                        />

                        {/* <Button type='submit' variant='contained'>
                              Сохранить
                            </Button> */}
                      </Box>
                    ) : null}
                    <Paper sx={{ width: "100%" }}>
                      <TableContainer sx={{ maxHeight: 440, overflow: "auto" }}>
                        <Table stickyHeader aria-label="sticky table">
                          <TableHead>
                            <TableRow>
                              <TableCell>№</TableCell>
                              <TableCell>Спортсмен</TableCell>
                              <TableCell>Регион</TableCell>
                              <TableCell>BIB</TableCell>
                              {/* <TableCell>Заявленый результат</TableCell> */}

                              {eventRegistration.user_id === currentUser.id ? (
                                // && eventRegistration.sport_type_id >= 1 && eventRegistration.sport_type_id <= 49
                                <TableCell align="center">Попытки</TableCell>
                              ) : null}
                              {eventRegistration.user_id === currentUser.id ? (
                                // && eventRegistration.sport_type_id >= 1 && eventRegistration.sport_type_id <= 49
                                <TableCell>Результат</TableCell>
                              ) : null}
                              {eventRegistration.user_id === currentUser.id ? (
                                // && eventRegistration.sport_type_id >= 1 && eventRegistration.sport_type_id <= 49
                                <TableCell>Место</TableCell>
                              ) : null}
                              <TableCell align="center">Действие</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {startList.sportsmen[key].map((sportsmen: any, index: number) => (
                              <SportsmanRow
                                key={sportsmen.sportsman.id}
                                sportsman={sportsmen.sportsman}
                                index={index}
                                control={control}
                                eventRegistration={eventRegistration}
                                currentUser={currentUser}
                                isSpecialSportType={isSpecialSportType}
                                isSpecialSportTypeWithPoints={isSpecialSportTypeWithPoints}
                                isSpecialSportTypeWithHight={isSpecialSportTypeWithHight}
                                attempts={attempts}
                                handleSubmitWithId={handleSubmitWithId}
                                shouldShowWindField={shouldShowWindField}
                                isDisabled={startList.isDisabled}
                                getValues={getValues}
                              />
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>
                  </form>
                </Box>
              ))}
            </Box>
          ))}
        </TabPanel>
        {/* <TabPanel value="3">Item Three</TabPanel> */}




        {eventSportsmen && !Array.isArray(eventSportsmen) && (
          <TabPanel value="3">
            <Box>
              <Typography variant='h4' mb={5}>Результаты</Typography>
            </Box>

            {/* <Box>
              <Button
                onClick={() => downLoadResultDoc(sortedGroups)}
                type='button'
                variant='contained'
                sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <FaFileWord />
                Скачать результаты
              </Button>
            </Box> */}

            {Object.entries(eventSportsmen?.sportsmen as Record<string, Sportsman[]> || {}).map(([groupKey, sportsmenArray]) => {
              const sortedSportsmen = [...sportsmenArray].sort((a, b) => {
                const posA = isNaN(Number(a.pivot.position)) ? Infinity : Number(a.pivot.position);
                const posB = isNaN(Number(b.pivot.position)) ? Infinity : Number(b.pivot.position);
                return posA - posB;
              });

              return (
                <Paper sx={{ width: '100%', mb: 4 }} key={groupKey}>
                  <Typography variant='h5' sx={{ p: 2 }}>
                    Группа {groupKey}
                  </Typography>

                  {!isSpecialSportType &&
                    !isSpecialSportTypeWithPoints &&
                    sortedSportsmen?.[0]?.pivot?.condition?.wind && (
                      <Typography variant="h6" sx={{ mb: 2, ml: 2 }}>
                        Ветер: {sortedSportsmen[0].pivot.condition.wind}
                      </Typography>
                    )}

                  <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          <TableCell>№</TableCell>
                          <TableCell>Спортсмен</TableCell>
                          <TableCell>Дата рождения</TableCell>
                          <TableCell align="center">Регион</TableCell>
                          <TableCell align="center">BIB</TableCell>

                          {/* Заголовки попыток */}
                          {!isSpecialSportType &&
                            !isSpecialSportTypeWithPoints &&
                            eventSportsmen?.attempts?.length > 0 &&
                            eventSportsmen.attempts.map((_: any, index: number) => (
                              <TableCell key={`attempt-header-${index}`}>Попытка {index + 1}</TableCell>
                            ))}

                          {isSpecialSportTypeWithPoints &&
                            sortedSportsmen.length > 0 &&
                            sortedSportsmen[0]?.pivot?.attempts?.[0]?.height?.map((item: any, index: number) => (
                              <TableCell align="center" key={index}>{item.height}</TableCell>
                            ))
                          }

                          <TableCell>Результат</TableCell>
                          <TableCell>Занятое место</TableCell>
                          {currentUser?.name === 'Admin' && <TableCell>Действия</TableCell>}
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {sortedSportsmen.map((sportsman: any, index: number) => (
                          <React.Fragment key={`row-${index}`}>
                            <TableRow>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{`${sportsman.family_name} ${sportsman.name}`}</TableCell>
                              <TableCell>{sportsman.birth}</TableCell>
                              <TableCell align='center'>
                                {sportsman.address.split("–").pop().trim()}
                              </TableCell>
                              <TableCell align="center">{sportsman.chest_number}</TableCell>

                              {/* Попытки для обычного типа */}
                              {isSpecialSportType && sortedSportsmen.length > 0 &&
                                sportsman?.pivot?.attempts?.map((key: any, attemptIndex: number) => (
                                  key?.key !== 'resultAfterThreeAttempts' && (
                                    <TableCell align="center" key={`attempt-${attemptIndex}`}>
                                      {shouldShowWindField && (
                                        <p>
                                          {sportsman?.pivot?.condition?.wind?.[attemptIndex + 1]?.value || ''}
                                        </p>
                                      )}
                                      <p>{key?.value?.value}</p>
                                    </TableCell>
                                  )
                                ))
                              }

                              {/* Попытки для типа с поинтами */}
                              {isSpecialSportTypeWithPoints && (() => {
                                const maxAttempts = Math.max(
                                  ...sortedSportsmen.map((s: any) => s.pivot?.attempts?.length || 0)
                                );
                                return Array.from({ length: maxAttempts }).map((_, attemptIndex) => (
                                  <TableCell align="center" key={`point-${attemptIndex}`}>
                                    {sportsman?.pivot?.attempts?.[attemptIndex]?.point ?? '-'}
                                  </TableCell>
                                ));
                              })()}

                              <TableCell>{sportsman.pivot.result || '-'}</TableCell>
                              <TableCell>{sportsman.pivot.position || '-'}</TableCell>


                            </TableRow>
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              );
            })}
          </TabPanel>
        )}
      </TabContext>
    </Box>
  )
}

export default UserEventRegSportsmen

