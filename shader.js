import * as THREE from "https://cdn.skypack.dev/three@0.136.0";

const myShader = {
  uniforms: {
    blueColor: { value: new THREE.Vector3(0, 0, 1) },
    redColor: { value: new THREE.Vector3(1, 0, 0) },
    // value [show, showX, showY, showZ]
    showColor: { value: [false, true, false, false] },

    showDisplacement: { value: [false, true, true, true] },
    scale: { value: 1.0 },
    lowerBound: { value: 0.0 },
    higherBound: { value: 0.0 },
  },

  vertexShader: `

	attribute vec3 vertexDisplacement;
	varying vec3 vUv;

	uniform vec3 blueColor;
	uniform vec3 redColor;

	uniform float scale;
	uniform bvec4 showDisplacement;
	uniform float lowerBound;
	uniform float higherBound;
	varying vec3 result;

	vec3 linearNormalize() {		
		float a = 0.0;
		float b = 1.0; 

		float normTestX = (b - a) * (vertexDisplacement.x - lowerBound) / (higherBound - lowerBound) + a ;
		float normTestY = (b - a) * (vertexDisplacement.y - lowerBound) / (higherBound - lowerBound) + a ;
		float normTestZ = (b - a) * (vertexDisplacement.z - lowerBound) / (higherBound - lowerBound) + a ;
		// float normTest = (b - a) * (vertexDisplacement -lowerBound) / (higherBound - lowerBound) + a ;

		return vec3(normTestX, normTestY, normTestZ);
	} 

	// Under construction
	vec3 logNormalize() {		
		float a = 0.0;
		float b = 1.0; 

		float normTestX = (b - a) * (log(vertexDisplacement.x) - log(lowerBound)) / (log(higherBound) - log(lowerBound)) + a ;
		float normTestY = (b - a) * (log(vertexDisplacement.y) - log(lowerBound)) / (log(higherBound) - log(lowerBound)) + a ;
		float normTestZ = (b - a) * (log(vertexDisplacement.z) - log(lowerBound)) / (log(higherBound) - log(lowerBound)) + a ;
		// float normTest = (b - a) * (vertexDisplacement -lowerBound) / (higherBound - lowerBound) + a ;

		return vec3(normTestX, normTestY, normTestZ);
	} 


	void main() {
		vUv = position;
		vec3 p = position;
		
		result =  linearNormalize();
		// result =  logNormalize();
		// vec3 result = vec3(linearNormalize());
		if(showDisplacement.x) {
			if(showDisplacement.y) p.x += scale * vertexDisplacement.x;	
			if(showDisplacement.z) p.y += scale * vertexDisplacement.y;	
			if(showDisplacement.w) p.z += scale * vertexDisplacement.z; 
		}
		vec4 modelViewPosition = modelViewMatrix * vec4(p, 1.0);
		gl_Position = projectionMatrix * modelViewPosition;

	}
`,
  fragmentShader: `

	varying vec3 vUv;
	uniform vec3 blueColor;
	uniform vec3 redColor;
	uniform bvec4 showColor;
	varying vec3 result; //float working , testing vec3

	float chooseColor() {
		
		if(showColor.y) return result.x;
		if(showColor.z) return result.y;
		if(showColor.w) return result.z;
		float magnitude = sqrt((pow(result.x, 2.0) + pow(result.y, 2.0) + pow(result.z, 2.0))) ;
		return float(magnitude);
	}
	void main() {

		vec3 colors = vec3(mix(blueColor, redColor, chooseColor()));
		vec3 baseColor = vec3(0.560, 0.570, 0.580);

		if(showColor.x == true) gl_FragColor = vec4(colors , 1.0);
		else gl_FragColor = vec4(baseColor, 1.0);
	}
	`,
};

export { myShader };
