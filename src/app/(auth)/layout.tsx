import React from 'react'
interface layoutProps{
    children: React.ReactNode;
}
const layout = ({children}:layoutProps) => {
  return (
    <div className=' flex justify-center items-center min-h-screen '>
        {children}
        </div>
  )
}

export default layout