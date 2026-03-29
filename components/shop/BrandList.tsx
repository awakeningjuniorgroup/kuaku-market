import { BRANDS_QUERYResult } from "@/sanity.types";
import React from "react";
import { Title } from "../text";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

interface Props {
  brands: BRANDS_QUERYResult;
  selectedBrand?: string | null;
  setSelectedBrand: React.Dispatch<React.SetStateAction<string | null>>;

}

const BrandList = ({ brands, selectedBrand, setSelectedBrand }: Props) => {
  const filteredBrands = brands?.filter(brand => brand?.slug?.current);

  return (
    <div className="w-full bg-white p-5">
      <Title className="text-xs md:text-xs lg:text-xl font-black">Brands</Title>
      <RadioGroup
        aria-labelledby="brands-label"
        value={selectedBrand || ""}
        onValueChange={(value) => setSelectedBrand(value)}
        className="mt-2 space-y-1"
      >
        <span id="brands-label" className="sr-only">Select a brand</span>
        {filteredBrands?.map((brand) => (
          <div key={brand._id} className="flex items-center space-x-2 hover:cursor-pointer">
            <RadioGroupItem
              id={brand?.slug.current}
              value={brand?.slug.current}
              className="rounded-sm"
            />
            <Label
              htmlFor={brand.slug.current}
              className={selectedBrand === brand.slug.current ? "font-semibold text-shop_dark_green" : "font-normal"}
            >
              {brand.title}
            </Label>
          </div>
        ))}
        {selectedBrand && (
          <button
            onClick={() => setSelectedBrand(null)}
            className="text-sm text-left font-medium mt-2 underline underline-offset-2 decoration-1 hover:text-shop_dark_green hoverEffect"
          >
            Reset selection
          </button>
        )}
      </RadioGroup>
    </div>
  );
};

export default BrandList;
