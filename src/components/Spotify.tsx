import React from 'react'
import useSWR from 'swr';

type Props = {}

export default function Spotify({}: Props) {

    const fetcher = (url: any) => fetch(url).then((r) => r.json());
    const { data } = useSWR('/api/spotify', fetcher);

  return (
    <div>
        <section className='bg-gray-600'>
        <main className='flex items-center justify-center'>
          {data}
        </main>
      </section>
    </div>
  )
}