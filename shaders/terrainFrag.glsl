varying vec3 vPos;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPos;
varying vec3 vSurface;
varying vec3 cameraPos;

// http://www.cs.toronto.edu/~jacobson/phong-demo/ PHONG shader
uniform sampler2D tex;

void main() {
	const vec3 lightPos = vec3(20.0, 50.0, -60.0);
	// vec3 lightPos = vec3(10.0, 10.0, 0.0);
	float shininess = 30.0;
	vec3 Ka = vec3(0.5,0.5,0.5);
	vec3 Kd = vec3(0.5,0.5,0.5);
	vec3 Ks = vec3(1.0,1.0,1.0);

	vec3 N = normalize(vNormal);
	vec3 L = normalize(lightPos - vPos);
	// Lamberts cosine law
	float lambertian = max(dot(N,L), 0.0);
	float specular = 0.0;
	if(lambertian > 0.0) {
		vec3 R = reflect(-L, N); // Reflected light vector;
		vec3 V = normalize(-vPos); // Vector to viewer

		// Compute the specular term
		float specAngle = max(dot(R,V), 0.0);
		specular = pow(specAngle, shininess);
	}
	vec4 color = vec4(Ka + Kd * lambertian + Ks * specular, 1.0) ;

	gl_FragColor = color;

	// gl_FragColor = vec4(shade, shade, shade, 1.0) * vec4(0.5, 0.5, 0.5, 1.0);
}

      // position: { x: 20, y: 50, z: -60 },


	// diffuse = dot(normalize(vNormal), light);
	// diffuse = max(0.0, diffuse); // no negative light

	// //Spec
	// vec3 r = reflect(-light, normalize(vNormal));
	// vec3 v = normalize(-vSurface);

	// specular = dot(r,v);
	// if(specular > 0.0) {
	// 	specular = 1.0 * pow(specular, 150.0);
	// }
	// specular = max(specular, 0.0);
	// shade = 0.7 * diffuse + 1.0 * specular + 0.3;