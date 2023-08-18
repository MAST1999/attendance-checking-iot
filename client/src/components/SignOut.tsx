import { useQuery } from "@tanstack/react-query"
import ky from "ky"
import { baseURL } from "../utils"

type Props = {
    className: string
}

const SignOut = ({className}: Props) => {
    const signOut = async () => {
        return await ky.get(`${baseURL}/auth/sign-out`);
    }
    const {} = useQuery(["signout"], {
        queryFn: signOut,
        staleTime: Infinity
    });

    return(
        <button className={className}>Sign out</button>
    )
}

export default SignOut;