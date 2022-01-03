
precision mediump float;
precision mediump int;
// uniform mat4 modelViewMatrix;
// uniform mat4 projectionMatrix;

// attribute vec2 uv;
// attribute vec3 position;
// attribute vec3 normal;
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;
	

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define OCTAVES 8
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}


void main () {
	vUv = uv;
	vNormal = normal;
	vec3 newPosition = vec3(position.x , position.y, position.z + 5.0 * random(vUv) +  sin(fbm(vUv)));
	// vNormal =  normalize(vec3(0.0, 0.0, 1.0));
	// vNormal = normal + vec3(0, 0, -2);
	// vNormal = normalize(normalMatrix * normal);
	vPosition = position;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
}