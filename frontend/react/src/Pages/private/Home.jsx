import React from 'react'
import Sidebar from '../../composantes/common/Sidebar'
import Dashboard from './Dashboard'
import Header from '../../composantes/common/Header'
import Calendar from './Calendar'
import TodoList from './TodoList'
import '../../assets/styles/main.css'

const Home = () => {
  return (
    
    


        <div className="content-row">
          <div className="left">
            <Dashboard />
          </div>

          <div className="right">
            <Calendar />
            <TodoList />
          </div>
        </div>
   
  )
}

export default Home;