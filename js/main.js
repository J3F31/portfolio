function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
function toRadians(deg) {
    return (deg * Math.PI)/180
}

//BABYLON JS
const canvas = document.getElementById("renderCanvas")
const engine = new BABYLON.Engine(canvas, true)

//Stuff to interact with
let SPS1 = null
let SPS2 = null
let mainBody = null

//Variables
//let selectedParticle = 0
let directionQ = []
let speed = 0.01
let inertia = 0
const wireframeColor = new BABYLON.Color3(.5, 0, 0)
const blockColor = new BABYLON.Color3(1, .2, 0)

//Scene
const scene = createScene()

function createScene () {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    
    const camera = new BABYLON.ArcRotateCamera("Camera", toRadians(-90), toRadians(90), 40, BABYLON.Vector3.Zero(), scene);
    //camera.attachControl(canvas, true);
    
    const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
	  light.intensity = 0.4;

    const mat1 = new BABYLON.StandardMaterial("mat1", scene);
	  mat1.emissiveColor = wireframeColor
    mat1.backFaceCulling = false
    mat1.wireframe = true

    const mat2 = new BABYLON.StandardMaterial("mat2", scene);
	  mat2.emissiveColor = blockColor
    mat2.backFaceCulling = false
    mat2.wireframe = false

    SPS1 = new BABYLON.SolidParticleSystem("SPS1", scene);
    SPS2 = new BABYLON.SolidParticleSystem("SPS2", scene);

    const box = BABYLON.MeshBuilder.CreateBox("box", {height:1, width: 1.5, depth: 1});
    const rows = 5
    const cols = 20
    SPS1.addShape(box, rows * cols);
    SPS2.addShape(box, rows * cols);
    box.dispose();

    const mesh1 = SPS1.buildMesh();
    const mesh2 = SPS2.buildMesh();
    
    [SPS1, SPS2].forEach(sps => {
        // initiate particles function
        sps.initParticles = () => {
            let xPos = -20
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const particle = sps.particles[cols * r + c];
                    particle.position.x = xPos
                    particle.position.y = 12 - r * 2
                    particle.position.z = 0
                    xPos = xPos + 2
                }
                xPos = -20
            }
        }

        sps.initParticles();
        sps.setParticles();
    })
    

    

    mesh1.material = mat1
    mesh2.material = mat2
    
    


    var xR = 1; // bevel radius x directionQ
    var yR = 1; // bevel radius y directionQ
    var width = 6;
    var height = 2;
    var depth = 1;

    var w = width / 2;
    var h = height / 2;

    var n = 20; //increments around circle
    var a; //angle
    
    //Array of paths to construct extrusion
	  var mainShape = [ ];

    mainShape.push(new BABYLON.Vector3(w, h - yR, 0));
	
    for (var i = 0; i < n; i++)	{
        a = i * Math.PI / (2 * n);
        mainShape.push(new BABYLON.Vector3(w - xR * (1 - Math.cos(a)), h - yR * (1 - Math.sin(a)), 0 ))
    }

    mainShape.push(new BABYLON.Vector3(w - xR, h, 0));
    mainShape.push(new BABYLON.Vector3(-w + xR, h, 0));
    
    for (var i = 0; i < n; i++)	{
        a = Math.PI / 2 + i * Math.PI / (2 * n);
        mainShape.push(new BABYLON.Vector3(-w + xR * ( 1 + Math.cos(a)), h - yR * (1 - Math.sin(a)), 0 ))
    }

	  mainShape.push(new BABYLON.Vector3(-w, h - yR, 0));
	  mainShape.push(new BABYLON.Vector3(-w, -h + yR, 0));

    for (var i = 0; i < n; i++)	{
        a = Math.PI + i * Math.PI / (2 * n);
        mainShape.push(new BABYLON.Vector3(-w + xR * ( 1 + Math.cos(a)), -h + yR * (1 + Math.sin(a)), 0 ))
    }

	  mainShape.push(new BABYLON.Vector3(-w + xR, -h, 0));
	  mainShape.push(new BABYLON.Vector3(w - xR, -h, 0));

    for (var i = 0; i < n; i++)	{
        a = 3 * Math.PI / 2 + i * Math.PI / (2 * n);
        mainShape.push(new BABYLON.Vector3(w - xR * ( 1 - Math.cos(a)), -h + yR * (1 + Math.sin(a)), 0 ))
    }

	  mainShape.push(new BABYLON.Vector3(w, -h + yR, 0));

	  mainShape.push(mainShape[0]);
	
    var mainPath = [
      new BABYLON.Vector3(0, 0, -depth / 2 + xR),
      new BABYLON.Vector3(0, 0, depth / 2 - xR)
    ];
	
    mainBody = BABYLON.MeshBuilder.ExtrudeShape("extruded1", {shape: mainShape, path: mainPath, sideOrientation: BABYLON.Mesh.DOUBLESIDE, cap: BABYLON.Mesh.CAP_ALL}, scene);
    mainBody.convertToFlatShadedMesh();
    mainBody.position = new BABYLON.Vector3(0, -12, 0)

    const mainMat = new BABYLON.StandardMaterial("mainmat", scene)
    mainMat.emissiveColor = new BABYLON.Color3(0,0,1)

    mainBody.material = mainMat


    //Inputs
    scene.registerBeforeRender(gameLogic)
    scene.onKeyboardObservable.add(keyEvent)

    //Inspector
    debug = (state) => {
        if (state)
            scene.debugLayer.show({ embedMode: true });
        else
            scene.debugLayer.hide();
    }
    window.addEventListener("keydown", (e) => {
        if (e.key == "r")
            debug(!scene.debugLayer.isVisible())
    })
    return scene
}

//SPS2.updateParticles = (up) => {
//    console.log(up)
//    if (up) {
//        SPS2.particles[selectedParticle].color = wireframeColor
//        selectedParticle = selectedParticle == SPS2.particles.length - 1 ? 0 : selectedParticle + 1
//        SPS2.particles[selectedParticle].color = blockColor
//    }
//    else {
//        SPS2.particles[selectedParticle].color = wireframeColor
//        selectedParticle = selectedParticle == 0 ? 19 : selectedParticle - 1
//        SPS2.particles[selectedParticle].color = blockColor
//    }
//    SPS2.setParticles();
//    console.log(selectedParticle)
//}
//window.addEventListener("mousewheel", (e) => {
//    SPS2.updateParticles(e.deltaY > 0 ? false : true)
//})

function keyEvent(e) {
    switch (e.type) {
        case BABYLON.KeyboardEventTypes.KEYDOWN:
            switch (e.event.key) {
                case "ArrowRight": {
                    if (!directionQ.includes("right"))
                        directionQ.push("right")
                } break
                case "ArrowLeft": {
                    if (!directionQ.includes("left"))
                        directionQ.push("left")
                } break
            }
            break
        case BABYLON.KeyboardEventTypes.KEYUP:
            switch (e.event.key) {
                case "ArrowRight": {
                    for (let i = 0; i < 2; i++) {
                        if (directionQ[i] == "right")
                        directionQ.splice(i, 1)
                    }
                } break
                case "ArrowLeft": {
                    for (let i = 0; i < 2; i++) {
                        if (directionQ[i] == "left")
                        directionQ.splice(i, 1)
                    }
                } break
            }
            break
    }
}

function gameLogic() {
    let deltaTime = engine.getDeltaTime()
    let distance = speed * deltaTime

    if (directionQ[0] == "right") {
        inertia += distance * .1
    }
    if (directionQ[0] == "left") {
        inertia -= distance * .1
    }
    mainBody.position.x += inertia;
    inertia *= 0.95;
}

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});


