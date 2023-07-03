import { useQuery } from "@tanstack/react-query";
import { baseURL } from "../utils";

async function fetchAuth(): Promise<data> {
  const result = await fetch(baseURL + "/sign-in");
}

export const useAuth = () => {
  return useQuery({
    queryKey: ["todos"],
    queryFn: fetchAuth,
  });
};
