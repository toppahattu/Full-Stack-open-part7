import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector((state) => state.notification)
  return notification ?
    <div className={`error${notification.color}`}>{notification.message}</div>
    : <></>
}

export default Notification
