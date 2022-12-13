import * as THREE from 'three';
import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import Camera from './Camera.js';
import Renderer from './Renderer.js';
import World from './World/World.js';
import Resources from './Utils/Resources.js';
import sources from './sources.js'
import Debug from './Utils/Debug.js';
import Stats from 'stats.js';
import { ShadowMapViewer } from 'three/examples/jsm/utils/ShadowMapViewer.js';
import vertexShader from "./assets/shaders/vertex.glsl";
import fragmentShader from "./assets/shaders/fragment.glsl"
import shadowFragmentShader from "./assets/shaders/shadowFrag.glsl";






let instance = null;

export default class Project
{
    constructor(canvas)
    {

        if(instance)
        {
            return instance;
        }

        instance = this;

        window.project = this;
        this.canvas =canvas;
        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.group = new THREE.Group();
        this.scene.add(this.group);
        
        this.meshProps = [];
        this.helpers = [];
        

        this.resources = new Resources(sources);
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.world = new World();
        this.debug = new Debug();
      
     
        

        

        
        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);

        //console.log(circleInstances)

      
       
        this.init();

        
       
        this.sizes.on('resize',()=>
        {
            this.resize();
        })

        this.time.on('tick',()=>
        {
           this.update();
        })
    }

    resize()
    {
        this.camera.resize();
        this.renderer.resize();
        
    }

    update()
    {
        this.stats.begin();
      
       
        this.camera.update();
        this.world.update();
        this.renderer.update(); 
       
        this.stats.end();
        
    }

    init()
    {
        this.createMesh();
    }  

    createGround()
    {
        const geometry = new THREE.BoxGeometry(250,250,250);
        const {material, shadowMaterial} = this.createMaterial(0xE1E5EA, vertexShader, fragmentShader);

        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.y -= 125;
        
        this.meshProps.push({
            mesh: mesh,
            material : material,
            shadowMaterial : shadowMaterial
        });

        this.group.add(mesh);
    }

    createObj(geometry, color){

        const {material, shadowMaterial} = this.createMaterial(color, vertexShader, fragmentShader);


        const mesh = new THREE.Mesh(geometry, material);
        this.group.add(mesh);

        this.meshProps.push({
            mesh,
            material,
            shadowMaterial,
        });

        return mesh;
    }

    createMesh()
    {
        this.createGround();
        const sphere_s = this.createObj(new THREE.SphereGeometry(10, 32, 32), 0xFAF3F3);
        sphere_s.position.set(20, 10, 0);

        const cylinder = this.createObj(new THREE.CylinderGeometry( 10, 10, 40, 32 ), 0xFAF3F3);
        cylinder.position.set(-20, 20, 40);

        const sphere = this.createObj(new THREE.SphereGeometry(24, 32, 32), 0xFAF3F3);
        sphere.position.set(-20, 24, 0);

        const box = this.createObj(new THREE.BoxGeometry(20, 20, 20), 0xFAF3F3);
        box.position.set(40, 10, -30);

        const cone = this.createObj(new THREE.ConeGeometry( 20, 30, 32 ), 0xFAF3F3)
        cone.position.set(37, 15, 25);

    }

    createMaterial(color, vertexShader, fragmentShader)
    {
        const uniforms = {
            uTime: {
                value: 0
            },
            uColor: {
                value: new THREE.Color(color)
            },
            // uLightPos: {
            //     value: this.light.position
            // },
            // uDepthMap: {
            //     value: this.light.shadow.map.texture
            // },
            // uShadowCameraP: {
            //     value: this.shadowCamera.projectionMatrix
            // },
            // uShadowCameraV: {
            //     value: this.shadowCamera.matrixWorldInverse
            // },
            // uIntensity_0: {
            //     value: this.intensity_0
            // },
        }
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms,
        });

        const shadowMaterial = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader: shadowFragmentShader,
            uniforms,
            // side: THREE.BackSide
        });

        return {material, shadowMaterial}
    }
    
   
}