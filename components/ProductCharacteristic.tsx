import { getBrand } from '@/sanity/queries'
import React from 'react'
import { Product } from '@/sanity.types'
import { Accordion, AccordionContent } from './ui/accordion'
import { AccordionItem, AccordionTrigger } from './ui/accordion'

const ProductCharacteristic = async({
    product,
}: {
    product: Product | null | undefined
}) => {
    const brand = await getBrand(product?.slug?.current as string)

  return (
   <Accordion type="single" collapsible className="w-full">
    <AccordionItem value="item-1">
        <AccordionTrigger className="font-semibold">{product?.name}: Characteristics</AccordionTrigger>
        <AccordionContent key={product?._id}>
            <p className="flex items-center justify-between"> 
                Brand:{" "} {brand && <span className="font-semibold tracking-wide">{brand[0]?.brandName}</span>}
            </p>
            <p className="flex items-center justify-between">
                Collection:{" "}
                <span className="font-semibold tracking-wide">2026</span>
            </p>
             <p className="flex items-center justify-between">
                Type:{" "}
                <span className="font-semibold tracking-wide">{product?.type}</span>
            </p>
             <p className="flex items-center justify-between">
                Stock:{" "}
                <span className="font-semibold tracking-wide">
                    {product?.stock ? "Available" : "Out of stock"}
                </span>
            </p>
            

        </AccordionContent>
    </AccordionItem>
   </Accordion>
  )
}

export default ProductCharacteristic
