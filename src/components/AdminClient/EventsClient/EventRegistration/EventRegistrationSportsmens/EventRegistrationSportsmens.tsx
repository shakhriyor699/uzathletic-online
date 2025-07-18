'use client'
import { IEventRegistrationResponse } from '@/types/eventRegistrationTypes'
import { StartListSportsmen } from '@/types/startListType'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { Autocomplete, Box, Button, InputLabel, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Typography } from '@mui/material'
import axios from 'axios'
import { ArrowLeftFromLine, CircleX, Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { FC, useEffect, useMemo, useState } from 'react'
import { Controller, FieldValues, SubmitHandler, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, Table as DocxTable, TableCell as DocxTableCell, TableRow as DocxTableRow, WidthType, TextRun, AlignmentType } from "docx";
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
  const [isDisabled, setIsDisabled] = useState(false);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const { register, handleSubmit, reset, control, resetField, getValues } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues: {
      position: '',
    }
  })
  const [groups, setGroups] = useState<any[]>([]);
  const [groupName, setGroupName] = useState<string>('');
  const router = useRouter()

  const isSpecialSportType = useMemo(() =>
    [51, 52, 54, 55, 56, 57, /* 65, */ 64, 66, 68, 69, 70, 71].includes(eventRegistration.sport_type_id),
    []);

  const shouldShowWindField = useMemo(() =>
    [51, 52, 64, 66].includes(eventRegistration.sport_type_id),
    []);

  const isSpecialSportTypeWithPoints = useMemo(() => [50, 53, /* 64, */ 65, 67].includes(eventRegistration.sport_type_id), [])

  const sortedSportsmen = [...eventSportsmen?.sportsmen].sort((a, b) => {
    const posA = isNaN(Number(a.pivot.position)) ? Infinity : Number(a.pivot.position);
    const posB = isNaN(Number(b.pivot.position)) ? Infinity : Number(b.pivot.position);
    return posA - posB;
  });


  const handleEditClick = (sportsman: any) => {
    setEditingRowId(sportsman.id); // предполагаем, что есть уникальный id
    // setEditedData({
    //   result: sportsman.pivot.result,
    //   position: sportsman.pivot.position,
    //   attempts: sportsman.pivot.attempts?.map((a: any) => a.value?.value || ''), // адаптируй под свою структуру
    // });
  };
  // const sortedSportsmen = [...eventSportsmen?.sportsmen].filter(s => !isNaN(Number(s.pivot?.position)))
  //   .sort((a, b) => Number(a.pivot.position) - Number(b.pivot.position));

  // console.log(sortedSportsmen, 'sorted');




  // const addGroup = () => {
  //   setGroups([...groups, { name: groupName, sportsmen: [] }]);
  //   setGroupName('');
  // };

  useEffect(() => {
    if (value === '3') {
      router.refresh()
    }
  }, [value]);


  useEffect(() => {
    if (eventSportsmen.result) {
      setIsDisabled(true)
    }
  }, [eventSportsmen.result]);


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






  // const downloadDoc = () => {
  //   const tables: any = startList?.map((startListItem: any, index) => {


  //     return Object.keys(startListItem.sportsmen || {}).map((key) => {
  //       const titleParagraph = new Paragraph({
  //         children: [new TextRun({ text: key, bold: true, size: 20 })],
  //         spacing: { after: 200 },
  //       });

  //       const tableRows = startListItem.sportsmen[key]?.map((athlete: any, i: number) => {
  //         if (!athlete.sportsman) return null;

  //         return new DocxTableRow({
  //           children: [
  //             new DocxTableCell({ children: [new Paragraph((i + 1).toString())] }),
  //             new DocxTableCell({ children: [new Paragraph(athlete.sportsman.chest_number)] }),
  //             new DocxTableCell({ children: [new Paragraph(athlete.sportsman.name || "")] }),
  //             new DocxTableCell({ children: [new Paragraph(athlete.sportsman.family_name || "")] }),
  //             new DocxTableCell({ children: [new Paragraph(athlete.sportsman.birth || "")] }),
  //             new DocxTableCell({ children: [new Paragraph(athlete.sportsman.address.split(" - ")[1] || "")] }),
  //             new DocxTableCell({
  //               children: [new Paragraph(
  //                 athlete.sportsman.sportsmen_disciplines?.map((discipline: any) => {
  //                   if (eventRegistration.id === discipline.event_registration_id) {
  //                     return discipline.sb
  //                   }
  //                 }).join(", ") || ""
  //               )]
  //             }),
  //           ],
  //         });
  //       }).filter((row: any) => row !== null);

  //       const table = new DocxTable({
  //         rows: [
  //           new DocxTableRow({
  //             children: [
  //               new DocxTableCell({ children: [new Paragraph("№")] }),
  //               new DocxTableCell({ children: [new Paragraph("BIB")] }),
  //               new DocxTableCell({ children: [new Paragraph("Name")] }),
  //               new DocxTableCell({ children: [new Paragraph("Surname")] }),
  //               new DocxTableCell({ children: [new Paragraph("DOB")] }),
  //               new DocxTableCell({ children: [new Paragraph("Country/Region")] }),
  //               new DocxTableCell({ children: [new Paragraph("Seeding")] }),
  //             ],
  //           }),
  //           ...tableRows,
  //         ],
  //         width: { size: 100, type: WidthType.PERCENTAGE },
  //       });
  //       return [titleParagraph, table];
  //     }).flat();
  //   }).flat();

  //   const dateParagraph = new Paragraph({
  //     children: [new TextRun({ text: "Дата проведения: (число.месяц.год)", size: 14 })],
  //   });

  //   const cityParagraph = new Paragraph({
  //     children: [new TextRun({ text: "Город:", size: 14 })],
  //   });

  //   const doc = new Document({
  //     sections: [
  //       {
  //         properties: {},
  //         children: [dateParagraph, cityParagraph, ...tables],
  //       },
  //     ],
  //   });

  //   Packer.toBlob(doc).then((blob) => {
  //     saveAs(blob, "Athletes.docx");
  //   });
  // };


  const downloadDoc = () => {
    const tables: any = startList?.map((startListItem: any, index) => {
      return Object.keys(startListItem.sportsmen || {}).map((key) => {
        const titleParagraph = new Paragraph({
          children: [new TextRun({ text: key, bold: true, size: 20 })],
          spacing: { after: 200 },
        });

        const tableRows = startListItem.sportsmen[key]?.map((athlete: any, i: number) => {
          if (!athlete.sportsman) return null;

          // Handle different types of sportsmen_disciplines
          let seedingValue = "";
          if (Array.isArray(athlete.sportsman.sportsmen_disciplines)) {
            seedingValue = athlete.sportsman.sportsmen_disciplines
              .map((discipline: any) => {
                if (eventRegistration.id === discipline.event_registration_id) {
                  return discipline.sb;
                }
                return undefined;
              })
              .filter((val: any) => val !== undefined)
              .join(", ");
          } else if (athlete.sportsman.sportsmen_disciplines !== undefined &&
            athlete.sportsman.sportsmen_disciplines !== null) {
            // Handle case where it's a single value (number or string)
            seedingValue = athlete.sportsman.sportsmen_disciplines.toString();
          }

          return new DocxTableRow({
            children: [
              new DocxTableCell({ children: [new Paragraph((i + 1).toString())] }),
              new DocxTableCell({ children: [new Paragraph(athlete.sportsman.chest_number)] }),
              new DocxTableCell({ children: [new Paragraph(athlete.sportsman.name || "")] }),
              new DocxTableCell({ children: [new Paragraph(athlete.sportsman.family_name || "")] }),
              new DocxTableCell({ children: [new Paragraph(athlete.sportsman.birth || "")] }),
              new DocxTableCell({ children: [new Paragraph(athlete.sportsman.address.split(/ *[-–] */).pop()?.trim())] }),
              new DocxTableCell({
                children: [new Paragraph(seedingValue)]
              }),
            ],
          });
        }).filter((row: any) => row !== null);

        const table = new DocxTable({
          rows: [
            new DocxTableRow({
              children: [
                new DocxTableCell({ children: [new Paragraph("№")] }),
                new DocxTableCell({ children: [new Paragraph("BIB")] }),
                new DocxTableCell({ children: [new Paragraph("Name")] }),
                new DocxTableCell({ children: [new Paragraph("Surname")] }),
                new DocxTableCell({ children: [new Paragraph("DOB")] }),
                new DocxTableCell({ children: [new Paragraph("Country/Region")] }),
                new DocxTableCell({ children: [new Paragraph("Seeding")] }),
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
          children: [dateParagraph, cityParagraph, ...tables].filter(Boolean),
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "Athletes.docx");
    });
  };

  sortedSportsmen.map((sportsman: any) => {
    const attemptCells = Array.isArray(eventSportsmen.attempts)
      ? eventSportsmen.attempts.map((attempt: any) => {
        return new DocxTableCell({
          children: [new Paragraph(attempt.value?.value || '-')]
        });
      })
      : [new DocxTableCell({
        children: [new Paragraph("Нет данных")]
      })];

  })


  /* скачать результаты соревнований */
  // const downLoadResultDoc = (sortedSportsmen: any) => {
  //   // Создаем заголовки таблицы
  //   const headerCells = [
  //     new DocxTableCell({ children: [new Paragraph("№")] }),
  //     new DocxTableCell({ children: [new Paragraph("Name Surname")] }),
  //     new DocxTableCell({ children: [new Paragraph("DOB")] }),
  //     new DocxTableCell({ children: [new Paragraph("Country/Region")] }),
  //     new DocxTableCell({ children: [new Paragraph("BIB")] }),
  //   ];

  //   // Добавляем заголовки для попыток в зависимости от типа спорта
  //   if (isSpecialSportType) {
  //     // Для специальных видов спорта (прыжки, метания)
  //     const maxAttempts = Math.max(
  //       ...sortedSportsmen.map((s: any) => s.pivot?.attempts?.length || 0)
  //     ) - 1;

  //     for (let i = 0; i < maxAttempts; i++) {
  //       headerCells.push(
  //         new DocxTableCell({
  //           children: [
  //             new Paragraph({
  //               children: [
  //                 new TextRun({
  //                   text: shouldShowWindField ? "Ветер" : "",
  //                   break: 1
  //                 }),
  //                 new TextRun({ text: `Attempt ${i + 1}` })
  //               ]
  //             })
  //           ]
  //         })
  //       );
  //     }
  //   } else if (isSpecialSportTypeWithPoints) {
  //     // Для видов с высотой и очками (прыжки в высоту/шест)
  //     const maxAttempts = Math.max(
  //       ...sortedSportsmen.map((s: any) => s.pivot?.attempts?.length || 0)
  //     );

  //     for (let i = 0; i < maxAttempts; i++) {
  //       headerCells.push(
  //         new DocxTableCell({
  //           children: [
  //             new Paragraph({
  //               children: [
  //                 new TextRun({ text: "Высота", break: 1 }),
  //                 new TextRun({ text: "Результат" })
  //               ]
  //             })
  //           ]
  //         })
  //       );
  //     }
  //   } else {
  //     // Для обычных видов (беговые)
  //     eventSportsmen?.attempts?.forEach((_: any, index: number) => {
  //       headerCells.push(
  //         new DocxTableCell({ children: [new Paragraph(`Попытка ${index + 1}`)] })
  //       );
  //     });
  //   }

  //   // Добавляем финальные колонки
  //   headerCells.push(
  //     new DocxTableCell({ children: [new Paragraph("Result")] }),
  //     new DocxTableCell({ children: [new Paragraph("Place")] })
  //   );

  //   const headerRow = new DocxTableRow({ children: headerCells });

  //   // Создаем строки с данными
  //   const bodyRows = sortedSportsmen.map((sportsman: any, index: number) => {
  //     const baseCells = [
  //       new DocxTableCell({ children: [new Paragraph((index + 1).toString())] }),
  //       new DocxTableCell({
  //         children: [new Paragraph(`${sportsman.name || ''} ${sportsman.family_name || ''}`)],
  //       }),
  //       new DocxTableCell({ children: [new Paragraph(sportsman.birth || '')] }),
  //       new DocxTableCell({ children: [new Paragraph(sportsman.address.split(/ *[-–] */).pop()?.trim())] }),
  //       new DocxTableCell({ children: [new Paragraph(sportsman.chest_number || '')] }),
  //     ];

  //     let attemptCells: DocxTableCell[] = [];

  //     if (isSpecialSportType) {
  //       // Обработка специальных видов (прыжки/метания)
  //       sportsman.pivot?.attempts?.forEach((attempt: any, attemptIndex: number) => {
  //         if (attempt?.key !== 'resultAfterThreeAttempts') {
  //           attemptCells.push(
  //             new DocxTableCell({
  //               children: [
  //                 new Paragraph({
  //                   children: [
  //                     new TextRun({
  //                       text: shouldShowWindField
  //                         ? `${sportsman.pivot?.condition?.wind?.[attemptIndex + 1]?.value || '-'}`
  //                         : "",
  //                       break: 1
  //                     }),
  //                     new TextRun({
  //                       text: attempt?.value?.value?.toString() || '-'
  //                     })
  //                   ]
  //                 })
  //               ]
  //             })
  //           );
  //         }
  //       });
  //     } else if (isSpecialSportTypeWithPoints) {
  //       // Обработка видов с высотой и очками
  //       sportsman.pivot?.attempts?.forEach((attempt: any) => {
  //         attemptCells.push(
  //           new DocxTableCell({
  //             children: [
  //               new Paragraph({
  //                 children: [
  //                   new TextRun({ text: attempt?.height?.toString() || '-', break: 1 }),
  //                   new TextRun({ text: attempt?.point?.toString() || '-' })
  //                 ]
  //               })
  //             ]
  //           })
  //         );
  //       });
  //     } else {
  //       // Обработка обычных видов
  //       eventSportsmen?.attempts?.forEach((_: any, attemptIndex: number) => {
  //         const attempt = sportsman.pivot?.attempts?.[attemptIndex];
  //         attemptCells.push(
  //           new DocxTableCell({
  //             children: [
  //               new Paragraph(attempt?.value?.value?.toString() || '-')
  //             ]
  //           })
  //         );
  //       });
  //     }

  //     const resultCells = [
  //       new DocxTableCell({
  //         children: [new Paragraph(sportsman.pivot?.result || 'нет результата')],
  //       }),
  //       new DocxTableCell({
  //         children: [new Paragraph(sportsman.pivot?.position || 'нет результата')],
  //       }),
  //     ];

  //     return new DocxTableRow({
  //       children: [...baseCells, ...attemptCells, ...resultCells]
  //     });
  //   });

  //   const table = new DocxTable({
  //     width: { size: 100, type: WidthType.PERCENTAGE },
  //     rows: [headerRow, ...bodyRows],
  //   });

  //   const titleParagraph = new Paragraph({
  //     children: [new TextRun({ text: "Результат соревнований", bold: true, size: 24 })],
  //     spacing: { after: 300 },
  //   });

  //   const dateParagraph = new Paragraph({
  //     children: [new TextRun({ text: `Дата проведения: ${new Date().toLocaleDateString()}`, size: 16 })],
  //   });

  //   let windParagraph = new Paragraph({});



  //   if (!isSpecialSportType &&
  //     !isSpecialSportTypeWithPoints) {
  //     const wind = sortedSportsmen?.[0]?.pivot?.condition?.wind

  //     windParagraph = new Paragraph({
  //       children: [new TextRun({ text: `Ветер: ${wind}`, size: 16 })],
  //     });
  //   }


  //   const cityParagraph = new Paragraph({
  //     children: [new TextRun({ text: "Город:", size: 16 })],
  //   });

  //   const doc = new Document({
  //     sections: [
  //       {
  //         properties: {},
  //         children: [titleParagraph, dateParagraph, windParagraph, cityParagraph, table],
  //       },
  //     ],
  //   });

  //   Packer.toBlob(doc).then((blob) => {
  //     saveAs(blob, "AthletesResults.docx");
  //   });
  // };


  const downLoadResultDoc = (sortedSportsmen: any[]) => {
    const tableHeaderCells: DocxTableCell[] = [
      new DocxTableCell({ children: [new Paragraph("№")] }),
      new DocxTableCell({ children: [new Paragraph("ФИО")] }),
      new DocxTableCell({ children: [new Paragraph("Дата рождения")] }),
      new DocxTableCell({ children: [new Paragraph("Регион")] }),
      new DocxTableCell({ children: [new Paragraph("BIB")] }),
    ];


    // isSpecialSportTypeWithPoints && eventSportsmen.sportsmen.length > 0 && sortedSportsmen[1].pivot.attempts[0].height.map((item: any, index: number) => (
    //                     <TableCell align="center" key={index}>{item.height}</TableCell>
    //                   ))

    // Add attempt columns based on sport type
    if (isSpecialSportTypeWithPoints) {
      // Высота и очки
      const maxAttempts = Math.max(
        ...sortedSportsmen.map(s => s.pivot?.attempts?.length || 0)
      );

      // Предполагаем, что у каждого attempt есть поле height — массив объектов { height: string }
      const heights = sortedSportsmen[1]?.pivot?.attempts[0]?.height || [];

      // Добавляем заголовок "Высота" перед высотами
      // tableHeaderCells.push(
      //   new DocxTableCell({
      //     children: [
      //       new Paragraph({
      //         children: [new TextRun({ text: "Высота", bold: true })],
      //         alignment: AlignmentType.CENTER,
      //       }),
      //     ],
      //   })
      // );

      // Каждую высоту добавляем в отдельную ячейку таблицы
      heights.forEach((item: any) => {
        tableHeaderCells.push(
          new DocxTableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: "Высота", bold: true }),
                  new TextRun({ text: String(item.height), break: 1 }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          })
        );
      });
      // for (let i = 0; i < maxAttempts; i++) {
      //   tableHeaderCells.push(new DocxTableCell({
      //     children: [new Paragraph(`Высота ${i + 1}`)],
      //   }));
      // }
    } else if (isSpecialSportType) {
      const maxAttempts = Math.max(...sortedSportsmen.map(s => s.pivot?.attempts?.length || 0)) - 1;
      for (let i = 0; i < maxAttempts; i++) {
        tableHeaderCells.push(new DocxTableCell({
          children: [new Paragraph({
            children: [
              ...(shouldShowWindField ? [new TextRun({ text: "Ветер", break: 1 })] : []),
              new TextRun({ text: `Попытка ${i + 1}`, break: 1 }),
            ]
          })]
        }));
      }
    } else {
      // Беговые виды
      eventSportsmen?.attempts?.forEach((_: any, index: number) => {
        tableHeaderCells.push(new DocxTableCell({ children: [new Paragraph(`Попытка ${index + 1}`)] }));
      });
    }

    // Add final result & place columns
    tableHeaderCells.push(
      new DocxTableCell({ children: [new Paragraph("Результат")] }),
      new DocxTableCell({ children: [new Paragraph("Место")] }),
    );

    const headerRow = new DocxTableRow({ children: tableHeaderCells });

    const dataRows = sortedSportsmen.map((s: any, index: number) => {
      const baseCells = [
        new DocxTableCell({ children: [new Paragraph((index + 1).toString())] }),
        new DocxTableCell({ children: [new Paragraph(`${s.family_name} ${s.name}`)] }),
        new DocxTableCell({ children: [new Paragraph(s.birth || "")] }),
        new DocxTableCell({ children: [new Paragraph(s.address?.split(/ *[-–] */).pop()?.trim() || "")] }),
        new DocxTableCell({ children: [new Paragraph(s.chest_number || "")] }),
      ];

      let attemptCells: DocxTableCell[] = [];



      if (isSpecialSportTypeWithPoints) {
        const maxAttempts = Math.max(
          ...sortedSportsmen.map(s => s.pivot?.attempts?.length || 0)
        );

        for (let i = 0; i < maxAttempts; i++) {
          const attempt = s.pivot?.attempts?.[i];
          const point = attempt?.point ?? "-";

          attemptCells.push(
            new DocxTableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: point, bold: false }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            })
          );
        }
      }
      else if (isSpecialSportType) {
        s.pivot?.attempts?.forEach((a: any, i: number) => {
          if (a?.key === "resultAfterThreeAttempts") return;
          const wind = shouldShowWindField ? `${s.pivot?.condition?.wind?.[i + 1]?.value || "-"}` : "";
          const value = a?.value?.value?.toString() || "-";
          attemptCells.push(new DocxTableCell({
            children: [new Paragraph(`${wind ? wind + "\n" : ""}${value}`)],
          }));
        });
      } else {
        // Беговые
        eventSportsmen?.attempts?.forEach((_: any, attemptIndex: number) => {
          const value = s.pivot?.attempts?.[attemptIndex]?.value?.value || "-";
          attemptCells.push(new DocxTableCell({ children: [new Paragraph(value)] }));
        });
      }

      const resultCells = [
        new DocxTableCell({ children: [new Paragraph(s.pivot?.result || "-")] }),
        new DocxTableCell({ children: [new Paragraph(s.pivot?.position || "-")] }),
      ];

      return new DocxTableRow({ children: [...baseCells, ...attemptCells, ...resultCells] });
    });

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun({ text: "Результаты соревнования", bold: true, size: 28 })],
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [new TextRun({ text: `Дата проведения: ${new Date().toLocaleDateString()}`, size: 20 })],
            spacing: { after: 100 },
          }),
          !isSpecialSportType && !isSpecialSportTypeWithPoints && sortedSportsmen?.[0]?.pivot?.condition?.wind && (
            new Paragraph({
              children: [new TextRun({ text: `Ветер: ${sortedSportsmen[0].pivot.condition.wind}`, size: 20 })],
              spacing: { after: 100 },
            })
          ),
          new Paragraph({
            children: [new TextRun({ text: "Город:", size: 20 })],
            spacing: { after: 200 },
          }),
          new DocxTable({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [headerRow, ...dataRows],
          }),
        ].filter(Boolean),
      }]
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "AthletesResults.docx");
    });
  };







  const onSubmitSportsmans = async (data: FieldValues, id: number) => {


    const payload = {
      event_registration_id: Number(eventRegistration.id),
      sportsman_id: id,
      attempts: data.attempts ? data.attempts : '',
      result: data.result,
      position: data.position,
      condition: {
        wind: data.condition
      }
    };


    try {
      const res = await axios.post('/api/eventSportsmen', payload);
      // const res = await axios.put(`/api/eventSportsmen/${eventRegistration.id}`, payload);
      if (res.status === 200) {
        toast.success('Сохранено');
        // router.refresh();
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


  const deleteStartListItem = async (id: number) => {
    console.log(id);
    try {
      const res = await axios.delete(`/api/startList/${id}`);
      console.log(res);
      if (res.status === 200) {
        toast.success('Группа стартлиста удалена');
        router.refresh();
      }
    } catch (error) {
      console.error('Error deleting start list item:', error);
      toast.error('Произошла ошибка при удалении группы стартлиста');
    }
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
      const discipline = athlete.sportsmen_disciplines?.find(
        (d: any) => d.event_registration_id === eventRegistration.id
      );
      const sb = discipline?.sb ?? '';
      return `A,${athlete.family_name},${athlete.name},${athlete.gender_id === 1 ? 'M' : 'F'},${athlete.address.split(/ *[-–] */).pop()?.trim()},${eventSportsmen.sport_type.sport_type_number},${sb},M\n`
    })
    const blob = new Blob(rows, { type: "text/plain;charset=utf-8" });
    saveAs(blob, "Athletes.txt");
  };


  // console.log(eventRegistration.id, 'id');

  // const rows: any = eventSportsmen.sportsmen.map((athlete: any) => {
  //   return `A,${athlete.name},${athlete.family_name},${athlete.gender_id === 1 ? 'M' : 'F'},${athlete.address.split(" - ")[1]},${eventSportsmen.sport_type.sport_type_number},${athlete.sportsmen_disciplines?.map((discipline: any) => {
  //     console.log(eventRegistration.id == discipline.event_registration_id);

  //     if (eventRegistration.id == discipline.event_registration_id) return discipline.sb
  //   })},M\n`
  // })

  // console.log(rows);






  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <Button variant="outlined" startIcon={<ArrowLeftFromLine />} onClick={() => router.back()}></Button>
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
                          options={eventRegistration.sportsmen.map((athletes) => ({ id: athletes.id, label: `${athletes.name} ${athletes.family_name}, ${athletes.address}` }))}
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
                      <Box className='flex justify-between items-center'>
                        <Box>
                          <Typography sx={{ mb: 2 }} variant='h4'>{key}</Typography>
                          <Typography variant='subtitle1'>Количество спортсменов: {startList.sportsmen[key].length}</Typography>
                        </Box>
                        {currentUser?.name === 'Admin' &&
                          <Button onClick={() => deleteStartListItem(startList.id)} variant='outlined' color='error'>
                            Удалить группу <Trash2 color='red' className='cursor-pointer ml-3' />
                          </Button>
                        }
                      </Box>
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
                                  {/* {currentUser?.name === 'Admin' && <TableCell>Заявленый результат</TableCell>}  */}
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
                                          {/* <TableCell>
                                            {
                                              sportsmen.sportsman.sportsmen_disciplines.map((discipline: any, index: number) => {
                                                if (eventRegistration.id === discipline.id) {
                                                  return (<Typography key={discipline.id} component={'span'}>
                                                    {discipline.sb}
                                                  </Typography>)
                                                }

                                              }
                                              )
                                            }
                                          </TableCell> */}
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
                                                <Button disabled={isDisabled} onClick={() => handleSubmitWithId(sportsmen.sportsman.id)} variant='contained'>Сохранить</Button>
                                              </TableCell>
                                            </>
                                          }
                                          {/* {currentUser?.name === 'Admin' &&
                                            <TableCell>
                                              <Trash2 color='red' className='cursor-pointer' />
                                            </TableCell>} */}
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
          <Box>
            <Button onClick={() => downLoadResultDoc(sortedSportsmen)} type='button' variant='contained' sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <FaFileWord />
              Скачать результаты</Button>
          </Box>
          <Paper sx={{ width: '100%' }}>
            {!isSpecialSportType &&
              !isSpecialSportTypeWithPoints && sortedSportsmen?.[0]?.pivot?.condition?.wind && (
                <Typography variant="h6" sx={{ mb: 2, ml: 2 }}>
                  Ветер: {sortedSportsmen[0].pivot.condition.wind}
                </Typography>
              )}
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">

                {/* {
                  !isSpecialSportType &&
                  !isSpecialSportTypeWithPoints && startList.map((item: any, index: number) => {
                    console.log(item, sortedSportsmen, 'item');
                    return Object.keys(item.sportsmen).map((key, index) => {
                      return (
                        <>
                        <Typography sx={{ mb: 2 }} variant='h4'>{key}</Typography>
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{sortedSportsmen[index].name}</TableCell>
                            <TableCell>{sortedSportsmen[index].pivot?.result}</TableCell>
                            <TableCell>{sortedSportsmen[index].pivot?.position}</TableCell>
                          </TableRow>
                        </>
                      )
                    })
                  }
                  )
                } */}


                <TableHead>
                  <TableRow>
                    <TableCell>№</TableCell>
                    <TableCell>Спортсмен</TableCell>
                    <TableCell>Дата рождения</TableCell>
                    <TableCell align="center">Регион</TableCell>
                    <TableCell align="center">BIB</TableCell>
                    {/* <TableCell>Вид</TableCell> */}

                    {/* Отображение заголовков для попыток */}
                    {!isSpecialSportType &&
                      !isSpecialSportTypeWithPoints && eventSportsmen?.attempts?.length > 0 &&
                      eventSportsmen.attempts.map((_: any, index: number) => (
                        <TableCell key={`attempt-header-${index}`}>Попытка {index + 1}</TableCell>
                      ))}

                    {isSpecialSportType && eventSportsmen.sportsmen.length > 0 &&
                      Array.from({
                        length: Math.max(
                          ...eventSportsmen.sportsmen.map((s: any) => s.pivot?.attempts?.length || 0)
                        ) - 1
                      }).map((key: any, attemptIndex: number) => {
                        console.log(key, 'attemptIndex');

                        return <TableCell align="center" key={`attempt-header-${attemptIndex}`}>
                          {shouldShowWindField && <p>Ветер</p>}
                          <p>{key?.key ? null : `Попытка ${attemptIndex + 1}`}</p>
                        </TableCell>
                      })
                    }

                    {/* {isSpecialSportTypeWithPoints && Array.from({
                      length: Math.max(
                        ...eventSportsmen.sportsmen.map((s: any) => s.pivot?.attempts?.length || 0)
                      )
                    }).map((_, attemptIndex) => (
                      <TableCell align="center" key={`attempt-header-${attemptIndex}`}>
                        {['height', 'point'].map((key) => (
                          <p key={key}>
                            {key === 'height' ? 'Высота ' : 'Результат '}
                          </p>
                        ))}
                      </TableCell>
                    ))} */}

                    {
                      isSpecialSportTypeWithPoints && eventSportsmen.sportsmen.length > 0 && sortedSportsmen[0].pivot.attempts && sortedSportsmen[0].pivot.attempts[0].height.map((item: any, index: number) => (
                        <TableCell align="center" key={index}>{item.height}</TableCell>
                      ))
                    }

                    <TableCell>Результат</TableCell>
                    <TableCell>Занятое место</TableCell>
                    {currentUser?.name === 'Admin' && <TableCell>Действия</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedSportsmen.map((sportsman: any, index: number) => {


                    // console.log(sportsman.address.split("–").pop().trim(), 'sportsman22222');

                    return (
                      <React.Fragment key={`row-${index}`}>
                        <TableRow>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{`${sportsman.family_name} ${sportsman.name}`}</TableCell>
                          <TableCell>{sportsman.birth}</TableCell>
                          <TableCell align='center'>{sportsman.address.split("–").pop().trim()}</TableCell>
                          <TableCell align="center">{sportsman.chest_number}</TableCell>


                          {isSpecialSportType && eventSportsmen.sportsmen.length > 0 &&
                            sortedSportsmen[index]?.pivot.attempts && sortedSportsmen[index]?.pivot.attempts.map((key: any, attemptIndex: number) => {
                              console.log(key, 'key');
                              // console.log(eventSportsmen.sportsmen[index]?.pivot.condition.wind[attemptIndex]?.value, 'asd');


                              return key?.key !== 'resultAfterThreeAttempts' && <TableCell align="center" key={`attempt-header-${attemptIndex}`}>
                                {shouldShowWindField && <p>{key?.key === 'resultAfterThreeAttempts' ? '' : ''} {sortedSportsmen[index]?.pivot.condition.wind[attemptIndex + 1]?.value}</p>}
                                <p>{key?.key === 'resultAfterThreeAttempts' ? '' : ` `}  {key?.key === 'resultAfterThreeAttempts' ? null : key.value.value}</p>
                              </TableCell>
                            })
                          }



                          {isSpecialSportTypeWithPoints && (() => {

                            const maxAttempts = Math.max(
                              ...sortedSportsmen.map((s: any) => s.pivot?.attempts?.length || 0)
                            );

                            return Array.from({ length: maxAttempts }).map((_, attemptIndex) => (
                              <TableCell align="center" key={`attempt-header-${attemptIndex}`}>
                                {['point'].map((key) => {
                                  const value = sortedSportsmen[index]?.pivot?.attempts?.[attemptIndex]?.[key];

                                  return (
                                    <p key={key}>
                                      {value ?? '-'}
                                    </p>
                                  );
                                })}
                              </TableCell>
                            ));
                          })()}


                          <TableCell>{sportsman.pivot.result ? sportsman.pivot.result : '-'}</TableCell>
                          <TableCell>{sportsman.pivot.position ? sportsman.pivot.position : '-'}</TableCell>

                          {currentUser?.name === 'Admin' && <TableCell>

                            <Button /* onClick={() => handleDelete(row.id)} */>
                              <Trash2 className='cursor-pointer' color='red' />
                            </Button>
                          </TableCell>}
                        </TableRow>

                        {/* {shouldShowWindField && (
                             <TableRow>
                               <TableCell colSpan={5} />
   
                               <TableCell colSpan={2 + (currentUser?.name === 'Admin' ? 1 : 0)} />
                             </TableRow>
                           )} */}
                      </React.Fragment>
                    );
                  })}
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