var material_plastic = new THREE.MeshStandardMaterial({
	map: new THREE.TextureLoader().load('media/rb1_TEX.png'),
	metalness:0,
	roughness:0.1,
	alphaMap: new THREE.TextureLoader().load('media/rb1_TEX_mask.png'),
	transparent:true
});

var envMap = new THREE.TextureLoader().load('media/env_1.png');
envMap.mapping = THREE.SphericalReflectionMapping;
material_glass.envMap = envMap;