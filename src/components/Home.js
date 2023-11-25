import React from 'react'

export const Home = () => {
  return (
    <div class = "fixed left-0 right-0 h-[1000px] bg-green-100">
      
      <div class = "w-[1000px] h-[500px] bg-green-300 mx-auto my-[150px] border-2 border-black shadow-2xl">
        <h1 class = "text-6xl text-center pt-[100px]">Welcome to Eureka</h1>
        <h2 class = "text-center">a free online classroom</h2>

        <p class = 'text-center pt-[100px] font-bold'>A list of actions you can do</p>
        <div class = "grid justify-center w-[80%] h-[190px] grid-cols-5 grid-rows-3 mx-auto">
          <p class = "text-sm px-2">Create multiple classrooms</p>
          <p class = "text-sm px-2">post announcements, lectures </p>
          <p class = "text-sm px-2">create quizzes</p>
          <p class = "text-sm px-2">comment on quiz answers and assign grade</p>
          <p class = "text-sm px-2">have access to your list of students</p>
          <p class = "text-sm px-2">set deadlines for quizzes</p>
          <p class = "text-sm px-2"></p>
          

        </div>
        
      </div>

    </div>
  )
}
