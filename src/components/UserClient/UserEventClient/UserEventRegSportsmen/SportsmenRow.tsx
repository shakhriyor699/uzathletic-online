'use client'
import { useSportsmanPoints } from "@/hooks/useSportsmenPoints";
import { useSportsmenPointsStore } from "@/hooks/useSportsmenPointsStore";
import { IUserData } from "@/types/authTypes";
import { IEventRegistrationResponse } from "@/types/eventRegistrationTypes";
import { Box, Button, TableCell, TableRow, TextField } from "@mui/material";
import { CircleMinus, CirclePlus } from "lucide-react";
import { FC, useEffect, useRef } from "react";
import { Control, Controller, FieldValues, useFieldArray } from "react-hook-form";
import { useFormContext } from "react-hook-form";


interface SportsmanRowProps {
  sportsman: any;
  index: number;
  control: Control<FieldValues>;
  eventRegistration: IEventRegistrationResponse;
  currentUser: IUserData;
  isSpecialSportType: boolean;
  isSpecialSportTypeWithPoints: boolean;
  isSpecialSportTypeWithHight: boolean;
  attempts: any[];
  handleSubmitWithId: (id: number) => void;
  shouldShowWindField: boolean
  isDisabled?: boolean
  getValues: any
}

const SportsmanRow: FC<SportsmanRowProps> = ({
  sportsman,
  index,
  control,
  eventRegistration,
  currentUser,
  isSpecialSportType,
  isSpecialSportTypeWithPoints,
  isSpecialSportTypeWithHight,
  attempts,
  handleSubmitWithId,
  shouldShowWindField,
  isDisabled,
  getValues
}) => {
  // Уникальный useFieldArray для каждого спортсмена
  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: `points.${sportsman.id}`, // points.<sportsmanId>.[]
  // });

  const { fields, append, remove } = useSportsmanPoints(control, sportsman.id);

  useEffect(() => {
    useSportsmenPointsStore.getState().set(sportsman.id, { append, remove });
  }, [append, remove, sportsman.id]);

  const handleAddPointToAll = () => {
    const store = useSportsmenPointsStore.getState().store;
    Object.values(store).forEach(({ append }) => {
      append({ height: "", point: "" });
    });
  };

  const handleRemoveLastPointFromAll = () => {
    const store = useSportsmenPointsStore.getState().store;

    // Предположим, что у всех одинаковое количество попыток
    // Определим maxIndex
    const one = Object.values(store)[0];
    if (!one) return;

    // Получим индекс последнего поля (например, 2 если три записи)
    const lastIndex = getValues(`points.${Object.keys(store)[0]}`)?.length - 1;

    if (lastIndex >= 0) {
      Object.values(store).forEach(({ remove }) => {
        remove(lastIndex);
      });
    }
  };

  const hasInitialized = useRef(false);

  console.log(isSpecialSportTypeWithPoints, 'isSpecialSportTypeWithPoints');



  useEffect(() => {
    if (isSpecialSportTypeWithPoints && !hasInitialized.current && fields.length === 0) {
      append({ height: "", point: "" });
      hasInitialized.current = true;
    }
    return () => {
      useSportsmenPointsStore.getState().clear();
    };
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
          {isSpecialSportType && attempts.slice(0, 3).map((_, attemptIndex) => (
            <Box key={attemptIndex} sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
              {shouldShowWindField && (
                <Controller
                  name={`wind.${sportsman.id}.${attemptIndex + 1}`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      inputProps={{ style: { height: "7px", width: "70px" } }}
                      placeholder={`Ветер`}
                      disabled={isDisabled}
                      {...field}
                    />
                  )}
                />
              )}
              {<Controller
                name={`attempt.${sportsman.id}.${attemptIndex + 1}`}
                control={control}
                render={({ field }) => (
                  <TextField
                    inputProps={{ style: { height: "7px", width: "70px" } }}
                    placeholder={`Попытка № ${attemptIndex + 1}`}
                    disabled={isDisabled}
                    {...field}
                  />
                )}
              />}
            </Box>
          ))}

          {isSpecialSportType && (
            <Controller
              name={`resultAfterThreeAttempts.${sportsman.id}`}
              control={control}
              render={({ field }) => (
                <TextField
                  inputProps={{ style: { height: "7px", width: "80px" } }}
                  disabled={isDisabled}
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
                      disabled={isDisabled}
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
                      disabled={isDisabled}
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
                      name={`points.${pointIndex}.heights`}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          inputProps={{ style: { height: "7px", width: "120px" } }}
                          disabled={isDisabled}
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
                          disabled={isDisabled}
                          placeholder={``}
                          {...field}
                        />
                      )}
                    />
                  </Box>
                  {index === 0 && <Button
                    className="p-0 min-w-[20px]"
                    color="error"
                    disabled={isDisabled}
                    // onClick={() => remove(pointIndex)}
                    onClick={handleRemoveLastPointFromAll}
                  >
                    <CircleMinus />
                  </Button>}
                </Box>
              ))}
              {index === 0 && <Button
                className="p-0 min-w-[20px]"
                disabled={isDisabled}
                // onClick={() => append({ height: "", point: "" })}
                onClick={handleAddPointToAll}
              >
                <CirclePlus />
              </Button>}
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
                disabled={isDisabled}
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
                disabled={isDisabled}
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

