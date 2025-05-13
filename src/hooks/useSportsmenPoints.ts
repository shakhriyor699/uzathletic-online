import { Control, FieldValues, useFieldArray } from "react-hook-form";

export const useSportsmanPoints = (control: Control<FieldValues>, sportsmanId: number) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `points.${sportsmanId}`, // Уникальный путь для каждого спортсмена
  });

  return { fields, append, remove };
};