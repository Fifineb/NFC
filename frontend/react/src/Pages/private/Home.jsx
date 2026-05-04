import React from 'react'
import Sidebar from './Sidebar'
import Dashboard from './Dashboard'
import Header from './Header'
import Calendar from './Calendar'
import TodoList from './TodoList'
import '../styles/global.css'

const Home = () => {
  return (
    <div className="app-wrapper">
      <Sidebar />

      <div className="Home">
        <Header />

        <div className="content-row">
          <div className="left">
            <Dashboard />
          </div>

          <div className="right">
            <Calendar />
            <TodoList />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home