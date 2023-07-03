import AddStudent from './AddStudents'
import AddTeacher from './AddTeacher'
import ClassList from './ClassList'


export default function MainPage(): JSX.Element{
    return(
        <div className='h-[25%] w-1/2 flex flex-col justify-between items-center min-w-[300px]'>
           <AddStudent />
           <AddTeacher />
           <ClassList />
        </div>
    )
}