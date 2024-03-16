import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

import { TaskTable } from "../components";
import { Task } from "../types/task";

import style from "./task.module.scss";

const TaskPage = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [socket, setSocket] = useState<Socket>({} as Socket);

    useEffect(() => {
        const server = "http://localhost:4001";
        const connectionOptions = {
            forceNew: true,
            timeout: 10000,
            transports: ["websocket"],
        };
    
        const newSocket = io(server, connectionOptions);
        setSocket(newSocket)
    
    
        newSocket.on('connect', () => {
          console.log('Connected to newSocket.io server!');
        });
    
        newSocket.on('newTasks', (tasks: Task[]) => {
            setTasks(tasks);
        })
    
        // Clean up the socket connection when the component is unmounted
        return () => {
            newSocket.disconnect();
        };
      
    },[]);


    const addTask = (task: Task) => {
        const updatedTasks = tasks.concat([task]);
        setTasks(updatedTasks);
        socket.emit('tasks', updatedTasks);
    }

    const removeTask = (id: string) => {
        const taskIndex = tasks.findIndex((task) => task.id === id);
        if (taskIndex !== -1) {
            const updatedTasks = [...tasks.slice(0, taskIndex), ...tasks.slice(taskIndex + 1)];
            setTasks(updatedTasks);
            socket.emit('tasks', updatedTasks);
        }
    }

    const markTaskAsCompleted = (id: string) => {
        const taskIndex = tasks.findIndex((task) => task.id === id);
        if (taskIndex !== -1) {
            const updatedTasks = [...tasks.slice(0, taskIndex), { ...tasks[taskIndex], completed: !tasks[taskIndex].completed }, ...tasks.slice(taskIndex + 1)];
            setTasks(updatedTasks);
            socket.emit('tasks', updatedTasks);
        }
    }


    return (
        <main className={style.taskContainer}>
            <div className={style.taskTitleContainer}>
                <h2>Task Tracker</h2>
            </div>
            <section className={style.taskSection}>
                <TaskTable 
                    tasks={tasks}
                    addItem={addTask}
                    removeItem={removeTask}
                    checkboxAction={markTaskAsCompleted}
                />
            </section>
        </main>
    )
};

export default TaskPage;
