'use client'
import { getAllevents } from '@/app/actions/getAllevents';
import { IUserData } from '@/types/authTypes';
import { IEvent } from '@/types/eventTypes';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import React, { FC, useEffect } from 'react'


interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'center';
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'name', label: 'Название', minWidth: 170, align: 'center' },
  { id: 'date_of_event', label: 'Дата проведения', minWidth: 170, align: 'center' },
  {
    id: 'Country',
    label: 'Страна',
    minWidth: 170,
    align: 'center',
  },
];

interface EventsClientProps {
  data: IEvent[]
  currentUser?: IUserData | undefined
}

const ArchiveClient: FC<EventsClientProps> = ({ data, currentUser }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [events, setEvents] = React.useState<IEvent[]>(data)

  useEffect(() => {
    loadEvents(page + 1)
  }, [page]);


  const loadEvents = async (page: number) => {
    const res = await getAllevents(page)
    setEvents(res.data)
  }


  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  return (
    <div className='flex flex-col items-center'>
      <div style={{ height: 400, width: '70%' }}>
        <Typography variant='h4' sx={{ mb: 3 }}>Архив соревнований</Typography>
        <Paper sx={{ width: '100%' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ top: 0, minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events
                  .filter(row => row.status === false)
                  .map((row) => {
                    return (
                      row.status === false &&
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                        <TableCell align="center">
                          {row.name.ru}
                        </TableCell>
                        <TableCell align="center">
                          {`${row.date_from} - ${row.date_to} ${row.days.length} дней`}
                        </TableCell>
                        <TableCell align="center">
                          {row.country?.name.ru}
                        </TableCell>
                        <TableCell sx={{ display: 'flex', justifyContent: 'center', gap: 2 }} align="center">
                          <Link href={currentUser?.role.name === 'admin' ? `/admin/events/${row.id}` : `/user/events/${row.id}`}><Eye color='gray' /></Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[15]}
            component="div"
            count={events.filter(row => row.status === true).length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </div >
  )
}

export default ArchiveClient