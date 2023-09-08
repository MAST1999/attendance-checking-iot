import { useMutation } from "@tanstack/react-query";
import ky from "ky";
import { FormEvent, LegacyRef, useRef, useState } from "react";
import { baseURL } from "../utils";
type ID = string;

const deleteUser = (id: ID) => {
  const res = ky.delete(`${baseURL}/auth`, { json: id });
  return res;
};

const DeleteUser = () => {
  const modal = useRef<LegacyRef<HTMLDialogElement>>(null);
  const [id, setId] = useState<ID>("");
  const deleteUserMutation = useMutation({ mutationFn: deleteUser });
  const [warning, setWarning] = useState(false);

  const handleDeleteUser = (e: FormEvent) => {
    e.preventDefault();
    if (id.length === 0) {
      setWarning(true);
      return;
    }
    deleteUserMutation.mutate(id);
    if (deleteUserMutation.isSuccess) {
    }
  };

  const handleDeleteID = (e) => {
    setId(e.target.value);
    setWarning(false);
  };

  return (
    <>
      {deleteUserMutation.isSuccess && <p>user deleted succesfully</p>}
      <button
        className="btn btn-secondary"
        onClick={() => {
          modal.current?.showModal();
        }}
      >
        Delete User
      </button>

      <dialog id="my_modal_3" className="modal" ref={modal}>
        <form method="dialog" className="modal-box">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Enter user ID:</span>
            </label>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
              onChange={handleDeleteID}
            />
            <div
              className={
                "alert alert-error p-1 mt-2 " + (warning ? "grid" : "hidden")
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>ID cannot be empty</span>
            </div>
          </div>
          <button className="btn mt-5" onClick={handleDeleteUser}>
            {deleteUserMutation.isLoading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              "delete user"
            )}
          </button>
        </form>
      </dialog>
    </>
  );
};

export default DeleteUser;
