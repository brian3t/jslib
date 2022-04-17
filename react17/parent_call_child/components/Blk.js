import React, {forwardRef, useImperativeHandle, useState} from 'react';
import moment from 'moment'

/**
 * A block. Which is 30 minutes
 */
const Blk = forwardRef(({start, init_task}, ref) => {
  const onClick = () => {
    // const {label, onClick} = this.props;
    // onClick(label);
  }
  /*const {
    props: {
      start,
      label,
    },
  } = this;*/
  const [status, setStatus] = useState([])
  let [task, setTask] = useState(init_task)
  // {start, task, handleReset, child_func}
  useImperativeHandle(ref, () => ({
    alert_child_func(){
      console.info(`child child_func trigger. this: `, this)
      setTask('new task reset')
      window.a = this
    }
  }))
  /*useEffect(
    () => {
      child_func.current = alert_child_func
    }, [alert_child_func, child_func]
  )
*/
  const onChangeStatus = (new_stat) => {
    new_stat = new_stat.nativeEvent.value
    console.info(new_stat)
    setStatus(new_stat)
  }
  const end = moment(start, 'HHmmss').add(30, 'minutes').format('HHmm')

  let className = 'tab-list-item d-flex blk';


  return (
    <div
      className={className}
      onClick={onClick}
    >
      <span>{start} - {end}</span>
      <input type="text" className="status" maxLength="1" onChange={e => setStatus(e.target.value)} value={status} onFocus={e => e.target.select()}></input>
      <input type="text" className="task" placeholder="task" value={task} onChange={e => console.log(e.target.value)} />
      <button className="btn btn-small btn-outline-danger" onClick={() => setTask('reset by btn')}>Reset</button>
    </div>
  )
})

export default Blk;
