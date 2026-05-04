import React, { useState } from 'react'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAYS   = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

const Calendar = () => {
  const today = new Date()
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() })

  const prev = () => setView(v => {
    const m = v.month - 1
    return m < 0 ? { year: v.year - 1, month: 11 } : { ...v, month: m }
  })
  const next = () => setView(v => {
    const m = v.month + 1
    return m > 11 ? { year: v.year + 1, month: 0 } : { ...v, month: m }
  })

  const { year, month } = view
  const firstDay = new Date(year, month, 1).getDay()
  const offset   = firstDay === 0 ? 6 : firstDay - 1
  const total    = new Date(year, month + 1, 0).getDate()
  const prevDays = new Date(year, month, 0).getDate()

  const cells = []
  for (let i = offset - 1; i >= 0; i--)
    cells.push({ day: prevDays - i, other: true })
  for (let d = 1; d <= total; d++)
    cells.push({ day: d, other: false,
      isToday: d === today.getDate() && month === today.getMonth() && year === today.getFullYear() })
  const rem = (7 - (cells.length % 7)) % 7
  for (let d = 1; d <= rem; d++)
    cells.push({ day: d, other: true })

  return (
    <div className="calendar">
      <div className="cal-header">
        <span className="cal-month">{MONTHS[month]} {year}</span>
        <div className="cal-nav">
          <button onClick={prev}>‹</button>
          <button onClick={next}>›</button>
        </div>
      </div>
      <div className="cal-grid">
        {DAYS.map(d => <div key={d} className="cal-day-name">{d}</div>)}
        {cells.map((c, i) => (
          <div key={i} className={`cal-day ${c.other ? 'other-month' : ''} ${c.isToday ? 'today' : ''}`}>
            {c.day}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Calendar