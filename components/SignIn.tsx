import { UserCircle2Icon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const SignIn = () => {
  return (
    <div>
      <Link 
        href={`${process.env.NEXT_PUBLIC_APP_URL}/studio`} 
        target="_blank" 
        rel="noopener noreferrer"
        className='text-xs underline font-semibold text-black hover:text-shop_light_green'
      >
        <UserCircle2Icon />
      </Link>
    </div>
  )
}

export default SignIn
