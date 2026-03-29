import React from 'react'
import Container from '@/components/Container';
import HomeBanner from '@/components/HomeBanner';
import ProductGrid from '@/components/ProductGrid';
import HomeCategories from '@/components/HomeCategories';
import { getCategories } from '@/sanity/queries';
import ShopByBrands from '@/components/ShopByBrands';
import LatestBlog from '@/components/LatestBlog';

const home = async () => {
  const categories = await getCategories();

  return (
    <Container className="bg-shop-light-pink">
      <HomeBanner />
      
      <div className="py-10">
          <ProductGrid />
      </div>

      <HomeCategories categories={categories} />
      <ShopByBrands />
      <LatestBlog />
      
    </Container>
  )
}

export default home
