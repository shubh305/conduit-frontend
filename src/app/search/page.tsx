import { SearchPageContainer } from "@/features/search/components/SearchPage";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Search | Conduit",
};

export default function SearchRoute() {
  return (
    <Suspense>
        <SearchPageContainer />
    </Suspense>
  );
}
