import NoAccessToCart from '@/components/NoAccessToCart';
import WishListProducts from '@/components/WishListProducts';
import { currentUser } from '@clerk/nextjs/server';
import React from 'react'

const WishListPage = async() => {
    const user = await currentUser();
    
  return (
     <>
        {user ? ( 
            <WishListProducts /> 
         ) : ( 
            <NoAccessToCart details="Log in to view your wishlist items. don&apos;t 
            miss out on your cart products to make the payment!" />
        )}
    </>
  )
}

export default WishListPage
