// src/app/page.tsx
import { trpc } from '@/trpc/server';

export default async function Home() {
  // Call the `hello` procedure on the server
  void trpc.hello.prefetch({ text: 'hllo' });

  return (
    <div>
      <p>Server component says {data.greeting}</p>
    </div>
  );
}