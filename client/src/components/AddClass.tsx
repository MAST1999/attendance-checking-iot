//patch class
//post class

import ky from "ky";
import { baseURL } from "../utils";
import { useMutation } from "@tanstack/react-query";
import { FormEvent, useRef, useState } from "react";

const addClass = async (classInfo: ClassInfo) => {
  const res = await ky.post(`${baseURL}/auth/new-class`, { json: classInfo });
  return res;
};

type daysOfWeek =
  | "saturday"
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday";

interface ClassInfo {
  class: string;
  courseName: string;
  courseUnit: number;
  firstDay: daysOfWeek;
  secondDay?: daysOfWeek;
  startDate: string[] | string;
  duration: "0:45" | "1:30";
}

const AddClass = () => {
  const [classInfo, setClassInfo] = useState<ClassInfo>({
    class: "",
    courseName: "",
    courseUnit: 1,
    firstDay: "saturday",
    secondDay: undefined,
    startDate: ["", "", ""],
    duration: "1:30",
  });
  const [pageState, setPageState] = useState({
    classNameWarning: false,
    courseNameWarning: false,
    courseUnitWarning: false,
    dateWarning: false,
  });

  const handledate = (e: Event, n: number) => {
    setPageState({ ...pageState, dateWarning: false });
    const newInfo = { ...classInfo };
    newInfo.startDate[n] = e.target.value;
    setClassInfo(newInfo);
  };

  const handleFirstDay = (day: daysOfWeek) => {
    setClassInfo({ ...classInfo, firstDay: day });
  };
  const handleSecondDay = (day: daysOfWeek | undefined) => {
    setClassInfo({ ...classInfo, secondDay: day });
  };

  const addClassMutation = useMutation({
    mutationFn: addClass,
  });

  const modal = useRef(null);

  const handleAddClass = (e: FormEvent) => {
    e.preventDefault();
    if (classInfo.class.length === 0 || classInfo.class.length > 10) {
      setPageState({ ...pageState, classNameWarning: true });
      return;
    }
    if (classInfo.courseUnit <= 0 || classInfo.courseUnit > 4) {
      setPageState({ ...pageState, courseUnitWarning: true });
      return;
    }
    if (classInfo.courseName.length === 0 || classInfo.courseName.length < 3) {
      setPageState({ ...pageState, courseNameWarning: true });
      return;
    }
    if (classInfo.startDate.length === 0) {
      setPageState({ ...pageState, dateWarning: true });
      return;
    }
    addClassMutation.mutate(classInfo);
    console.log(addClassMutation.error);
    if (addClassMutation.isSuccess) {
      modal.current.close();
      return;
    }
  };

  return (
    <>
      {addClassMutation.isSuccess && (
        <p>class successfully added!</p>
      )}
      <button className="btn" onClick={() => modal.current?.showModal()}>
        Add class
      </button>

      <dialog id="my_modal_3" className="modal" ref={modal}>
        <form method="dialog" className="modal-box">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
          <div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Class name:</span>
              </label>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => {
                  setClassInfo({ ...classInfo, class: e.target.value });
                  setPageState({ ...pageState, classNameWarning: false });
                }}
              />
              <div
                className={
                  "alert alert-error p-2 mt-1 " +
                  (pageState.classNameWarning ? "grid" : "hidden")
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
                <span>Enter class name</span>
              </div>
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">course name:</span>
              </label>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full max-w-xs"
                onChange={(e) =>{
                  setClassInfo({ ...classInfo, courseName: e.target.value })
                  setPageState({ ...pageState, courseNameWarning: false });
                }
                }
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
                onChange={(e) =>{
                  setClassInfo({ ...classInfo, courseUnit: e.target.value })
                  setPageState({ ...pageState, courseUnitWarning: false });
                }
                  
                }
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
                <span>course unit should be less than 4</span>
              </div>
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">start date:</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="input w-[25%]"
                  placeholder="year"
                  onChange={(e) => handledate(e, 0)}
                />
                <input
                  type="text"
                  className="input w-[25%]"
                  placeholder="month"
                  onChange={(e) => handledate(e, 1)}
                />
                <input
                  type="text"
                  className="input w-[25%]"
                  placeholder="day"
                  onChange={(e) => handledate(e, 2)}
                />
              </div>
              <div
                className={
                  "alert alert-error p-2 mt-1 " +
                  (pageState.dateWarning ? "grid" : "hidden")
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
                <span>Enter date</span>
              </div>
              <div className="flex justify-around">
                <div className="w-[40%]">
                  <label className="label cursor-pointer">first day:</label>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">saturday</span>
                      <input
                        type="radio"
                        name="radio-1"
                        className="radio checked:bg-blue-500"
                        checked={classInfo.firstDay === "saturday"}
                        onChange={() => handleFirstDay("saturday")}
                      />
                    </label>

                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">sunday</span>
                        <input
                          type="radio"
                          name="radio-1"
                          className="radio checked:bg-red-500"
                          onChange={() => handleFirstDay("sunday")}
                          checked={classInfo.firstDay === "sunday"}
                        />
                      </label>
                    </div>
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">monday</span>
                        <input
                          type="radio"
                          name="radio-1"
                          className="radio checked:bg-blue-500"
                          onChange={() => handleFirstDay("monday")}
                          checked={classInfo.firstDay === "monday"}
                        />
                      </label>
                    </div>
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">tuesday</span>
                        <input
                          type="radio"
                          name="radio-1"
                          className="radio checked:bg-red-500"
                          onChange={() => handleFirstDay("tuesday")}
                          checked={classInfo.firstDay === "tuesday"}
                        />
                      </label>
                    </div>
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">wednesday</span>
                        <input
                          type="radio"
                          name="radio-1"
                          className="radio checked:bg-blue-500"
                          onChange={() => handleFirstDay("wednesday")}
                          checked={classInfo.firstDay === "wednesday"}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="w-[40%]">
                  <label className="label cursor-pointer">second day:</label>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">none</span>
                      <input
                        type="radio"
                        name="radio-2"
                        className="radio checked:bg-blue-500"
                        onChange={() => handleSecondDay(undefined)}
                        checked={classInfo.secondDay === undefined}
                      />
                    </label>
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">saturday</span>
                        <input
                          type="radio"
                          name="radio-2"
                          className="radio checked:bg-red-500"
                          onChange={() => handleSecondDay("saturday")}
                          checked={classInfo.secondDay === "saturday"}
                        />
                      </label>
                    </div>
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">sunday</span>
                        <input
                          type="radio"
                          name="radio-2"
                          className="radio checked:bg-red-500"
                          onChange={() => handleSecondDay("sunday")}
                          checked={classInfo.secondDay === "sunday"}
                        />
                      </label>
                    </div>
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">monday</span>
                        <input
                          type="radio"
                          name="radio-2"
                          className="radio checked:bg-blue-500"
                          onChange={() => handleSecondDay("monday")}
                          checked={classInfo.secondDay === "monday"}
                        />
                      </label>
                    </div>
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">tuesday</span>
                        <input
                          type="radio"
                          name="radio-2"
                          className="radio checked:bg-red-500"
                          onChange={() => handleSecondDay("tuesday")}
                          checked={classInfo.secondDay === "tuesday"}
                        />
                      </label>
                    </div>
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">wednesday</span>
                        <input
                          type="radio"
                          name="radio-2"
                          className="radio checked:bg-blue-500"
                          onChange={() => handleSecondDay("wednesday")}
                          checked={classInfo.secondDay === "wednesday"}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={handleAddClass} className="btn mt-3">
              <span
                className={
                  addClassMutation.isLoading
                    ? "loading loading-spinner loading-md"
                    : ""
                }
              >
                {!addClassMutation.isLoading ? "add class" : ""}
              </span>
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
};

export default AddClass;