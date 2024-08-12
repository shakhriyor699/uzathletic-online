'use client'
import React, { FC, useEffect } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IEvent } from '@/types/eventTypes';
import { TablePagination } from '@mui/material';
import { getAllevents } from '@/app/actions/getAllevents';


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

interface EventTableProps {
  data: IEvent[]
}

const EventTable: FC<EventTableProps> = ({ data }) => {
  const [events, setEvents] = React.useState<IEvent[]>(data)
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
    <>
      <Paper sx={{ width: '70%' }}>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {events
                .filter(row => row.status === true)
                .map((row) => {
                  return (
                    row.status === true &&
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      <TableCell align="center">
                        {row.name.ru}
                      </TableCell>
                      <TableCell align="center">
                        {`${row.date_from} - ${row.date_to} ${row.days.length} дней`}
                      </TableCell>
                      <TableCell align="center">
                        {row.country?.name && JSON.parse(row.country?.name).ru}
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
    </>
  )
}

export default EventTable