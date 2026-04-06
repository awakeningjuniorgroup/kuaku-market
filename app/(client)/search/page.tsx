import { Suspense } from "react";
import SearchContent from "./SearchContent";
import { Loader2 } from "lucide-react";
import Container from "@/components/Container";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <Container className="py-16">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-gray-500">Loading...</span>
          </div>
        </Container>
      }
    >
      <SearchContent />
    </Suspense>
  );
}