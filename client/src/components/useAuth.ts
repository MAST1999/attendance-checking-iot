import { useMutation, useQueryClient } from "@tanstack/react-query";
import { baseURL } from "../utils";
import ky from "ky";

type LoginInfo = { personnelId: string; password: string };

async function fetchAuth(loginInfo: LoginInfo): Promise<string> {
  return (await ky.post(baseURL + "/auth/sign-in", { json: loginInfo })).json();
}

export const useAuthentication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["user"],
    mutationFn: (loginInfo: LoginInfo) => fetchAuth(loginInfo),
    onSuccess(data) {
      queryClient.setQueryData(["user"], data);
    },
    onError(error) {
      console.error(error);
    },
  });
};
