import { useEffect, useState } from 'react'

/**
 * VHS 風格時間戳 Hook
 * 格式: DEC 15 1998 - 02:33:15 AM
 */
export function useVHSTimestamp(baseYear = 1998) {
  const [timestamp, setTimestamp] = useState('')

  useEffect(() => {
    const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    
    const update = () => {
      const now = new Date()
      const month = MONTHS[now.getMonth()]
      const day = String(now.getDate()).padStart(2, '0')
      const hours = now.getHours()
      const hrs = String(hours % 12 || 12).padStart(2, '0')
      const mins = String(now.getMinutes()).padStart(2, '0')
      const secs = String(now.getSeconds()).padStart(2, '0')
      const ampm = hours >= 12 ? 'PM' : 'AM'
      
      setTimestamp(`${month} ${day} ${baseYear} - ${hrs}:${mins}:${secs} ${ampm}`)
    }
    
    update()
    const id = window.setInterval(update, 1000)
    return () => window.clearInterval(id)
  }, [baseYear])

  return timestamp
}
