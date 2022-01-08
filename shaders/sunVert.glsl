precision mediump float;
precision mediump int;

varying vec3 vPos;

void main () {
	vPos = position;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
}