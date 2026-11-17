import { registerSW } from "virtual:pwa-register";
registerSW({ immediate: true });
import "./style.css";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { AppendSceneAsync } from "@babylonjs/core/Loading/sceneLoader";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { enableRaycasting } from "./utils/raycastManager.js";
import { initFocusManager, focusMesh } from "./utils/focusManager.js";

// Side-effect imports: these register plugins and augment prototypes at load time
import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/core/Helpers/sceneHelpers";
import "@babylonjs/core/Materials/standardMaterial";
import "@babylonjs/core/Materials/PBR/pbrMaterial";
import "@babylonjs/core/Materials/Textures/Loaders/envTextureLoader";
import "@babylonjs/loaders/glTF";

const canvas = document.getElementById("renderCanvas");
const engine = new Engine(canvas, true);

    const createScene = async () => {
        const scene = new Scene(engine);

        try {
            // Load a glTF model
            //await AppendSceneAsync("https://assets.babylonjs.com/meshes/boombox.glb", scene);
            await AppendSceneAsync("./officeDRACO.glb", scene);

            // Create a default camera, and event caught by the controls will call preventdefault(),
            // such as wheel event
            scene.createDefaultCamera(true, true, true);
            (scene.activeCamera).alpha += Math.PI;
            (scene.activeCamera).beta = Math.PI / 4;
            (scene.activeCamera).panningSensibility = 30;
        } catch {
            // Fallback: when loading fails
            // Create a default box mesh
            CreateBox("box", {}, scene);

            scene.createDefaultCamera(true, true, true);
            const camera = scene.activeCamera;
            camera.setPosition(new Vector3(3, 3, 3));
            camera.setTarget(new Vector3(0, 0, 0));

            // Create a default light for the scene
            scene.createDefaultLight(true);
        }

        // Create a default environment (skybox + ground + environment lighting)
        scene.createDefaultEnvironment({
        createGround: true,
        createSkybox: true,
        enableGroundMirror: true,
        groundColor: new Color3(42/255, 21/255, 32/255),
        skyboxColor: new Color3(212/255, 118/255, 154/255),
        });

        return scene;
    };

createScene().then((scene) => {

    initFocusManager(scene);

    enableRaycasting(scene, (pickResult) => {
        updateInfoPanel(pickResult);
        focusMesh(scene, pickResult.pickedMesh);
    });

    engine.runRenderLoop(() => {
        scene.render();
    });
});

function updateInfoPanel(pickResult) {
    const mesh = pickResult?.pickedMesh;

    if (!mesh) {
        document.getElementById("room-name").textContent = "Select a room";
        document.getElementById("room-type").textContent = "-";
        return;
    }

    const extras = mesh.metadata?.gltf?.extras ?? {};

    document.getElementById("room-name").textContent =
        extras.roomName || mesh.name;

    document.getElementById("room-type").textContent =
        extras.roomType || "Unknown";
}

window.addEventListener("resize", () => {
    engine.resize();
});
