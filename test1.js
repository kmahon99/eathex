var eathex = {
			scene:null,
			camera:null,
			contols:null,
			target_element:null,
			renderer:null,
			mesh:null,
			ready:false
			};

			
function eathex_click(target_id, has_controls=true){
    setup();
}


function eathex_exit(){
	$("#eathex_scripts").remove();
	eathex.target_element.removeChild(eathex.renderer.domElement);
	$("#eathex_render_window").width(0);
	$("#eathex_render_window").height(0);
	$("#eathex_render_window").on('transitionend webkitTransitionEnd oTransitionEnd', function(){
		$("#eathex_overlay").css("background-color","rgba(255,255,255,0)");
		$("#eathex_overlay").remove();
		$("#eathex_render_window").remove();
	});
}


//Generate the host DOM elements for scene
function setup(){
	$(document.body).prepend("<div id='eathex_scripts'><script src='build/three.js'></script><script src='OrbitControls.js'></script><script src='OBJLoader.js'></script></div>");
	if (!window.jQuery){ $("#eathex_scripts").prepend("<script src='https://code.jquery.com/jquery-3.3.1.min.js'></script>"); }
	$(document.body).prepend("<div id='eathex_overlay' onclick='eathex_exit()'></div>");
	$("#eathex_overlay").css({"background-color":"rgba(0,0,0,0)",
								"position":"fixed",
								"top":"0px",
								"left":"0px",
								"width":"100%",
								"height":"100%",
								"transition":"background-color 0.5s",
								"-webkit-transition":"background-color 0.5s"
								});
	$("#eathex_overlay").css("background-color","rgba(0,0,0,0.5)");
	$("#eathex_overlay").prepend("<div id='eathex_render_window'></div>");
	$("#eathex_render_window").css({"position":"fixed",
									"background-color":"rgba(83,83,92,1)",
									"height":"0px",
									"width":"0px",
									"top":"0",
									"bottom":"0",
									"left":"0",
									"right":"0",
									"margin":"auto",
									"transition":"all 0.5s",
									"-webkit-transition":"all 0.5s"
									});
	$("#eathex_render_window").height($(window).height()*.8);
	$("#eathex_render_window").width($(window).height()*.8);
	$("#eathex_render_window").on('transitionend webkitTransitionEnd oTransitionEnd', function(){ 
		eathex.ready = true; 
		eathex.target_element = document.getElementById("eathex_render_window");
		init_3D();
		$("#eathex_render_window").off('transitionend webkitTransitionEnd oTransitionEnd');
	});
}

//Set up the scene
function init_3D(has_controls=true){
	if(eathex.target_element != null){
		eathex.scene  = new THREE.Scene();
		eathex.camera = new THREE.PerspectiveCamera();
		eathex.camera.position.z = 30; eathex.camera.position.y = 10;

		eathex.controls = new THREE.OrbitControls(eathex.camera, eathex.target_element);

		eathex.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
		eathex.target_element.appendChild(eathex.renderer.domElement);

		var pointLight = new THREE.PointLight(0xFFFFFF);
		pointLight.position.x = -100;
		pointLight.position.y = 100;
		pointLight.position.z = 400;

		eathex.scene.add(eathex.camera);
		eathex.scene.add(pointLight);
		eathex.scene.background = new THREE.Color($("#"+eathex.target_element.id).css("background-color"));

		var loader = new THREE.OBJLoader();
		if(eathex.mesh == null){
			loader.load( 
				'test_model.obj', 
				function(object) {
				  eathex.scene.add(object);
				  eathex.mesh = object;
				},
				function(xhr) {
					
					console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
				},
				function ( error ) {
					console.log( 'An error happened' );
			});
		}
		else{ eathex.scene.add(eathex.mesh); }

		function resize() {
			var width = eathex.target_element.clientWidth;
			var height = eathex.target_element.clientHeight;
			
			eathex.renderer.setSize(width, height);
			eathex.camera.aspect = width/height;
		}

		function animate() {
			requestAnimationFrame(animate);    
			if(eathex.mesh){ eathex.mesh.rotation.y += 0.1 * Math.PI/180; }
			eathex.controls.update();
			eathex.renderer.render(eathex.scene, eathex.camera);
		}

		$(document).ready(function(){resize();});
		
		animate();
	}
	else{ alert("Render window unable to load!"); }
}

function resize() {
    var width = eathex.target_element.clientWidth;
    var height = eathex.target_element.clientHeight;
    eathex.renderer.setSize(width, height);
}

//Manage the window's sizing
$(window).resize(function(){
	if(eathex.ready){
		$("#eathex_render_window").css("height",($(window).height()*0.8)+"px");
		$("#eathex_render_window").css("width",($(window).height()*0.8)+"px");
		eathex.renderer.setSize(($(window).height()*0.8)+1, ($(window).height()*0.8)+1);
	}
});