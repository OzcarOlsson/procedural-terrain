precision mediump float;
precision mediump int;

varying vec3 vPos;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPos;
varying vec3 vSurface;
varying vec3 cameraPos;
// modelViewMatrix and projectionMatrix
// pos normal and uv built in
void main() {
	vNormal = inverse(transpose(mat3(modelViewMatrix))) * normal; // Phong, normal transformation
	vSurface = vec3(modelViewMatrix * vec4(position, 1.0));
	vUv = uv;
	vPos = position;
	cameraPos = cameraPosition;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}