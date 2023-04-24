import { FormEvent, useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Button, Card } from '@mui/material'
import { getKanban } from 'src/@core/utils/ajax/student/kanban/kanban'

const columns = {
  requested: {
    id: 'requested',
    title: 'Requested',
    tasks: []
  },
  inProgress: {
    id: 'inProgress',
    title: 'In Progress',
    tasks: []
  },
  inReview: {
    id: 'inReview',
    title: 'In Review',
    tasks: []
  },

  completed: {
    id: 'completed',
    title: 'Completed',
    tasks: []
  }
}

const KanbanBoard = () => {
  const [tasks, setTasks] = useState(columns)
  const [boardData, setBoardData] = useState(columns)

  const handleOnDragEnd = result => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    // If the task is dropped in the same location, do nothing
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const sourceColumn = tasks[source.droppableId]
    const destinationColumn = tasks[destination.droppableId]
    const newSourceTasks = Array.from(sourceColumn.tasks)
    const newDestinationTasks = Array.from(destinationColumn.tasks)
    const [draggedTask] = newSourceTasks.splice(source.index, 1)

    // Check if the task already exists in the destination column and insert it in the correct position
    const existingTaskIndex = newDestinationTasks.findIndex(task => task.id === draggedTask.id)
    if (existingTaskIndex > -1) {
      newDestinationTasks.splice(existingTaskIndex, 1)
    }
    newDestinationTasks.splice(destination.index, 0, draggedTask)

    const newTasks = {
      ...tasks,
      [sourceColumn.id]: { ...sourceColumn, tasks: newSourceTasks },
      [destinationColumn.id]: { ...destinationColumn, tasks: newDestinationTasks }
    }

    setTasks(newTasks)
  }

  const handleNewTaskSubmit = (event: FormEvent<HTMLFormElement>, columnId: string) => {
    event.preventDefault()
    const input = event.target.elements.task
    const newTaskContent = input.value.trim()
    if (!newTaskContent) return

    // check if task already exists in any column
    const isDuplicateTask = Object.values(tasks).some(column =>
      column.tasks.some(task => task.content === newTaskContent)
    )
    if (isDuplicateTask) {
      alert('Task already exists in another column')

      return
    }

    // check if task exists in requested, inProgress or done columns
    const isTaskInOtherColumns = ['requested', 'inProgress', 'inReview', 'completed']
      .filter(id => id !== columnId)
      .some(id => {
        const column = tasks[id]

        return column.tasks.some((task: { content: any }) => task.content === newTaskContent)
      })
    if (isTaskInOtherColumns) {
      alert('Task already exists in another column')

      return
    }

    const newTask = { id: `task-${Date.now()}`, content: newTaskContent }
    const column = tasks[columnId]
    const newTasks = { ...tasks, [columnId]: { ...column, tasks: [...column.tasks, newTask] } }
    setTasks(newTasks)
    input.value = ''
  }

  const handleTaskDelete = (taskId: never, columnId: string) => {
    const column = tasks[columnId]
    const filteredTasks = column.tasks.filter((task: { id: any }) => task.id !== taskId)
    const newTasks = { ...tasks, [columnId]: { ...column, tasks: filteredTasks } }
    setTasks(newTasks)
  }
  const fetchKanban = async () => {
    try {
      const data = await getKanban()
      console.log(data)
      setBoardData(prevBoardData => ({
        ...prevBoardData,
        name: data.name,
        description: data.description,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      }))
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchKanban()
  }, [])

  if (!boardData) {
    return <div>Loading...</div>
  }

  return (
    <Card sx={{ padding: 8 }}>
      <Button onClick={fetchKanban}>get List </Button>
      <div>
        <div className='card'>
          <h2>{boardData.name}</h2>
          <p>{boardData.description}</p>
          <p>Created At: {boardData.createdAt}</p>
          <p>Updated At: {boardData.updatedAt}</p>
        </div>
      </div>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className='flex justify-center pt-8'>
          {Object.values(tasks).map(column => (
            <div className='w-72 mr-4' key={column.id}>
              <h2 className='text-lg font-bold mb-4'>{column.title}</h2>
              <Droppable droppableId={column.id}>
                {provided => (
                  <div className='p-2  rounded shadow-lg' {...provided.droppableProps} ref={provided.innerRef}>
                    {column.tasks.map(({ id, content }, index) => (
                      <Draggable key={id} draggableId={id} index={index}>
                        {provided => (
                          <div
                            className='mb-2 p-2 bg-violet-300	 border-gray-300   text-black rounded shadow-sm'
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                          >
                            <div className='text-sm'>{content}</div>
                            <button
                              className='ml-auto text-red-500 hover:text-red-700'
                              onClick={() => handleTaskDelete(id, column.id)}
                            >
                              X
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <form className='mt-4' onSubmit={e => handleNewTaskSubmit(e, column.id)}>
                <input
                  className='w-full p-2 border border-gray-300  rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  type='text'
                  name='task'
                  placeholder='Add a new task...'
                />
                <button
                  className='w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                  type='submit'
                >
                  Add
                </button>
              </form>
            </div>
          ))}
        </div>
      </DragDropContext>
    </Card>
  )
}
export default KanbanBoard
