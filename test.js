var element = document.getElementById('target');

var scene  = new THREE.Scene();
var camera = new THREE.PerspectiveCamera();
camera.position.z = 30;

var controls = new THREE.OrbitControls(camera, element);

var renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
element.appendChild(renderer.domElement);

scene.background = new THREE.Color( 0x000000 );

var pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.x = -100;
pointLight.position.y = 100;
pointLight.position.z = 400;

scene.add(camera);
scene.add(pointLight);

var mesh;
var loader = new THREE.OBJLoader();
loader.load( 'test_model.obj', function ( object ) {
  scene.add( object );
  mesh = object;
} );

function resize() {
    var width = element.clientWidth;
    var height = element.clientHeight;
	
    renderer.setSize(width, height);
    camera.aspect = width/height;
}

function animate() {
    requestAnimationFrame(animate);    
    if(mesh){ mesh.rotation.y += 0.1 * Math.PI/180; }
    controls.update();
    renderer.render(scene, camera);
}

$(document).ready(function(){resize();});
$(window).resize(function(){resize();});

animate();
