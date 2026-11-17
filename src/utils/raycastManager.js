import { PointerEventTypes } from "@babylonjs/core";

/** This information is shown on the tooltip
 * Enable click/tap picking on a scene
 * @param {Scene} scene
 * @param {Function} callback Called with picked mesh
 */
export function enableRaycasting(scene, callback = defaultCallback) {
    scene.onPointerObservable.add((pointerInfo) => {
        if (
            pointerInfo.type !== PointerEventTypes.POINTERPICK
        ) {
            return;
        }
        const pickResult = pointerInfo.pickInfo;

        if (!pickResult?.hit || !pickResult.pickedMesh) {
            console.log("Nothing clicked");
            callback(pickResult); // Pass it through anyway, even when nothing was clicked
            return;
        }

        callback(pickResult);
    });
}
//if not defined, this is the default result printed in the browser console
function defaultCallback(pickResult) {
    const mesh = pickResult.pickedMesh;

    console.log("Clicked:", {
        object:mesh,
        name: mesh.name,
        id: mesh.id,
        position: mesh.position,
    });
}