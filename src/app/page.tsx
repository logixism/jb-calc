"use client";

import { HomeController } from "@/components/home-controller";
import { useJbvItemQuery } from "@/hooks/use-jbv-item-query";

export default function Home() {
  const { isLoading } = useJbvItemQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex">
          <div className="w-8 h-8 bg-primary rounded-md animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-8 h-8 mx-2 bg-primary rounded-md animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-8 h-8 bg-primary rounded-md animate-bounce"></div>
        </div>
      </div>
    );
  }

  return <HomeController />;
}
