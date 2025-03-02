'use client';

import { trpc } from '@/trpc/client';
import React from 'react';

const PageClient = () => {
  const [data] = trpc.categories.getMany.useSuspenseQuery()

  return (
    <div>{
      JSON.stringify(data)
    }</div>
  );
};

export default PageClient;