import {OrbitControls,useGLTF} from '@react-three/drei';
import { Canvas,useFrame} from '@react-three/fiber';
import React, {useRef, useState} from 'react';
import * as THREE from 'three';
import { Object3D } from 'three';

const MyModel = () =>{
   const groupRef = useRef();
   const { nodes, materials } = useGLTF('shelf-lowpoly-draco.glb');
   const meshParent = new Object3D();
   const cloneNo=5;
   const [setColor,updateColor] = useState(false);
   useFrame(({clock})=>{
     if(groupRef){

      const time = clock.getElapsedTime();
      groupRef.current.rotation.x = Math.sin(time / 4);
      groupRef.current.rotation.y = Math.sin(time / 2);
      let i = 0;
      const offset = (cloneNo - 1) / 2;
  
      for (let x = 0; x < cloneNo; x++) {
        for (let y = 0; y < cloneNo; y++) {
          for (let z = 0; z < cloneNo; z++) {
            meshParent.position.set(offset - x, offset - y, offset - z);
            meshParent.rotation.y =
              Math.sin(x / 2 + time) +
              Math.sin(y / 3 + time) +
              Math.sin(z / 4 + time);
            meshParent.rotation.z = meshParent.rotation.y * 2;
            meshParent.scale.set(.001,.001,.001);
            
            meshParent.updateMatrix();
            if(!setColor){
              groupRef.current.setColorAt(i, new THREE.Color(Math.random(),Math.random(),Math.random()));
              updateColor(true);
            }
            groupRef.current.setMatrixAt(i++, meshParent.matrix);
          }
          groupRef.current.instanceColor.needsUpdate = true;
          groupRef.current.instanceMatrix.needsUpdate = true;
        }
      }
     }
    // console.log(nodes.mesh_id4005.geometry);
    // groupRef.current.rotation.y +=.01; 
    // groupRef.current.position = new THREE.Vector3(Math.random()*5,2,Math.random()*5);
   })
   return(
      <instancedMesh ref={groupRef} args={[nodes.mesh_id4005.geometry,materials,cloneNo*cloneNo*cloneNo]}  rotation={[Math.PI,0,0]}
       position={[0,0,0]} 
      >
       <meshStandardMaterial/>
      </instancedMesh>
   )
}



const App = () => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
      }}
    >
      <Canvas camera={ {near:.1,far:1000,zoom:1,position:[0,0,10]}}
          onCreated={({ gl }) => {
            gl.setClearColor("#000000");
          }}
      >
       <OrbitControls/>
       <hemisphereLight intensity={1}>
         <MyModel/>
       </hemisphereLight>
      </Canvas>
    </div>
  );
};

export default App;