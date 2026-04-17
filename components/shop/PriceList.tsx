import React from "react";
import { Title } from "../text";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

const priceArray = [
  { title: "moins de 5000 FCFA", value: "0-5000" },
  { title: "5000 FCFA jusqu'à 10000 FCFA", value: "5000-10000" },
  { title: "10000 FCFA jusqu'à20000 FCFA", value: "10000-20000" },
  { title: "20000 jusqu'à 50000", value: "20000-50000" },
  { title: "Plus de 50000 FCFA", value: "50000-100000" },
];

interface Props {
  selectedPrice?: string | null;
  setSelectedPrice: React.Dispatch<React.SetStateAction<string | null>>;
}

const PriceList = ({ selectedPrice, setSelectedPrice }: Props) => {
  return (
    <div className="w-full bg-white p-5">
      <Title className="text-xs md:text-xs font-black">Prix</Title>
      <RadioGroup
        value={selectedPrice || ""}
        onValueChange={(value) => setSelectedPrice(value)}
        className="mt-2 space-y-1"
        aria-label="Select price range"
      >
        {priceArray.map((price) => (
          <div key={price.value} className="flex items-center space-x-2 hover:cursor-pointer">
            <RadioGroupItem
              id={price.value}
              value={price.value}
              className="rounded-sm"
            />
            <Label htmlFor={price.value}>{price.title}</Label>
          </div>
        ))}
      </RadioGroup>
      {selectedPrice && (
        <button
          onClick={() => setSelectedPrice(null)}
          className="text-sm font-medium mt-2 underline underline-offset-2 decoration-1"
        >
          Formater la selection
        </button>
      )}
    </div>
  );
};

export default PriceList;
