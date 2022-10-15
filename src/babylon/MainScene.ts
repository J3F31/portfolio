import { ArcRotateCamera, Color4, Engine, HemisphericLight, KeyboardEventTypes, MeshBuilder, RawTexture, Scene, StandardMaterial, Texture, Vector3, Vector4 } from "@babylonjs/core";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";

export class MainScene {

  camera: ArcRotateCamera;
  scene: Scene;
  engine: Engine;

  center: Vector3 = new Vector3(0, 1, 0);
  faces: Array<Vector3> = [
    new Vector3(0, 0, 10),
    new Vector3(Math.PI/2, 0, 10),
    new Vector3(Math.PI/2, Math.PI/2, 10),
    new Vector3(Math.PI/2, -Math.PI/2, 10),
    new Vector3(Math.PI/2, -Math.PI, 10),
    new Vector3(Math.PI, 0, 10)
  ];

  constructor(private canvas: HTMLCanvasElement){
    this.engine = new Engine(this.canvas, true);
    this.scene = this.CreateScene();
    this.camera = this.CreateCamera();
    

    this.engine.runRenderLoop(() => {
      this.scene.render();
      console.log(
        "beta", this.camera.beta,
        "alpha", this.camera.alpha,
        "radius", this.camera.radius
      )
    });

  }

  CreateScene(): Scene {
    const scene = new Scene(this.engine);
    scene.clearColor = new Color4(0, 0, 0, 0);
    scene.debugLayer.show({
      embedMode: true,
    });

    const texture = new RawTexture(
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
      Engine.TEXTUREFORMAT_RGB,
      this.scene,
      false,
      false,
      Texture.TRILINEAR_SAMPLINGMODE,
    )

    const mat = new StandardMaterial("cubeMat", scene);
    mat.diffuseTexture = texture;

    const faceUVs = new Array(6);
    const rows = 1
    const cols = 6
    for(let i = 0; i < 6; i++) {
      faceUVs[i] = new Vector4(i / cols, 0, (i + 1) / cols, 1 / rows)
    }
    const options = {
      size: 5,
      faceUV: faceUVs,
      wrap: true
    };

    const mainSquare = MeshBuilder.CreateBox("box", options, this.scene);
    mainSquare.position = this.center;
    mainSquare.material = mat;

    const light = new HemisphericLight("hemiLight", new Vector3(0, 10, 0), scene);
    light.intensity = .5;

    //Temp
    scene.onKeyboardObservable.add((kbInfo) => {
      switch (kbInfo.type) {
        case KeyboardEventTypes.KEYDOWN:
          console.log("KEY DOWN: ", kbInfo.event.key);
          if (kbInfo.event.key === "k") {
            console.log("rotate")
            this.ChangeView(0, 1);
          }
          break;
        case KeyboardEventTypes.KEYUP:
          console.log("KEY UP: ", kbInfo.event.code);
          break;
      }
    });

    return scene;
  }
  
  CreateCamera(): ArcRotateCamera {
    const camera = new ArcRotateCamera("camera", 0, 0, 10, this.center, this.scene);
    camera.attachControl();

    return camera
  }

  ChangeView(from: number, to: number): void {
    if (this.camera.beta != this.faces[to].x && this.camera.alpha != this.faces[to].y) {
      const lerpTime = 3;
      let elapsedTime = 0;
      const timer = setInterval(() => {
        this.camera.beta = this.Lerp(this.faces[from].x, this.faces[to].x, elapsedTime/lerpTime)
        this.camera.alpha = this.Lerp(this.faces[from].y, this.faces[to].x, elapsedTime/lerpTime)
        elapsedTime += 0.01
        if (elapsedTime > lerpTime) {
          //this.camera.beta = this.faces[to].x;
          //this.camera.alpha = this.faces[to].y;
          clearInterval(timer);
        }
      });
    }
  }

  Lerp(x: number, y: number, a: number): number {
    const lerp = x * (1 - a) + y * a;
    return lerp;
  }
}