import React from 'react'
import Sidebar from '../../composantes/common/Sidebar'
import Header from '../../composantes/common/Header'
import '../../assets/styles/main.css'
import '../../assets/styles/fields.css'


const Message = () => {
  return (
    

          <div className="message-form">
            <form >
              <h1>Send a Message</h1>
              <br />
              <div className="input-box">
                <label htmlFor="topic">Topic:</label>
                <input type="text" id="topic" name="topic" placeholder="Enter topic" required />
            </div>

            <div className="input-box">
              <label htmlFor="email">Email Address:</label>
              <input type="email" id="email" name="email" placeholder="Enter recipient's email" required />
            </div>

            <div className="input-box">
              <label htmlFor="message">Message:</label>
              <textarea id="message" name=" message" placeholder="Enter your message" rows="5" required />
            </div>

            <button type="submit">Send</button>

          </form>
          </div>

     
      
  
  )
}

export default Message