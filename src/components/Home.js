import React from 'react'

export const Home = () => {
  return (
    <div class = "absolute top-0 left-0 right-0 h-auto bg-green-100">
      
      <div class = "w-[1000px] h-min-[500px] bg-green-300 mx-auto my-[150px] border-2 border-black shadow-2xl overflow-auto h-auto">
        <h1 class = "text-6xl text-center pt-[100px]">Welcome to Eureka</h1>
        <h2 class = "text-center">a free online classroom</h2>

        <p class = 'text-center pt-[100px] font-bold'>A list of actions you can do</p>

        <div role="clipboard" class=" w-[300px] m-auto">
          <div class=" m-auto bg-gray-500 rounded-[50%] h-[60px] w-[60px] flex justify-center align-middle">
            <div class=" bg-green-300 rounded-[50%] h-[20px] w-[20px] m-auto mt-3"></div>
          </div>
          <div class="absolute bg-gray-500 w-[300px] h-[50px] rounded-tr-3xl rounded-tl-3xl rounded-bl-xl rounded-br-xl mt-[-25px]"></div>
        </div>

        <div class = "p-6 bg-yellow-700 w-[600px] m-auto h-auto mb-10 rounded-lg">

          <div class = "grid w-[100%] h-[700px] grid-rows-7 mx-auto bg-white ">
            <p class = "font-bold text-xl px-2 pt-10">- Create multiple classrooms</p>
            <p class = "font-bold text-xl px-2">- Post announcements, lectures </p>
            <p class = "font-bold text-xl px-2">- create quizzes</p>
            <p class = "font-bold text-xl px-2">- comment on quiz answers and assign grade</p>
            <p class = "font-bold text-xl px-2">- have access to your list of students</p>
            <p class = "font-bold text-xl px-2">- set deadlines for quizzes</p>
            <p class = "font-bold text-xl px-2"></p>
            
            

          </div>
        </div>
        
      </div>

    </div>
  )
}
