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
import React, { useMemo, type FC } from "react"
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

interface UserEventRegSportsmenProps {
  eventRegistration: IEventRegistrationResponse
  startList: StartListSportsmen[]
  currentUser: IUserData
  eventSportsmen?: any
}

const UserEventRegSportsmen: FC<UserEventRegSportsmenProps> = ({
  eventRegistration,
  startList,
  currentUser,
  eventSportsmen,
}) => {
  const [value, setValue] = React.useState("1")
  const isSpecialSportType = useMemo(() => [51, 52, 54, 55, 56, 57, 65, 66, 68, 69, 70, 71].includes(eventRegistration.sport_type_id), [
    eventRegistration.sport_type_id])

  const isSpecialSportTypeWithPoints = useMemo(() => [50, 53, 64, 67].includes(eventRegistration.sport_type_id), [eventRegistration.sport_type_id])

  const defaultValues = useMemo(() => ({
    position: "",
    result: "",
    ...(isSpecialSportTypeWithPoints ? { points: [{ point: "" }] } : {})
  }), [isSpecialSportTypeWithPoints]);

  const { register, handleSubmit, reset, control, resetField, getValues } = useForm<FieldValues>({
    mode: "onChange",
    defaultValues
  })
  
  const router = useRouter()
  const attempts = eventRegistration.attempts

  const { fields, append, remove } = useFieldArray({
    control,
    name: "points"
  });

  const handleAddPoint = () => {
    append({ point: "" });
  }

  const handleRemovePoint = (index: number) => {
    remove(index);
  }



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
        key,
        value,
      }))
    }

    if (isSpecialSportType) {
      formattedAttempts.push({ key: "resultAfterThreeAttempts", value: data.resultAfterThreeAttempts || "" })
      // payload.resultAfterThreeAttempts = data.resultAfterThreeAttempts || ""
      // payload.wind = data.wind || ""
    }




    const payload: any = {
      event_registration_id: Number(eventRegistration.id),
      sportsman_id: id,
      attempts: formattedAttempts,
      result: data.result,
      position: data.position,
      condition: data.wind,
    }

    if (isSpecialSportTypeWithPoints && data.pointsAttachment) {
      payload.attempts = data.pointsAttachment.map((point: any) => ({
        height: point.height,
        point: point.point
      }))
    }

    console.log(data);

    console.log("Sending payload:", payload);



    // try {
    //   const res = await axios.post('/api/eventSportsmen', payload);
    //   if (res.status === 200) {
    //     toast.success('Сохранено');
    //     router.refresh();
    //   }
    // } catch (error) {
    //   console.error('Error submitting start list:', error);
    //   toast.error('Произошла ошибка');
    // }
  }

  const handleSubmitWithId = (id: number) => {
    handleSubmit((data) => {

      const sportsman = eventSportsmen.sportsmen.find((s: any) => s.id === id)
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
          payload.resultAfterThreeAttempts = data.resultAfterThreeAttempts ? data.resultAfterThreeAttempts[id] : ""


          const windValues: any = {}
          for (let i = 1; i <= 6; i++) {
            if (data.wind && data.wind[i]) {
              windValues[i] = data.wind[i]
            }
          }
          payload.wind = windValues
        }

        if (isSpecialSportTypeWithPoints && data.points) {
          payload.pointsAttachment = data.points.map((point: any) => ({
            height: point.height,
            point: point.point,
          }))
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
                  <form className="max-w-[1250px] w-[100%] mx-auto">
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
                              <TableCell>Заявленый результат</TableCell>

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
                              <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell component="th" scope="row">
                                  {sportsmen.sportsman.name} {sportsmen.sportsman.family_name}
                                </TableCell>
                                <TableCell>{sportsmen.sportsman.address}</TableCell>
                                <TableCell>{sportsmen.sportsman.chest_number}</TableCell>
                                <TableCell>
                                  {sportsmen.sportsman.sportsmen_disciplines.map((discipline: any, index: number) => (
                                    <Typography key={discipline.id} component={"span"}>
                                      {discipline.sb}
                                    </Typography>
                                  ))}
                                </TableCell>
                                {eventRegistration.user_id === currentUser.id ? (
                                  // && eventRegistration.sport_type_id >= 1 && eventRegistration.sport_type_id <= 49
                                  <TableCell sx={{ display: "flex", gap: 1, alignItems: "center" }} align="center">
                                    {attempts.slice(0, 3).map((attempt, index) => (
                                      <Box key={index} sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
                                        {isSpecialSportType && <Controller
                                          name={`wind.${index + 1}`}
                                          control={control}
                                          render={({ field }) => (
                                            <TextField
                                              inputProps={{ style: { height: "7px" } }}
                                              placeholder={`Ветер`}
                                              {...field}
                                            />
                                          )}
                                        />}
                                        <Controller
                                          name={`attempt.${index + 1}`}
                                          control={control}
                                          render={({ field }) => (
                                            <TextField
                                              inputProps={{
                                                style: { height: "7px" },
                                              }}
                                              placeholder={`Попытка № ${index + 1}`}
                                              {...field}
                                            />
                                          )}
                                        />

                                        {/* {
                                                  eventRegistration.event_registration_setting.condition.status === 'false' &&
                                                  <TextField inputProps={{
                                                    style: { height: '7px' }
                                                  }} placeholder={`Ветер`} />
                                                } */}
                                      </Box>
                                    ))}

                                    {isSpecialSportType && (
                                      <Controller
                                        name={`resultAfterThreeAttempts.${sportsmen.sportsman.id}`}
                                        control={control}
                                        render={({ field }) => (
                                          <TextField
                                            inputProps={{ style: { height: "7px" } }}
                                            placeholder="Результат после 3 попыток"
                                            // sx={{ mt:  }}
                                            {...field}
                                          />
                                        )}
                                      />
                                    )}

                                    {isSpecialSportType &&
                                      attempts.slice(3, 6).map((attempt, index) => (
                                        <Box key={index + 3} sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
                                          <Controller
                                            name={`wind.${index + 4}`}
                                            control={control}
                                            render={({ field }) => (
                                              <TextField
                                                inputProps={{ style: { height: "7px" } }}
                                                placeholder={`Ветер`}
                                                {...field}
                                              />
                                            )}
                                          />

                                          <Controller
                                            name={`attempt.${index + 4}`}
                                            control={control}
                                            render={({ field }) => (
                                              <TextField
                                                inputProps={{ style: { height: "7px" } }}
                                                placeholder={`Попытка № ${index + 4}`}
                                                {...field}
                                              />
                                            )}
                                          />

                                          {/* {eventRegistration.event_registration_setting.condition.status === 'false' && (
                                                      <TextField
                                                        inputProps={{ style: { height: '7px' } }}
                                                        placeholder="Ветер"
                                                      />
                                                    )} */}
                                        </Box>
                                      ))}

                                    {isSpecialSportTypeWithPoints &&
                                      fields.map((field, index) => (
                                        <Box key={field.id} sx={{ display: "flex", gap: 0.5 }}>
                                          <Box className='flex flex-col gap-2'>
                                            <Controller
                                              // name={`points.${index}.height`}
                                              name={`points.${sportsmen.sportsman.id}.height`}
                                              control={control}
                                              render={({ field }) => (
                                                <TextField
                                                  inputProps={{ style: { height: "7px", width: "120px" } }}
                                                  placeholder={`Высота`}
                                                  {...field}
                                                />
                                              )}
                                            />
                                            <Controller
                                              // name={`points.${index}.point`}
                                              name={`points.${sportsmen.sportsman.id}.point`}
                                              control={control}
                                              render={({ field }) => (
                                                <TextField
                                                  inputProps={{ style: { height: "7px", width: "120px" } }}
                                                  placeholder={`Очко`}
                                                  {...field}
                                                />
                                              )}
                                            />
                                          </Box>
                                          <Button className="p-0 min-w-[20px]" color="error" onClick={() => handleRemovePoint(sportsmen.sportsman.id)}>
                                            <CircleMinus />
                                          </Button>
                                        </Box>
                                      ))

                                    }
                                    {isSpecialSportTypeWithPoints && <Button className="p-0 min-w-[20px]" onClick={handleAddPoint}>
                                      <CirclePlus />
                                    </Button>}

                                  </TableCell>
                                ) : null}
                                <TableCell>
                                  {eventRegistration.user_id === currentUser.id ? (
                                    // && eventRegistration.sport_type_id >= 1 && eventRegistration.sport_type_id <= 49
                                    <Controller
                                      name={`result.${sportsmen.sportsman.id}`}
                                      control={control}
                                      render={({ field }) => (
                                        <TextField
                                          inputProps={{
                                            style: { height: "7px", width: "100px" },
                                          }}
                                          placeholder="Результат"
                                          {...field}
                                        // {...register(`result`)}
                                        />
                                      )}
                                    />
                                  ) : null}
                                </TableCell>
                                <TableCell>
                                  {eventRegistration.user_id === currentUser.id ? (
                                    // && eventRegistration.sport_type_id >= 1 && eventRegistration.sport_type_id <= 49
                                    <Controller
                                      name={`position.${sportsmen.sportsman.id}`}
                                      control={control}
                                      render={({ field }) => (
                                        <TextField
                                          inputProps={{
                                            style: { height: "7px", width: "100px" },
                                          }}
                                          placeholder="Место"
                                          {...field}
                                        // {...register(`position`)}
                                        />
                                      )}
                                    />
                                  ) : null}
                                </TableCell>
                                <TableCell>
                                  {eventRegistration.user_id === currentUser.id ? (
                                    // && eventRegistration.sport_type_id >= 1 && eventRegistration.sport_type_id <= 49
                                    <Button
                                      onClick={() => handleSubmitWithId(sportsmen.sportsman.id)}
                                      variant="contained"
                                    >
                                      Сохранить
                                    </Button>
                                  ) : null}
                                </TableCell>
                              </TableRow>
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
      </TabContext>
    </Box>
  )
}

export default UserEventRegSportsmen

