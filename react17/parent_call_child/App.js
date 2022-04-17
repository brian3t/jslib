import Tabs from "./components/Tabs";
import './App.css';
import Blk from "./components/Blk"
import {useRef} from "react"
import $ from 'jquery'

function App(){
  const child_ref = useRef()
  const reset = function (){
    return false
  }
  const hand_reset_task = function (){
    $('input.task').val('')
  }
  return (
    <div>
      <Tabs>
        <div label="Plans">
          <Blk start="0600" task="Brush teeth"></Blk>
          <Blk start="0630" task="Math"></Blk>
          <Blk start="0700" task="Programming"></Blk>
          <Blk start="0730" task="Study Chemistry"></Blk>
          <Blk start="0800" task="Visit ebay"></Blk>

          <Blk start="0830" task="Call Bank" ref={child_ref}></Blk>
          <Blk start="0900" task="Write code"></Blk>
          <Blk start="0930" task="Brush teeth"></Blk>
          <Blk start="1000" task="Math"></Blk>
          <Blk start="1030" task="Programming"></Blk>
          <button className="btn btn-outline-danger" onClick={hand_reset_task}>Reset</button>
          {/*<button className="btn btn-outline-danger" onClick={() => child_ref.current.alert_child_func()}>Reset</button>*/}
        </div>
        <div label="Projects">
          Projects
        </div>
        <div label="Settings">
          Settings
        </div>
      </Tabs>
    </div>
  );
}

export default App;
