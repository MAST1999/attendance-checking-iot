import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import { baseURL } from "../utils";
import { useRef } from "react";

const getClassList = async () => {
  return await ky.get(`${baseURL}/auth/classes`);
};

export default function ClassList() {
  const response = useQuery(["class-list"], {
    queryFn: getClassList,
  });

  const modal = useRef(null);

  return (
    <>
      <button className="btn" onClick={() => modal.current.showModal()}>
        Class List
      </button>

      <dialog id="my_modal_3" className="modal" ref={modal}>
        <form method="dialog" className="modal-box">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
          {response.isLoading && (
            <div>
              <p>users information loading...</p>
            </div>
          )}
          {response.isSuccess && (
            <div className="border border-green-400 flex flex-col mt-2">
              <p>
                course name: <span>{response.data.courseName}</span>
              </p>
              <p>
                course unit: <span>{response.data.courseUnit}</span>
              </p>
              <p>
                class: <span>{response.data.class}</span>
              </p>
              <p>
                first day: <span>{response.data.firstDay}</span>
              </p>
              <p>
                second day: <span>{response.data.secondDay}</span>
              </p>
              <p>
                start date: <span>{response.data.startDate}</span>
              </p>
              <p>
                duration: <span>{response.data.duration}</span>
              </p>
            </div>
          )}
          {response.isError && (
            <div>
              <p>Error: {response.error.message}</p>
            </div>
          )}
        </form>
      </dialog>
    </>
  );
}
