import * as React from 'react';
import Link from 'next/link';
import { Button } from '@mui/material';
import EventTable from '@/components/EventTable/EventTable';



export default function Home() {


  return (
    <div className='user relative h-screen flex justify-center items-center'>
      <EventTable />
      <Link className='absolute top-5 right-10' href="/login">
        <Button variant="contained" href="#contained-buttons">
          Войти
        </Button>
      </Link>
    </div>
  );
}