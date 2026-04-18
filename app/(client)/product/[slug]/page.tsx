import AddToCartButton from '@/components/AddToCartButton';
import Container from '@/components/Container';
import FavouriteButton from '@/components/FavouriteButton';
import ImageView from '@/components/ImageView';
import PriceView from '@/components/PriceView';
import ProductCharacteristic from '@/components/ProductCharacteristic';
import ProductSideMenu from '@/components/ProductSideMenu';
import { getProductBySlug } from '@/sanity/queries';
import { CornerDownLeftIcon, FileQuestionIcon, Share2Icon, SplitIcon, StarIcon, TruckIcon } from 'lucide-react';
import React from 'react'

const SingleProductPage = async({
    params,
}: {
    params: Promise<{ slug: string}>;
}) => {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    const isStock = product?.stock > 0;
  return (
        <Container className="flex flex-col md:flex-row gap-10 py-10">
            {product?.images && 
                <ImageView images={product?.images} isStock={product?.stock} />}
            <div className="w-full md:w-1/2 flex flex-col gap-5">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold">{product?.name}</h2>
                    <p className="text-sm text-gray-600 tracking-wide">
                        {product?.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                        {[...Array(5)].map((_, index) => (
                            <StarIcon
                            key={index}
                            size={12}
                            className="text-shop_light_green" 
                            fill={"#3b9c3c"}/>
                        ))}
                        <p className="font-semibold">({`120`})</p>
                    </div>
                   
                </div>
                <div className="space-y-2 border-t border-b border-gray-200 py-5">
                    <PriceView price={product?.price} discount={product?.discount} className="text-lg font-bold" />
                    <p className={`px-4 py-1.5 inline-block text-center font-semibold rounded-lg ${product?.stock === 0 ?
                        "bg-red-100 text-red-600" : "text-green-600 bg-green-100"
                        }`}>{(product?.stock as number) > 0 ? "In Stock" : "out of stock"}
                    </p>
                </div>
                <div className="flex items-center gap-2.5 lg:gap-5">
                    <AddToCartButton product={product} />
                    <FavouriteButton showProduct={true} product={product} />
                </div>
                <ProductCharacteristic product={product} />
                <div className="flex flex-wrap items-center justify-center gap-2.5 border-b border-b-gray-200py-5 -mt-2">
                    <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
                        <SplitIcon className="text-lg" />
                        <p>Compare color</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
                        <FileQuestionIcon className="text-lg" />
                        <p>Ask a question</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
                        <TruckIcon className="text-lg" />
                        <p>Delivery & Return</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
                        <Share2Icon className="text-lg" />
                        <p>Share</p>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="border border-lightColor/25 border-b-0 p-3 flex items-center gap-2.5">
                        <TruckIcon size={30} className="text-shop_light_green" />
                        <div className="">
                            <p className="text-base font-semibold text-black">
                                 Livraison
                            </p>
                            <p className="text-sm text-gray-500 underline underline-offset-2">
                                Livraison dans plusieurs villes
                            </p>
                        </div>
                    </div>
                    <div className="border border-lightColor/25 border-b p-3 flex items-center gap-2.5">
                        <CornerDownLeftIcon size={30} className="text-shop_light_green" />
                        <div className="">
                            <p className="text-base font-semibold text-black">
                                Retour de livraison
                            </p>
                            <p className="text-sm text-gray-500 underline underline-offset-2">
                                Retour de livraison en cas d'erreur de commande.{" "}
                                
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </Container>
  )
}

export default SingleProductPage
