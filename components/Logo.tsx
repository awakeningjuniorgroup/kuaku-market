import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

const Logo = ({className}: {className?: string, spanDesign?: string}) => {
  return (
    <Link href={"/"} className="inline-block">
        <h2 className={cn
        (" text-2xl black font-black tracking-wider  uppercase hover:shop-light-green hoverEffect group font-sans", className)}
            >Kuaku <span className={cn(
              "text-shop_light_green group-hover:text-shop-dark-green", className )}>
              market</span>
        </h2>
    </Link>
  )
}

export default Logo
