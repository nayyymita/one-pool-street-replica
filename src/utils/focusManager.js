import { HighlightLayer } from "@babylonjs/core/Layers/highlightLayer";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Animation } from "@babylonjs/core/Animations/animation";

let highlightLayer;
let selectedMesh = null;

/**
 * Initialise the highlighting system.
 * Called once when the scene is created.
 */
export function initFocusManager(scene) {
    highlightLayer = new HighlightLayer("highlightLayer", scene);
}

/**
 * Highlight a mesh and smoothly move the camera towards it.
 *
 * @param {Scene} scene
 * @param {AbstractMesh} mesh
 */
export function focusMesh(scene, mesh) {

    // Remove highlight from any previously selected mesh
    if (selectedMesh) {
        highlightLayer.removeMesh(selectedMesh);
        selectedMesh = null;
    }

    if (!mesh) return;
    
    selectedMesh = mesh;

    // Add a blue glow to the newly selected mesh
    highlightLayer.addMesh(mesh, new Color3(1, 0.25, 0.6));

    // Move camera towards the selected object
    zoomToMesh(scene, mesh);
}

/**
 * Animate the camera to focus on a mesh.
 * The camera target and zoom level are animated together
 * to avoid sudden jumps.
 */
function zoomToMesh(scene, mesh) {

    const camera = scene.activeCamera;

    if (!camera) return;

    // Get mesh bounds in world coordinates
    const boundingInfo = mesh.getBoundingInfo();

    // Centre point of the object
    const center = boundingInfo.boundingBox.centerWorld;

    // Approximate size of the object
    const size = boundingInfo.boundingBox.maximumWorld
        .subtract(boundingInfo.boundingBox.minimumWorld)
        .length();

    // Calculate a suitable viewing distance
    const targetRadius = Math.max(size * 2, 3);

    // Smoothly move camera target towards the selected room
    Animation.CreateAndStartAnimation(
        "targetAnim",
        camera,
        "target",
        60,
        45,
        camera.target.clone(),
        center,
        Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    // Smoothly zoom in/out to fit the selected room
    Animation.CreateAndStartAnimation(
        "radiusAnim",
        camera,
        "radius",
        60,
        45,
        camera.radius,
        targetRadius,
        Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    // Keep current horizontal rotation
    Animation.CreateAndStartAnimation(
        "alphaAnim",
        camera,
        "alpha",
        60,
        45,
        camera.alpha,
        camera.alpha,
        Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    // Slightly adjust vertical viewing angle
    // to get a more comfortable perspective
    Animation.CreateAndStartAnimation(
        "betaAnim",
        camera,
        "beta",
        60,
        45,
        camera.beta,
        1.1,
        Animation.ANIMATIONLOOPMODE_CONSTANT
    );
}
