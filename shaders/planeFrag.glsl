precision mediump float;
precision mediump int;

uniform vec3 Ka;
uniform vec3 Kd;
uniform vec3 Ks;
uniform vec4 LightPosition;
uniform vec3 LightIntensity;
uniform float Shininess;


varying vec3 vPosition;
varying vec3 vNormal;

vec3 phong() {
	vec3 n = normalize(vNormal);
	vec3 s = normalize(vec3(LightPosition) - vPosition);
	vec3 v = normalize(vec3(-vPosition));
	vec3 r = reflect(-s, n);

	vec3 ambient = Ka;
	vec3 diffuse = Kd * max(dot(s, n), 0.0);
	vec3 specular = Ks * pow(max(dot(r, v), 0.0), Shininess);
	return LightIntensity * (ambient + diffuse + specular);
}

void main() {
	vec3 test = vPosition;
	vec3 outColor;
	vec3 n = normalize(vNormal);
	float shade = n.z;

	float threshold = -0.5;
	if(test.z < threshold) {
		outColor = vec3(0.0,0.0,1.0);
	} else if(test.z > 1.5) {
		outColor = vec3(1., 1., 1.);
	} else {
		outColor = vec3(0.5, 0.25, 0.0) ;
	}

	
	gl_FragColor = vec4(outColor * shade, 1.0);
//	gl_FragColor = vec4(0.3, 0.3, 0.3, 1.);

}