import ky from "ky";
import { baseURL } from "../utils";
import { useMutation } from "@tanstack/react-query";
import { FormEvent, useRef, useState } from "react";

interface CourseInfo {
  name: string,
  unit: number,
}

const addCourse = async (courseInfo: CourseInfo) => {
  const res = await ky.post(`${baseURL}/auth/course`, { json: courseInfo });
  return res;
};

const AddCourse = () => {
  const [courseInfo, setCourseInfo] = useState({
    name: "",
    unit: 0,
  });
  const [pageState, setPageState] = useState({
    courseNameWarning: false,
    courseUnitWarning: false,
  });
  const addCourseMutation = useMutation({
    mutationFn: addCourse,
  });
  const modal = useRef(null);

  const handleAddCourse = (e: FormEvent) => {
    e.preventDefault();
    if (courseInfo.name.length === 0) {
      setPageState({ ...pageState, courseNameWarning: true });
      return;
    }
    if (courseInfo.unit <= 0 || courseInfo.unit > 4) {
      setPageState({ ...pageState, courseUnitWarning: true });
      return;
    }
    addCourseMutation.mutate(courseInfo);
    console.log(addCourseMutation.error);
    if (addCourseMutation.isSuccess) {
      modal.current.close();
      return;
    }
  };

  return (
    <>
      {addCourseMutation.isSuccess && <p>class successfully added!</p>}
      <button className="btn" onClick={() => modal.current?.showModal()}>
        Add course
      </button>

      <dialog id="my_modal_3" className="modal" ref={modal}>
        <form method="dialog" className="modal-box">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
          <div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">course name:</span>
              </label>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => {
                  setCourseInfo({ ...courseInfo, name: e.target.value });
                  setPageState({ ...pageState, courseNameWarning: false });
                }}
              />
              <div
                className={
                  "alert alert-error p-2 mt-1 " +
                  (pageState.courseNameWarning ? "grid" : "hidden")
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
                <span>Enter course name</span>
              </div>
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">course unit: </span>
              </label>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => {
                  setCourseInfo({ ...courseInfo, unit: e.target.value });
                  setPageState({ ...pageState, courseUnitWarning: false });
                }}
              />
              <div
                className={
                  "alert alert-error p-2 mt-1 " +
                  (pageState.courseUnitWarning ? "grid" : "hidden")
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
                <span>
                  course unit should be less than 4 and can't be empty
                </span>
              </div>
            </div>

            <button onClick={handleAddCourse} className="btn mt-3">
              <span
                className={
                  addCourseMutation.isLoading
                    ? "loading loading-spinner loading-md"
                    : ""
                }
              >
                {addCourseMutation.isLoading ? "" : "add course"}
              </span>
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
};

export default AddCourse;
