import AddClass from "./AddClass";
import AddCourse from "./AddCourse";
import AddUser from "./AddUser";
import ClassList from "./ClassList";
import CourseList from "./CourseList";
import Profile from "./Profile"
import SignOut from "./SignOut";
import AllUsers from "./AllUsers";

export default function MainPage(): JSX.Element {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="absolute top-5 left-5 flex">
        <AllUsers />
        <AddUser />
      </div>
      <div className="absolute top-5 right-5 flex">
        <Profile className="btn btn-primary" />
        <SignOut className="btn btn-primary ml-1" />
      </div>
      <div className="h-[25%] w-[30%] flex justify-between items-center min-w-[300px] gap-2">
        <div className="flex flex-col gap-1">
          <ClassList />
          <AddClass />
        </div>
        <div className="flex flex-col gap-1">
          <CourseList />
          <AddCourse />
        </div>
      </div>
    </div>
  );
}
