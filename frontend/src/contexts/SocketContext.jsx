import { createContext , useEffect} from 'react';
import {io} from 'socket.io-client'

const socket=io(`${import.meta.env.VITE_BASE_URL}`);

export const socketContext=createContext();

const SocketContextProvider=({children})=>{
    useEffect(() => {
       socket.on('connect',()=>{
        console.log("Connected to server!");
       })

       socket.on('disconnect',()=>{
        console.log("Disconnected from server!")
       })
    }, [])

    return (
        <socketContext.Provider value={{socket}}>
            {children}
        </socketContext.Provider>
    )
}

export default SocketContextProvider