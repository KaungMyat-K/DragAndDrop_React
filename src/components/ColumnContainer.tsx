import { SortableContext, useSortable } from "@dnd-kit/sortable";
import TrashIcon from "../icons/TrashIcon";
import { Column, Id, Task } from "../Types"
import { CSS } from '@dnd-kit/utilities'
import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";

interface Props{
    column : Column;
    tasks : Task[];
    deleteColumn : (id: Id) => void;
    updateColumn : (id: Id,title: string) => void;
    createTask : (columnId: Id) => void;
    deleteTask : (id:Id)=>void;
    updateTask : (id:Id,content:string) =>void;
}

function ColumnContainer(props : Props) {

    const {column,deleteColumn,updateColumn,createTask,tasks,deleteTask,updateTask} = props;
    const [editMode,setEditMode] = useState(false);
    const tasksId = useMemo(()=>tasks.map(task=>task.id),[tasks]);

    const {setNodeRef,attributes,listeners,transform,transition,isDragging} =  useSortable({
        id : column.id,
        data : {
            type : "Column",
            column
        },
        disabled: editMode
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }



    if(isDragging){
        return (
            <div ref={setNodeRef} style={style} className="bg-coloumnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col opacity-60 border-2 border-rose-500">
            </div>
        );
    }

  return (
    <div ref={setNodeRef} style={style} className="bg-coloumnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col">
        <div onClick={() => setEditMode(true)} {...attributes} {...listeners} className="bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-coloumnBackgroundColor border-4 flex items-center justify-between">
            <div className="flex gap-2">
                <div className="flex justify-center items-center bg-coloumnBackgroundColor px-2 py-1 text-sm rounded-full">
                    0
                </div>
                {!editMode && column.title}
                {editMode && 
                    <input  value={column.title}
                            onChange={e=>updateColumn(column.id,e.target.value)}
                            autoFocus onBlur={()=>setEditMode(false)}
                             onKeyDown={e=> {
                                if(e.key !== "Enter") return;
                                setEditMode(false);
                             }} 
                            className="bg-black focus:border-rose-500 border rounded outline-none px-2"
                    />}
            </div>
            <button onClick={()=>deleteColumn(column.id)}  className="stroke-gray-500 hover:stroke-white hover:bg-coloumnBackgroundColor rounded px-1 py-2">
                <TrashIcon/>
            </button>
        </div>
        <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto ">
            <SortableContext items={tasksId}>
                {tasks.map(task=>(
                    <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask}/>
                ))} 
            </SortableContext>   
        </div>
        <button onClick={()=>createTask(column.id)} className="flex gap-2 items-center border-coloumnBackgroundColor border-2 rounded-md p-4 border-x-coloumnBackgroundColor hover:text-rose-400 active:bg-black"><PlusIcon/> Add Task</button>
    </div>
  )
}

export default ColumnContainer