varying vec3 vPos;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 cameraPos;

// http://www.cs.toronto.edu/~jacobson/phong-demo/ PHONG shader
uniform sampler2D tex;
uniform vec4 lightPosition;
uniform float hasTexture;

vec3 phong( vec3 Ka, vec3 Kd, vec3 Ks) {
	vec4 lightPos = viewMatrix * lightPosition;  // Light position from view to world coordinates
	float shininess = 30.0;

	vec3 N = normalize(vNormal);
	vec3 L = normalize(lightPos.xyz - vPos);
	// Lamberts cosine law
	float lambertian = max(dot(N,L), 0.0);
	float specular = 0.0;
	if(lambertian > 0.0) {
		vec3 R = reflect(-L, N); // Reflected light vector;
		vec3 V = normalize( cameraPos- vPos); // Vector to viewer

		// Compute the specular term
		float specAngle = max(dot(R,V), 0.0);
		specular = pow(specAngle, shininess);
	}
	 return vec3( Ka +  Kd * lambertian + Ks * specular);
	
}

// Linear interpolation
vec3 lerp(float lowerBound, float threshold, float yVal, vec3 colorTop, vec3 colorBottom) {
	
		float weight = (yVal - lowerBound) / (threshold - lowerBound);
		vec3 outColor = (1.0 - weight) * colorBottom + weight * colorTop;
		return outColor;
}

vec3 getVertexColor() {
	vec3 outColor;
	vec3 vP = vPos;

	vec3 white = vec3(.8, .8, .8);
	vec3 brown = vec3(92.0 / 255.0, 47.0 / 255.0, 21.0 / 255.0);
	float threshold = 13.0;
	float lowerBound = threshold - 2.0;

	if(vP.y > threshold ) {
		outColor = white;

	} else if(vP.y < threshold && vP.y > lowerBound) {
		float weight = (vP.y - lowerBound) / (threshold - lowerBound);
		outColor = lerp(lowerBound, threshold, vP.y, white, brown);
	}
	else {
		outColor = brown;
	}
	
	return outColor;
}

void main() {
	vec3 color = vec3(128.0 / 255.0, 64.0 / 255.0, 0.0);
	vec4 outColor;
	if(hasTexture == 1.0) {
		vec3 t = texture2D(tex, vUv).rgb;
		vec3 Ka = vec3(t) * 0.3;
		vec3 Kd = vec3(t);
		vec3 Ks = vec3(0.4,.4,.4);
		outColor = vec4(t * phong(Ka, Kd, Ks), 1.0);
	} else {
		vec3 Ka = vec3(1.0, 1.0, 1.0);
		vec3 Kd = vec3(1.0, 1.0, 1.0);
		vec3 Ks = vec3(0.4,.4,.4);

		outColor = vec4(getVertexColor() * phong(Ka, Kd, Ks), 1.0) ;
	}
	gl_FragColor = outColor;
}

