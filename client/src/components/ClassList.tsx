import { useQuery } from "@tanstack/react-query"
import ky from "ky"
import { baseURL } from "../utils"

const getClassList = async () => {
    return await ky.get(`${baseURL}/auth/classes`);
}

export default function ClassList() {
    
    const {data, isLoading, isError, error} = useQuery(["class-list"], {queryFn: getClassList})
    return(
        <>
            <button className="btn" onClick={()=>window.my_modal_3.showModal()}>Class List</button>

            <dialog id="my_modal_3" className="modal">
                <form method="dialog" className="modal-box">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    {/* data */}
                </form>
            </dialog>
        </>
    )
}