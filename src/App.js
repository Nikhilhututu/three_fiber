import {Instances, OrbitControls,useGLTF,Instance} from '@react-three/drei';
import { Canvas,useFrame} from '@react-three/fiber';
import React, {useRef, useState} from 'react';
import * as THREE from 'three';
import { Object3D} from 'three';

const MyModel = () =>{
   const groupRef = useRef();
   const { nodes, materials } = useGLTF('shelf-lowpoly-draco.glb');
   const meshParent = new Object3D();
   const cloneNo=5;
   const [setColor,updateColor] = useState(false);
   const mat = materials['69.005'];
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
      <instancedMesh ref={groupRef} args={[nodes.mesh_id4005.geometry,mat,cloneNo*cloneNo*cloneNo]}  rotation={[Math.PI,0,0]}
       position={[0,0,0]} 
      >
       {/* <meshStandardMaterial/> */}
      </instancedMesh>
   )
}


// const ThreeInstances = ()=>{
    
//     const { nodes, materials } = useGLTF('shelf-lowpoly-draco.glb');
//     const mesh = nodes['mesh_id4005']['geometry'];
//     const mat = materials['69.005'];
//     const randomVector = (r) => [r / 2 - Math.random() * r, r / 2 - Math.random() * r, r / 2 - Math.random() * r]
//     const randomEuler = () => [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]
//     const data = Array.from({ length: 10000 }, (r = 10000) => ({ random: Math.random(), position: randomVector(r), rotation: randomEuler() }))
   
//     return (
//       <Instances range={10} material={mat} geometry={nodes.mesh_id4005.geometry} scale={.001}>
//         <meshStandardMaterial color={"#ff0000"}/>
//         <group position={[0, 0, 0]}>
//           {
//             data.map((props, i) => (
//               <SingleInstance key={i} {...props}/>
//             ))
//           }
//         </group>
//       </Instances>
//     )

    
// }
// let c=0;
// const SingleInstance = ({random, color=new THREE.Color(), ...props}) => {
//   const groupRef = useRef();
  
//   useFrame(({clock}) => {
//     if(!groupRef)
//        return
//     const t = clock.getElapsedTime()+random*10000; 
//       groupRef.current.rotation.set(Math.cos(t / 4) / 2, Math.sin(t / 4) / 2, Math.cos(t / 1.5) / 2)
//       groupRef.current.position.y = Math.sin(t / 1.5) / 2
//       // groupRef.current.scale.x = groupRef.current.scale.y = groupRef.current.scale.z = THREE.MathUtils.lerp(groupRef.current.scale.z,1,0.1)
//       // groupRef.current.color.lerp(new THREE.Color().set('blue'),0)
//       // groupRef.current.setColor("blue") 
//       // groupRef.current.instance.current.material.color.setHex(0x0000ff);
//     })
//     return(
//         <group {...props}>
//             <Instance ref={groupRef}/>
            
//         </group>
//     )
// }
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
            gl.setClearColor("#ffffff");
          }}
      >
       <OrbitControls/>
       <directionalLight intensity={3} position={[5,10,7.5]}>
       </directionalLight>
       <directionalLight intensity={3} position={[-16,-13,-20]}>
       </directionalLight>

       <MyModel/>
      </Canvas>
    </div>
  );
};

export default App;