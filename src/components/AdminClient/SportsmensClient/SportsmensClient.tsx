'use client'
import React, { FC, useEffect } from 'react'
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material'
import { Pen, Pencil, Trash2 } from 'lucide-react'
import { ISportsman } from '@/types/sportsmanTypes'
import useSportsmenModal from '@/hooks/useSportsmenModal'
import axios from 'axios'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { getAllSportsmens } from '@/app/actions/getAllSportsmens'

interface SportsmentsClientProps {
  sportsmens: ISportsman[]
}

const SportsmensClient: FC<SportsmentsClientProps> = ({ sportsmens }) => {
  const { handleOpen } = useSportsmenModal()
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const [data, setData] = React.useState<ISportsman[]>(sportsmens)
  const router = useRouter()

  useEffect(() => {
    loadEvents(page + 1)
  }, [page]);


  const loadEvents = async (page: number) => {
    const res = await getAllSportsmens(page)
    setData(res)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  const handleDelete = async (id: number) => {
    const res = await axios.delete(`/api/sportsmens/${id}`)
    if (res.status === 200) {
      toast.success('Спортсмен удален')
      router.refresh()
    } else {
      toast.error('Произошла ошибка при удалении спортсмена')
    }
  }

  const handleEdit = (sportsman: ISportsman) => {
    useSportsmenModal.getState().handleOpen(sportsman);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ height: 400, width: '70%' }}>
        <Typography variant='h4' sx={{ mb: 3 }}>Спортсмены</Typography>
        <Button onClick={handleOpen} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, marginLeft: 'auto' }} variant='contained'>
          <Pen size={15} />
          Создать
        </Button>
        <Paper sx={{ width: '100%' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>Имя</TableCell>
                  <TableCell>Фамилия</TableCell>
                  <TableCell>Дата рождения</TableCell>
                  <TableCell>Номер</TableCell>
                  <TableCell>Тренер</TableCell>
                  <TableCell>Рекорд</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell >{row.family_name}</TableCell>
                    <TableCell>{row.birth}</TableCell>
                    <TableCell>{row.chest_number}</TableCell>
                    <TableCell>
                      {
                        row.coaches.map((coach) => (
                          <Typography component={'p'} key={coach.id}>{coach.name}</Typography>
                        ))
                      }
                    </TableCell>
                    <TableCell >
                      {
                        row.sportsmen_disciplines.map((discipline) => (
                          <Typography key={discipline.name}>SB: {discipline.sb}</Typography>
                        ))
                      }
                    </TableCell>
                    <TableCell sx={{ display: 'flex', gap: 3 }}>
                      <Pencil className='cursor-pointer' color='green' onClick={() => handleEdit(row)} />
                      <Trash2 className='cursor-pointer' color='red' onClick={() => handleDelete(row.id)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[15]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </Box>
  )
}

export default SportsmensClient