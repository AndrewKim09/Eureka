import React from 'react'

export const Login = () => {
  return (
    <div class = "w-[100%] h-[100%] bg-blue">

        <form class = "flex flex-col items-center m-auto h-[700px] w-[600px] border border-black my-[50px] shadow-xl rounded-md bg-[#d1fae5]">
            <div>
                <label id = "email">Email</label>
                <input placeholder='Email'></input>
            </div>

            <div>
                <label id = "email">Email</label>
                <input placeholder='confirm Email'></input>
            </div>

        </form>

    </div>
  )
}
