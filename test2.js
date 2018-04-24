$(document.body).prepend("<script src='build/three.js'></script><script src='LoaderSupport.js'></script><script src='ColladaLoader.js'></script><script src='OrbitControls.js'></script><script src='Inflate.min.js'></script><script src='OBJLoader.js'></script><script src='MTLLoader.js'></script>");

var target_element = document.getElementById("target");

var scene  = new THREE.Scene();
var camera = new THREE.PerspectiveCamera();
camera.position.z = 30;
var controls = new THREE.OrbitControls(camera, target_element);
var renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
target_element.appendChild(renderer.domElement);
		
scene.background = new THREE.Color( 0xa0a0a0 );
scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

var light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
light.position.set( 0, 200, 0 );
scene.add( light );

light = new THREE.DirectionalLight( 0xffffff );
light.position.set( 0, 200, 100 );
light.castShadow = true;
light.shadow.camera.top = 180;
light.shadow.camera.bottom = -100;
light.shadow.camera.left = -120;
light.shadow.camera.right = 120;
scene.add( light );

var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
mesh.rotation.x = - Math.PI / 2;
mesh.receiveShadow = true;
scene.add( mesh );

scene.add(camera);

var grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
grid.material.opacity = 0.2;
grid.material.transparent = true;
scene.add(grid);

var onProgress = function ( xhr ) {
	if ( xhr.lengthComputable ) {
		var percentComplete = xhr.loaded / xhr.total * 100;
		console.log( Math.round( percentComplete, 2 ) + '% downloaded' );
	}
};

var loader = new THREE.ColladaLoader();
loader.load("media/rb_mesh.DAE",function(obj){
	scene.add(obj.scene);
},onProgress, undefined);

$(document).ready(function(){resize();});

animate();

function resize() {
	var width = target_element.clientWidth;
	var height = target_element.clientHeight;
	renderer.setSize(width, height);
	camera.aspect = width/height;
}


function animate(){
	requestAnimationFrame(animate);
	controls.update();
	renderer.render(scene, camera);
}