//BABYLON JS
var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);

var scene = CreateScene();
var camera = CreateCamera();

var faces = [
  new BABYLON.Vector3(0, 0, 10),
  new BABYLON.Vector3(Math.PI/2, 0, 10),
  new BABYLON.Vector3(Math.PI/2, Math.PI/2, 10),
  new BABYLON.Vector3(Math.PI/2, -Math.PI/2, 10),
  new BABYLON.Vector3(Math.PI/2, -Math.PI, 10),
  new BABYLON.Vector3(Math.PI, 0, 10)
];

function CreateScene () {
  var scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    
  //var camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI / 3, 40, BABYLON.Vector3.Zero(), scene);
	//camera.attachControl(canvas, true);
    
  //var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(-1, 0, 0), scene);
	//light1.intensity = 0.6;
  //var light2 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 0, 0), scene);
	//light2.intensity = 0.3;

  var texture = new BABYLON.RawTexture(
    new Uint8Array([
      255, 154, 162,
      255, 183, 178,
      255, 218, 193,
      226, 240, 203,
      181, 234, 215,
      199, 206, 234
    ]),
    6,
    1,
    BABYLON.Engine.TEXTUREFORMAT_RGB,
    this.scene,
    false,
    false,
    BABYLON.Texture.TRILINEAR_SAMPLINGMODE,
  )

  var mat = new BABYLON.StandardMaterial("cubeMat", scene);
  mat.emissiveTexture = texture;

  var faceUVs = new Array(6);
  var rows = 1
  var cols = 6
  for(let i = 0; i < 6; i++) {
    faceUVs[i] = new BABYLON.Vector4(i / cols, 0, (i + 1) / cols, 1 / rows)
  }
  var options = {
    size: 5,
    faceUV: faceUVs,
    wrap: true
  };

  var mainSquare = BABYLON.MeshBuilder.CreateBox("box", options, this.scene);
  mainSquare.position = new BABYLON.Vector3(0, 1, 0);
  mainSquare.material = mat;

  //var ground = BABYLON.MeshBuilder.CreateGround("ground", {size:10}, this.scene);
  
  return scene
}

function CreateCamera() {
  const camera = new BABYLON.ArcRotateCamera("camera", 0, Math.PI/3, 15, this.center, this.scene);
  camera.attachControl();

  camera.inputs.attached.pointers.buttons = [0,1];

  camera.useAutoRotationBehavior = true;
  camera.autoRotationBehavior.idleRotationSpeed = .7;

  camera.upperRadiusLimit = 15;
  camera.lowerRadiusLimit = 15;

  return camera
}

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
  scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
  engine.resize();
});
