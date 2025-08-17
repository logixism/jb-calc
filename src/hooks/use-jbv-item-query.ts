import { mapJbvResponse } from "@/lib/items";
import { useQuery } from "@tanstack/react-query";

export function useJbvItemQuery() {
  return useQuery({
    queryKey: ["items"],
    refetchInterval: 60_000,
    queryFn: () =>
      fetch("https://jbvalues.com/api/items").then((res) =>
        res.json().then(mapJbvResponse),
      ),
  });
}
