import React from 'react'
import {Link} from 'react-router-dom'

const Start = () => {
  return (
    <div className='flex pt-8 flex-col justify-between h-screen w-full bg-red-400 bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1572239780645-203c467a49b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYWZmaWMlMjBsaWdodHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80)]'>
        <img className='w-16 ml-8' src="https://th.bing.com/th/id/OIP.nm1FItlXC1Gk_ed4g2EINAHaCm?cb=iwp2&rs=1&pid=ImgDetMain"/>
        <div className='bg-white pb-7 py-4 px-4'>
            <h2 className='text-3xl font-bold'>Get Started</h2>
             <Link to='/login' className=' flex items-center justify-center w-full bg-black text-white py-3 rounded mt-5 '>Continue</Link>
        </div>
    </div>
  )
}

export default Start