import Link from 'next/link'
import React from 'react'

export default function Nav() {
  return (
    <div className='bg-blue-200 content-center p-1 sticky mb-3 top-0'>
        <Link className="m-3 underline text-blue-500" href={'/'} >Home</Link>
        <Link className="m-3 underline text-blue-500" href={'/sign-up'} >Signup</Link>
        <Link className="m-3 underline text-blue-500" href={'/documentPage'} >Documents</Link>
    </div>
  )
}
