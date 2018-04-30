var material_frame = new THREE.MeshStandardMaterial({
	color: 0xffffff,
	map: new THREE.TextureLoader().load('media/rb1_TEX.png'),
	aoMap: new THREE.TextureLoader().load('media/env_1.png'),
	metalness:0.9,
	roughness:0
});

var envMap = new THREE.TextureLoader().load('media/env_1.png');
envMap.mapping = THREE.SphericalReflectionMapping;
material_frame.envMap = envMap;