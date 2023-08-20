import { useQuery } from "@tanstack/react-query"
import ky from "ky"
import { baseURL } from "../utils"

type Props = {
    className: string
}
// const signOut = async () => {
    //     return await ky.get(`${baseURL}/auth/sign-out`);
    // }
const SignOut = ({className}: Props) => {
    // const {} = useQuery(["signout"], {
    //     queryFn: signOut,
    //     staleTime: Infinity
    // });

    return(
        <button className={className}>Sign out</button>
    )
}

export default SignOut;