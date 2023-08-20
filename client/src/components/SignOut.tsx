import { useMutation, useQuery } from "@tanstack/react-query";
import ky from "ky";
import { baseURL } from "../utils";

interface Props {
  className: string;
}

const signOut = async () => {
  return await ky.get(`${baseURL}/auth/sign-out`);
};

const SignOut = ({ className }: Props) => {
  const signOutMutation = useMutation({
    mutationFn: signOut,
  });

  return <button className={className} onClick={() => signOutMutation.mutate}>Sign out</button>;
};

export default SignOut;
