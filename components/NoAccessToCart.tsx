import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import Logo from './Logo'
import { Button } from './ui/button'
import Link from 'next/link'

const NoAccessToCart = ({
    details = "Log in to view your cart items and checkout. don't miss out on your favorite products! "
}:{
    details?:string
}) => {
  return (
    <div className="flex items-center justify-center 
    py-12 md:py-32 bg-gray-100  p-4">
      <Card className="w-full max-w-md p-5">
        <CardHeader className="flex items-center flex-col gap-1">
            <Logo />
            <CardTitle className="text-2xl font-bold text-center">Bon retour!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-center font-semibold text-darkColor/80">{details}</p>
            <Link href="/">
              <Button className="w-full" size="lg">chercher un produit</Button>
            </Link>
        </CardContent>
        <CardFooter className="flex flex-col space-x-2">
            <div className="text-sm text-muted-foreground text-center">
                Continué de fqire des achats pour voir tout nos produits.
            </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default NoAccessToCart
