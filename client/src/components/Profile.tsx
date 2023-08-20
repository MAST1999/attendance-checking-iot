import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import { useRef } from "react";
import { baseURL } from "../utils";

const Profile = ({className}: {className: string}) => {

    const modal = useRef<HTMLDialogElement>()

    const getProfile = () => {
        const response = ky.get(`${baseURL}/auth/profile`).json();
        return response;
    }

    const {data, isLoading, isError, error} = useQuery(['profile'], {
        queryFn: getProfile,
        staleTime: Infinity
    })

    return(
        <div>
            <button className={className} onClick={()=>modal.current?.showModal()}>Profile</button>

            <dialog id="my_modal_3" className="modal" ref={modal}>
            <form method="dialog" className="modal-box">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                {data && (
                    <div>
                        <p>user role : <span>{data.role}</span></p>
                        <p>first name : <span>{data.userInfo.firstname}</span></p>
                        <p>last name : <span>{data.userInfo.lastname}</span></p>
                        <p>{data.userInfo.isProfessor ? "user is professor" : " user is not professor"}</p>
                    </div>
                )}
                {isLoading && (
                    <div>
                        <p>profile is Loading...</p>
                    </div>
                )}
                {isError && (
                    <div>
                        <p>Error: {error.message}</p>
                    </div>
                )}
            </form>
            </dialog>
        </div>
    )
}

export default Profile;