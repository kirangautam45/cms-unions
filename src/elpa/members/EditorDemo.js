/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import {useLayoutEffect, useRef, useState} from 'react';

import { Switch } from '@mui/material';


import MDInput from "../../components/MDInput";


/* eslint-disable prettier/prettier */
// function EditorDemo(props){
// const EditorDemo = forwardRef((props, ref)=>{
function EditorDemo(props){

  const refGaga = useRef(null);
  const refInput = useRef(null);

  const {StatusClass} = props;

  const [text, setText] = useState("Start Text");
  const [checked, setChecked] = useState(true);


  const changeCheckedF = () => {
    setChecked(!checked);
  }
  window.changeCheckedF = changeCheckedF;

  console.log("Edito Demo", props);

  useLayoutEffect(()=>{
    console.log("After EditDemo is rendered.");
  }, []);



  return (
    <div className={StatusClass}>
      This is editor demo
      <input ref={refGaga} id="gaga" type="text" onChange={(e)=>{ console.log(e.target.name, e.target.value); setText(e.target.value)}} />
      <MDInput
        ref={refInput}
        fullWidth
        label="First Name"
        defaultValue={`${text} ${Math.random()}`}
        inputProps={{ type: "text", autoComplete: "" }}
      />

      <Switch checked={checked} onChange={() => {setChecked(!checked)}} />

      <button type="button" onClick={()=>{console.log(refGaga, refGaga.current.value);
        console.log("refInput:", refInput.current.querySelector("input[type='text']").value);
        refInput.current.querySelector("input[type='text']").value = Math.random();
      }}>pressssss</button>
    </div>
  );
}

export default EditorDemo;