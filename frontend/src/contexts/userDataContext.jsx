import React, { createContext, useState } from 'react'


export const userDataContext=createContext();

const userDataContext = () => {

    const [user,setUser]=useState({
        email:'',
        name:{
            firstame:'',
            lastname:''
        }
    })
  return (
    <div>
        <userDataContext.Provider value={[user,setUser]}>

        </userDataContext.Provider>
    </div>
  )
}

export default userDataContext