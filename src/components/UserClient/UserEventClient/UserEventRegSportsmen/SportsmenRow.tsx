'use client'
import { useSportsmanPoints } from "@/hooks/useSportsmenPoints";
import { IUserData } from "@/types/authTypes";
import { IEventRegistrationResponse } from "@/types/eventRegistrationTypes";
import { Box, Button, TableCell, TableRow, TextField } from "@mui/material";
import { CircleMinus, CirclePlus } from "lucide-react";
import { FC, useEffect, useRef } from "react";
import { Control, Controller, FieldValues, useFieldArray } from "react-hook-form";


interface SportsmanRowProps {
  sportsman: any;
  index: number;
  control: Control<FieldValues>;
  eventRegistration: IEventRegistrationResponse;
  currentUser: IUserData;
  isSpecialSportType: boolean;
  isSpecialSportTypeWithPoints: boolean;
  attempts: any[];
  handleSubmitWithId: (id: number) => void;
  shouldShowWindField: boolean
}

const SportsmanRow: FC<SportsmanRowProps> = ({
  sportsman,
  index,
  control,
  eventRegistration,
  currentUser,
  isSpecialSportType,
  isSpecialSportTypeWithPoints,
  attempts,
  handleSubmitWithId,
  shouldShowWindField
}) => {
  // Уникальный useFieldArray для каждого спортсмена
  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: `points.${sportsman.id}`, // points.<sportsmanId>.[]
  // });

  const { fields, append, remove } = useSportsmanPoints(control, sportsman.id);

  const hasInitialized = useRef(false);


  useEffect(() => {
    if (isSpecialSportTypeWithPoints && !hasInitialized.current && fields.length === 0) {
      append({ height: "", point: "" });
      hasInitialized.current = true;
    }
  }, [isSpecialSportTypeWithPoints]);

  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell>{index + 1}</TableCell>
      <TableCell component="th" scope="row">
        {sportsman.name} {sportsman.family_name}
      </TableCell>
      <TableCell>{sportsman.address.split(" - ")[1]}</TableCell>
      <TableCell>{sportsman.chest_number}</TableCell>


      {eventRegistration.user_id === currentUser.id && (
        <TableCell sx={{ display: "flex", gap: 1, alignItems: "center" }} align="center">
          {attempts.slice(0, 3).map((_, attemptIndex) => (
            <Box key={attemptIndex} sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
              {shouldShowWindField && (
                <Controller
                  name={`wind.${sportsman.id}.${attemptIndex + 1}`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      inputProps={{ style: { height: "7px", width: "70px" } }}
                      placeholder={`Ветер`}
                      {...field}
                    />
                  )}
                />
              )}
              <Controller
                name={`attempt.${sportsman.id}.${attemptIndex + 1}`}
                control={control}
                render={({ field }) => (
                  <TextField
                    inputProps={{ style: { height: "7px", width: "70px" } }}
                    placeholder={`Попытка № ${attemptIndex + 1}`}
                    {...field}
                  />
                )}
              />
            </Box>
          ))}

          {isSpecialSportType && (
            <Controller
              name={`resultAfterThreeAttempts.${sportsman.id}`}
              control={control}
              render={({ field }) => (
                <TextField
                  inputProps={{ style: { height: "7px", width: "80px" } }}
                  placeholder="Результат после 3 попыток"
                  {...field}
                />
              )}
            />
          )}

          {isSpecialSportType &&
            attempts.slice(3, 6).map((_, attemptIndex) => (
              <Box key={attemptIndex + 3} sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
                {shouldShowWindField && <Controller
                  name={`wind.${sportsman.id}.${attemptIndex + 4}`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      inputProps={{ style: { height: "7px", width: "70px" } }}
                      placeholder={`Ветер`}
                      {...field}
                    />
                  )}
                />}
                <Controller
                  name={`attempt.${sportsman.id}.${attemptIndex + 4}`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      inputProps={{ style: { height: "7px", width: "70px" } }}
                      placeholder={`Попытка № ${attemptIndex + 4}`}
                      {...field}
                    />
                  )}
                />
              </Box>
            ))}

          {/* Поля для высоты и очков (только для isSpecialSportTypeWithPoints) */}
          {isSpecialSportTypeWithPoints && (
            <>
              {fields.map((field, pointIndex) => (
                <Box key={field.id} sx={{ display: "flex", gap: 0.5 }}>
                  <Box className="flex flex-col gap-2">
                    <Controller
                      name={`points.${sportsman.id}.${pointIndex}.height`}
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
                      name={`points.${sportsman.id}.${pointIndex}.point`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          inputProps={{ style: { height: "7px", width: "120px" } }}
                          placeholder={``}
                          {...field}
                        />
                      )}
                    />
                  </Box>
                  <Button
                    className="p-0 min-w-[20px]"
                    color="error"
                    onClick={() => remove(pointIndex)}
                  >
                    <CircleMinus />
                  </Button>
                </Box>
              ))}
              <Button
                className="p-0 min-w-[20px]"
                onClick={() => append({ height: "", point: "" })}
              >
                <CirclePlus />
              </Button>
            </>
          )}
        </TableCell>
      )}

      {/* Результат */}
      <TableCell>
        {eventRegistration.user_id === currentUser.id && (
          <Controller
            name={`result.${sportsman.id}`}
            control={control}
            render={({ field }) => (
              <TextField
                inputProps={{ style: { height: "7px", width: "100px" } }}
                placeholder="Результат"
                {...field}
              />
            )}
          />
        )}
      </TableCell>

      {/* Место */}
      <TableCell>
        {eventRegistration.user_id === currentUser.id && (
          <Controller
            name={`position.${sportsman.id}`}
            control={control}
            render={({ field }) => (
              <TextField
                inputProps={{ style: { height: "7px", width: "100px" } }}
                placeholder="Место"
                {...field}
              />
            )}
          />
        )}
      </TableCell>

      {/* Кнопка сохранения */}
      <TableCell>
        {eventRegistration.user_id === currentUser.id && (
          <Button
            onClick={() => handleSubmitWithId(sportsman.id)}
            variant="contained"
          >
            Сохранить
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};


export default SportsmanRow