var material_glass = new THREE.MeshStandardMaterial({
	map: new THREE.TextureLoader().load('media/rb1_TEX.png'),
	metalness:0.1,
	roughness:0.2,
	alphaMap: new THREE.TextureLoader().load('media/rb1_TEX_mask.png'),
	combine: THREE.MixOperation, 
    reflectivity: 0.25,
    specular: 0xffffff,
	transparent:true
});

var envMap = new THREE.TextureLoader().load('media/env_1.png');
envMap.mapping = THREE.SphericalReflectionMapping;
material_glass.envMap = envMap;