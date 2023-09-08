import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import { baseURL } from "../utils";
import { LegacyRef, useRef } from "react";

const getAllUser = async () => {
  return await ky.get(`${baseURL}/auth/all-users`);
};

const AllUsers = () => {
  const modal = useRef<HTMLDialogElement>(null);

  const response = useQuery(["all-users"], {
    queryFn: getAllUser,
    staleTime: Infinity,
  });
  return (
    <>
      <button
        className="btn btn-secondary"
        onClick={() => modal.current?.showModal()}
      >
        get all users
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
                first name: <span>{response.data.firstname}</span>
              </p>
              <p>
                last name: <span>{response.data.lastname}</span>
              </p>
              <p>
                personnelID: <span>{response.data.personnelId}</span>
              </p>
              <p>
                role: <span>{response.data.role}</span>
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
};

export default AllUsers;
