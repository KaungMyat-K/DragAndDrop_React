import { useMemo, useState } from "react"
import PlusIcon from "../icons/PlusIcon"
import { Column, Id, Task } from "../Types";
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";


function KanbanBoard() {

  const [columns,setColumns] = useState<Column[]>([]);
  const columnsId = useMemo(()=> columns.map(col => col.id),[columns]);
  const [activeColumn,setActiveColumn] = useState<Column | null>(null);
  const [tasks,setTasks] = useState<Task[]>([]);
  const sensors = useSensors(
    useSensor(PointerSensor,{
      activationConstraint:{
        distance: 3,
      }
    })
  );

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

  function deleteColumn(id:Id){
    const filteredColumn = columns.filter(col=>col.id != id);
    setColumns(filteredColumn);
  }

  function updateColumn(id:Id,title:string){
    const newColumns = columns.map(col=>{
      if(col.id !== id) return col;
      return {...col,title};
    })
    setColumns(newColumns);
  }

  function creatTask(columnId: Id){
    const newTask : Task = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length}`
    }
    setTasks([...tasks,newTask]);
  }

  function deleteTask(id: Id){
    const newTasks = tasks.filter(task=> task.id !== id);
    setTasks(newTasks);
  }
  
  function onDragStart(event: DragStartEvent){
    if(event.active.data.current?.type === "Column"){
      setActiveColumn(event.active.data.current.column);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent){
    const {active,over} = event;
    if(!over) return;
    const activeColumnId = active.id;
    const overColumnId = over.id;
    if(activeColumnId === overColumnId) return;
    setColumns(columns=>{
      const activeColumnIndex = columns.findIndex(col => col.id === activeColumnId)
      const overColumnIndex = columns.findIndex(col => col.id === overColumnId)
      return arrayMove(columns,activeColumnIndex,overColumnIndex);
    })
  }

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} sensors={sensors}>
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
                {columns.map(column=> 
                  <ColumnContainer key={column.id} column={column} deleteColumn={deleteColumn} updateColumn={updateColumn} createTask={creatTask} tasks={tasks.filter(task=>task.columnId === column.id)} deleteTask={deleteTask}/>
                )}
              </SortableContext>
              </div>
            <button onClick={()=>createColumn()} className="h-[60px] w-[350px] min-w-[350px] cursor-pointern rounded-lg bg-mainBackgroundColor border-2 border-coloumnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex gap-2">
                <PlusIcon/>
                Add Column
            </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && 
            <ColumnContainer column={activeColumn} deleteColumn={deleteColumn} updateColumn={updateColumn} createTask={creatTask} tasks={tasks.filter(task=>task.columnId === activeColumn.id)} deleteTask={deleteTask}/>
            }
          </DragOverlay>
          ,document.body
        )}
      </DndContext>
    </div>

  )
}

export default KanbanBoard