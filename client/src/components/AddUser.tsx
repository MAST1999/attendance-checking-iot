import ky from "ky";
import { useRef, useState } from "react";
import { baseURL } from "../utils";
import { useMutation } from "@tanstack/react-query";
// personnelId, password, isProfessor, firstname, lastname

interface UserInfo {
  firstname: string;
  lastname: string;
  isProfessor: boolean;
}

export default function AddUser() {
  const modal = useRef<HTMLDialogElement>();
  const addUser = async (user: UserInfo) => {
    const json = await ky.put(`${baseURL}/auth/sign-up`, { json: user }).json();
    return json;
  };
  const addUserMutation = useMutation({ mutationFn: addUser });
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstname: "",
    lastname: "",
    isProfessor: false,
  });

  const handleAddUser = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const json = addUserMutation.mutate(userInfo);
    console.log(json);
    if (addUserMutation.isSuccess || addUserMutation.isError) {
      modal.current?.close();
      return;
    }
  };

  return (
    <div>
      {addUserMutation.isSuccess && (
        <p className="text-green-700">new user created!</p>
      )}
      {addUserMutation.isError && (
        <p className="text-red-700">Error:</p>
      )}
      <button className="btn btn-secondary" onClick={() => modal.current?.showModal()}>
        Sign up for new user
      </button>

      {/* modal */}
      <dialog id="my_modal_3" className="modal" ref={modal}>
        <form method="dialog" className="modal-box">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
          <div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">First name:</span>
              </label>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full max-w-xs input-primary"
                onChange={(e) => {
                  setUserInfo({ ...userInfo, firstname: e.target.value });
                }}
              />
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Last name:</span>
              </label>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered input-primary w-full max-w-xs"
                onChange={(e) => {
                  setUserInfo({ ...userInfo, lastname: e.target.value });
                }}
              />
            </div>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">is Teacher:</span>
                <input
                  type="checkbox"
                  checked={userInfo.isProfessor}
                  className="checkbox"
                  onChange={(e) => {
                    setUserInfo({ ...userInfo, isProfessor: e.target.checked });
                  }}
                />
              </label>
            </div>
          </div>
          <button className="btn" onClick={handleAddUser}>
            Add
          </button>
        </form>
      </dialog>
    </div>
  );
}
