import { cn } from "@/lib/utils";

interface Props {
    amount: number | undefined;
    className?: string;
}

const PriceFormatter = ({ amount, className }: Props) => {
    const formattedPrice = new Number(amount).toLocaleString("fr-CM", {
        currency: "XAF",
        style: "currency",
        minimumFractionDigits: 2,
    });
    return (
        <span className={cn("text-sm font-semibold text-darkColor", className)}>
            {formattedPrice}
        </span>
    )
}

export default PriceFormatter;