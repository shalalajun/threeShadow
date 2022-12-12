import * as THREE from 'three';
import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import Camera from './Camera.js';
import Renderer from './Renderer.js';
import World from './World/World.js';
import Resources from './Utils/Resources.js';
import sources from './sources.js'
import GUI from 'lil-gui'; 
import Stats from 'stats.js';




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
        this.resources = new Resources(sources);
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.world = new World();
      
     

        
        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);

        //console.log(circleInstances)

        this.gui = new GUI();
       


        
       
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
        this.renderer.update(); 
       
        this.stats.end();
        
    }
}