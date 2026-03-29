import { Category } from "@/sanity.types";
import React from "react";
import { Title } from "../text";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

interface Props {
  categories: Category[];
  selectedCategory?: string | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
}

const CategoryList = ({ categories, selectedCategory, setSelectedCategory }: Props) => {
  const filteredCategories = categories?.filter(category => category?.slug?.current);

  return (
    <div className="w-full bg-white p-5">
      <Title className="text-xs md:text-xs lg:text-xl font-black">Product categories</Title>
      <RadioGroup
        aria-labelledby="categories-label"
        value={selectedCategory || ""}
        onValueChange={(value) => setSelectedCategory(value)}
        className="mt-2 space-y-1"
      >
        <span id="categories-label" className="sr-only">Select a product category</span>
        {filteredCategories?.map((category) => (
          <div key={category._id} className="flex items-center space-x-2 hover:cursor-pointer">
            <RadioGroupItem
              id={category?.slug?.current }
              value={category?.slug?.current as string}
              className="rounded-sm"
            />
            <Label
              htmlFor={category?.slug?.current}
              className={selectedCategory === category?.slug?.current ? "font-semibold text-shop_dark_green" : "font-normal"}
            >
              {category.title}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {selectedCategory && (
        <button
          onClick={() => setSelectedCategory(null)}
          className="text-sm font-medium mt-2 underline underline-offset-2"
        >
          Reset selection
        </button>
      )}
    </div>
  );
};

export default CategoryList;
