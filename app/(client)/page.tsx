import dynamic from 'next/dynamic';
import Container from '@/components/Container';

const HomeBanner = dynamic(() => import('@/components/HomeBanner'));
const ProductGrid = dynamic(() => import('@/components/ProductGrid'));
import HomeCategories from '@/components/HomeCategories';
import { getCategories } from '@/sanity/queries';
import ShopByBrands from '@/components/ShopByBrands';
import LatestBlog from '@/components/LatestBlog';

const Home = async () => {
  const categories = await getCategories();
 

  return (
    <Container className="bg-shop-light-pink">
      <HomeBanner />
      <HomeCategories categories={categories} />
      <div className="py-10">
        <ProductGrid />
      </div>
      <ShopByBrands />
      <LatestBlog />
    </Container>
  );
};

export default Home;
