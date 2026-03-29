// app/success/page.tsx
import React, { Suspense } from "react";
import ShopContent from "../../components/shop";


export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopContent categories={[]} brands={[]} />
    </Suspense>
  );
}
