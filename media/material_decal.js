var material_decal = new THREE.MeshBasicMaterial({
	map: new THREE.TextureLoader().load('media/rb1_TEX.png'),
	alphaMap: new THREE.TextureLoader().load('media/rb1_TEX_mask.png'),
	side:THREE.DoubleSide,
	transparent:true
});