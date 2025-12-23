"use client";

import WishlistItemCard from "@/components/user/WishlistItemCard";
import { useInfiniteWishlist } from "@/hooks/fetching/wishlist/useInfiniteWishlist";
import { WishlistItem } from "@/types/wishlistType";
import { Spinner } from "@heroui/react";
import { use, useRef } from "react";

interface WishlistPageProps {
  params: Promise<{
    username: string;
  }>;
}

export default function WishlistPage({ params }: WishlistPageProps) {
  const { username } = use(params);
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteWishlist(username);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = (node: HTMLDivElement | null) => {
    if (isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    if (node) observer.current.observe(node);
  };

  if (status === "error") {
    return <span>Error: {(error as any).message}</span>;
  }

  return (
    <div className="w- full max-w-3/4 mx-auto flex flex-col gap-2">
      {data?.pages.map((page, i) => (
        <div key={i} className="flex flex-col gap-4">
          {page.data.results.map((wishlistItem: WishlistItem) => (
            <WishlistItemCard
              username={username}
              wishlistItem={wishlistItem}
              key={wishlistItem.wishlistItemID}
            />
          ))}
        </div>
      ))}

      <div
        ref={lastElementRef}
        className="h-10 w-full flex justify-center items-center"
      >
        {isFetchingNextPage && <Spinner />}
        {!hasNextPage && data && (
          <span className="text-gray-500 text-sm mt-4">
            No more wishlist's items to load
          </span>
        )}
      </div>
    </div>
  );
}
