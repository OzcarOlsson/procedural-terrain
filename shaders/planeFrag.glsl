precision mediump float;
precision mediump int;

uniform vec3 Ka;
uniform vec3 Kd;
uniform vec3 Ks;
uniform vec4 LightPosition;
uniform vec3 LightIntensity;
uniform float Shininess;
uniform float test;


varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vViewPosition;

uniform mat4 view;

vec3 phong() {
	vec3 n = normalize(vNormal);
	vec3 s = normalize(vec3(LightPosition) - vPosition);
	vec3 v = normalize(vec3(-vPosition));
	vec3 r = reflect(s, n);

	vec3 ambient = Ka;
	vec3 diffuse = Kd * max(dot(s, n), 0.0);
	vec3 specular = Ks * pow(max(dot(r, v), 0.0), Shininess);
	return LightIntensity * (ambient + diffuse + specular);
}



// Linear interpolation
vec3 lerp(float lowerBound, float threshold, float zVal, vec3 colorTop, vec3 colorBottom) {
	
		float weight = (zVal - lowerBound) / (threshold - lowerBound);
		vec3 outColor = (1.0 - weight) * colorBottom + weight * colorTop;
		return outColor;
}

void main() {
	vec3 vP = vPosition;
	vec3 outColor;
	vec3 n = normalize(vNormal);
	float shade = n.z;
	float te = test;
	// vec3 aasd = lightDirection;

	//Colors
	vec3 lightBlue = vec3(52.0 / 255.0, 125.0 / 255.0, 235.0 / 255.0);
	vec3 darkBlue = vec3(8.0 / 255.0, 24.0 / 255.0, 255.0 / 255.0);
	vec3 green = vec3(55.0 / 255.0, 120.0 / 255.0, 66.0 / 255.0);
	vec3 brown = vec3(128.0 / 255.0, 64.0 / 255.0, 0.0) ;
	vec3 lighterBrown = vec3(128.0 / 255.0, 120.0 / 255.0, 0.0) ;

	float threshold = -.5;
	float lowerBound = -1.5;
	if(vP.z < threshold ) {
		float weight = (vP.z - lowerBound) / (threshold - lowerBound);

		outColor = lerp(lowerBound, threshold, vP.z, lightBlue, darkBlue);
	}
	else if(vP.z > threshold && vP.z < 0.0) {
		outColor = lerp(lowerBound, 0.0, vP.z, brown, lighterBrown );
	}
	else if(vP.z > 1.5) {
		vec3 white = vec3(1., 1., 1.);
		outColor = lerp(1.4, 1.7, vP.z, white, brown);
	} else {
		outColor = brown;
	}
	if(test == 1.0) {
		outColor = vec3(.5, .5, .5);
	}


	// NEW PHONG
	vec3 N = normalize(vNormal);
	vec3 lightPos = vec3(LightPosition.x, LightPosition.y, LightPosition.z );
	vec3 L = normalize(lightPos - vP);
	float lambertian = max(dot(N,L), 0.0);
	float specular = 0.0;

		vec3 R = reflect(-L, N); // reflected light vector
		vec3 V = normalize(-vP);
		// Compute the specular term
		float specAngle = max(dot(R,V), 0.0);
		specular = pow(specAngle, Shininess);



	vec3 phongis = vec3(Ka + Kd * lambertian + Ks * specular);
	



	gl_FragColor = vec4(outColor * phongis , 1.0);
	// gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
		//gl_FragColor = vec4(outColor * shade * shade , 1.0);

//	gl_FragColor = vec4(0.3, 0.3, 0.3, 1.);

}

// fragLightDir = lightPos - fragPos