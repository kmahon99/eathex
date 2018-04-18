var eathex = {
			scene:null,
			camera:null,
			contols:null,
			target_element:null,
			renderer:null,
			mesh:null,
			content_loaded:false,
			level:0,
			ready:false
			};


function eathex_click(target_id, has_controls){
    setup();
}

//Remove eathex from the target
function eathex_exit(){
	eathex.target_element.removeChild(eathex.renderer.domElement);
	$("#eathex_load_widget").remove();
	$("#eathex_render_window").width(0);
	$("#eathex_render_window").height(0);
	$("#eathex_exit").width(0);
	$("#eathex_exit").height(0);
	$("#eathex_overlay").css("background-color","rgba(255,255,255,0)");
	$("#eathex_exit").on('transitionend webkitTransitionEnd oTransitionEnd', function(){
		$("#eathex_exit").remove();
	});
	$("#eathex_render_window").on('transitionend webkitTransitionEnd oTransitionEnd', function(){
		$("#eathex_scripts").remove();
		$("#eathex_render_window").remove();
	});
	$("#eathex_overlay").on('transitionend webkitTransitionEnd oTransitionEnd', function(){
		$("#eathex_overlay").remove();
	});
}


//Generate the host DOM elements for scene
function setup(){
	$(document.body).prepend("<div id='eathex_scripts'><script src='build/three.js'></script><script src='OrbitControls.js'></script><script src='OBJLoader.js'></script><script src='jquery.topzindex.min.js'></script></div>");
	if (!window.jQuery){ $("#eathex_scripts").prepend("<script src='https://code.jquery.com/jquery-3.3.1.min.js'></script>"); }
	eathex.level = Math.max.apply(null, 
    $.map($('body *'), function(e,n) {
      if ($(e).css('position') != 'static')
        return parseInt($(e).css('z-index')) || 1;
	}));
	$(document.body).prepend("<div id='eathex_overlay'></div>");
	$(document.body).append("<div id='eathex_exit' onclick='eathex_exit()'></div>");
	$("#eathex_exit").css({
								"background-image":"url(media/eathex_exit.png)",
								"background-size":"cover",
								"margin":"20px",
								"cursor":"pointer",
								"position":"fixed",
								"top":"0px",
								"right":"0px",
								"width":"0px",
								"height":"0px",
								"z-index":eathex.level+1,
								"transition":"all 0.5s",
								"-webkit-transition":"all 0.5s"
	});
	$("#eathex_exit").height($(window).height()*0.1);
	$("#eathex_exit").width($(window).height()*0.1);
	$("#eathex_overlay").css({
								"background-color":"rgba(0,0,0,0)",
								"position":"fixed",
								"top":"0px",
								"left":"0px",
								"width":"100%",
								"height":"100%",
								"z-index":eathex.level+1,
								"transition":"background-color 0.5s",
								"-webkit-transition":"background-color 0.5s"
								});
	$("#eathex_overlay").css("background-color","rgba(0,0,0,0.7)");
	$("#eathex_overlay").prepend("<div id='eathex_render_window'></div>");
	$("#eathex_render_window").css({
									"position":"fixed",
									"background-color":"rgba(83,83,92,1)",
									"height":"0px",
									"width":"0px",
									"top":"0",
									"bottom":"0",
									"left":"0",
									"right":"0",
									"margin":"auto",
									"cursor":"grabbing",
									"box-shadow":"0 0 10px #000000",
									"z-index":eathex.level+1,
									"transition":"all 0.5s",
									"-webkit-transition":"all 0.5s"
									});
	$("#eathex_render_window").height($(window).height()*0.8);
	$("#eathex_render_window").width($(window).height()*0.8);
	$("#eathex_render_window").on('transitionend webkitTransitionEnd oTransitionEnd', function(){
		eathex.ready = true;
		eathex.target_element = document.getElementById("eathex_render_window");
		init_3D(true);
		$("#eathex_render_window").off('transitionend webkitTransitionEnd oTransitionEnd');
	});
}

//Set up the scene
function init_3D(has_controls){
	if(eathex.target_element != null){
		eathex.scene  = new THREE.Scene();
		eathex.camera = new THREE.PerspectiveCamera();
		eathex.camera.position.z = 30;
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

		$(document).ready(function(){resize();});

		loadOBJ('test_model.obj');
		animate();
	}
	else{ alert("Render window unable to load!"); }
}

function resize() {
	var width = eathex.target_element.clientWidth;
	var height = eathex.target_element.clientHeight;
	eathex.renderer.setSize(width, height);
	eathex.camera.aspect = width/height;
}

function loadOBJ(filename){
	if(eathex.ready){
		if(eathex.mesh == null){
			var loader = new THREE.OBJLoader();
			$("#eathex_render_window").prepend("<div id='eathex_load_overlay'></div>");
			$("#eathex_load_overlay").css({
				"position":"absolute",
				"width":"100%","height":"100%",
				"background-color":"rgba(0,0,0,1)",
				"z-index":eathex.level+1,
				"transition":"background-color 0.5s",
				"-webkit-transition":"background-color 0.5s"
			});
			$("#eathex_load_overlay").prepend("<div id='eathex_load_widget'></div>");
			$("#eathex_load_widget").css({
				"position":"absolute",
				"width":"30%",
				"height":"30%",
				"margin":"auto",
				"z-index":eathex.level+1,
				"top":"0", "left":"0","right":"0","bottom":"0",
				"background-color":"white"
			});
			loader.load(
				filename,
				function(object){
					eathex.scene.add(object);	
					eathex.mesh = object;
				},
				function(xhr){
					if(xhr.loaded/xhr.total*100 != 100){
						$("#eathex_load_widget").empty();
						$("#eathex_load_widget").prepend("<div style='text-align:center;position: relative;float: left;top: 50%;left: 50%;transform: translate(-50%, -50%);'>"+"loading...<br>"+(Math.round(xhr.loaded/xhr.total*100))+'%</div>');
					}
					else{
						$("#eathex_load_overlay").remove();
					}
				},
				function(error){
					$("#eathex_load_widget").empty();
					$("#eathex_load_widget").prepend("<div style='text-align:center;position: relative;float: left;top: 50%;left: 50%;transform: translate(-50%, -50%);'>"+"Failed to load model...");
			});
		}
		else{ eathex.scene.add(eathex.mesh); }
	}
}

function animate(){
	requestAnimationFrame(animate);
	if(eathex.mesh){ eathex.mesh.rotation.y += 0.1 * Math.PI/180; }
	eathex.controls.update();
	eathex.renderer.render(eathex.scene, eathex.camera);
}

//Manage the window's sizing
$(window).resize(function(){
	if(eathex.ready){
		$("#eathex_render_window").css("height",($(window).height()*0.8)+"px");
		$("#eathex_render_window").css("width",($(window).height()*0.8)+"px");
		eathex.renderer.setSize(($(window).height()*0.8)+1, ($(window).height()*0.8)+1);
	}
});
