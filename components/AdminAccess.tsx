import React from 'react'

const AdminAccess = () => {
  return (
    <div>
      <a 
        href={`${process.env.NEXT_PUBLIC_APP_URL}/studio`} 
        target="_blank" 
        rel="noopener noreferrer"
        className='text-xs underline text-black hover:text-shop_light_green'
      >
        Admin
      </a>
    </div>
  )
}

export default AdminAccess
