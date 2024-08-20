import { useState } from "react"
import PlusIcon from "../icons/PlusIcon"
import { Column } from "../Types";

function KanbanBoard() {

  const [columns,setColumns] = useState<Column[]>([]);

  function createColumn(){
    const columnToAdd: Column = {
      id : generateId(),
      title : `Column ${columns.length+1}`
    };
    setColumns([...columns,columnToAdd]);
  }

  function generateId() {
      return Math.floor(Math.random()*1000);
  }


  return (
    <div className="m-auto flex min-h-screen w-full items-center justify-center overflow-x-auto overflow-y-hidden px-[40px]">
        <>
            <button onClick={()=>createColumn} className="h-[60px] w-[350px] min-w-[350px] cursor-pointern rounded-lg bg-mainBackgroundColor border-2 border-coloumnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex gap-2">
                <PlusIcon/>
                Add Column
            </button>
        </>
    </div>

  )
}

export default KanbanBoard