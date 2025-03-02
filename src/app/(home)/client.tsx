'use client';

import { trpc } from '@/trpc/client';
import React from 'react';

const PageClient = () => {
  const [data] = trpc.hello.useSuspenseQuery({
    text: 'Arbin2',
  });

  return (
    <div>PageClient says: {data.greeting}</div>
  );
};

export default PageClient;