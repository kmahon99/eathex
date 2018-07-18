var eathex = {
			scene:null,
			camera:null,
			cube_camera:null,
			contols:null,
			target_element:null,
			renderer:null,
			mesh:null,
			materials:[],
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
	$(document.body).prepend("<div id='eathex_scripts'><script src='build/three.js'></script><script src='OrbitControls.js'></script><script src='LoaderSupport.js'></script><script src='Inflate.min.js'></script><script src='FBXLoader.js'></script><script src='jquery.topzindex.min.js'></script><script src='eathex_materials.js'></script></div>");
	$("#eathex_scripts").append("<script src='media/material_frame.js'>");
	$("#eathex_scripts").append("<script src='media/material_decal.js'>");	
	$("#eathex_scripts").append("<script src='media/material_glass.js'>");	
	$("#eathex_scripts").append("<script src='media/material_plastic.js'>");	
	if (!window.jQuery){ $("#eathex_scripts").prepend("<script src='https://code.jquery.com/jquery-3.3.1.min.js'></script>"); }
	eathex.level = Math.max.apply(null, 
    $.map($('body *'), function(e,n) {
      if ($(e).css('position') != 'static')
        return parseInt($(e).css('z-index')) || 1;
	}));
	$(document.body).prepend("<div id='eathex_overlay'></div>");
	$("#eathex_overlay").prepend("<div id='eathex_exit' onclick='eathex_exit()'></div>");
	$("#eathex_exit").css({
								"background-image":"url(media/eathex_exit.PNG)",
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
		eathex.camera.position.z = 4;
		eathex.camera.position.x = 0;
		eathex.camera.position.y = 1;
		eathex.controls = new THREE.OrbitControls(eathex.camera, eathex.target_element);
		eathex.controls.enablePan = false;
		eathex.controls.enableDamping = true;
		eathex.controls.dampingFactor = 0.15;
		eathex.controls.rotateSpeed = 0.25;
		eathex.controls.minDistance = 0.1;
		eathex.controls.maxDistance = 5;
		eathex.controls.maxPolarAngle = Math.PI/2.05;
		eathex.controls.screenSpacePanning = false;
		eathex.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
		eathex.target_element.appendChild(eathex.renderer.domElement);
		
		eathex.scene.background = new THREE.Color(0xffffff);
		//eathex.scene.fog = new THREE.Fog(0xffffff,5,20);

		var light = new THREE.HemisphereLight(0xffffff,0x444444);
		light.position.set(0,200,0);
		eathex.scene.add(light);

		light = new THREE.DirectionalLight(0xffffff);
		light.position.set(0,200,100);
		light.castShadow = true;
		light.shadow.camera.top = 180;
		light.shadow.camera.bottom = -100;
		light.shadow.camera.left = -120;
		light.shadow.camera.right = 120;
		eathex.scene.add(light);
		
		var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000,2000),new THREE.MeshPhongMaterial({color:0x999999,depthWrite:true}));
		mesh.rotation.x = -Math.PI/2;
		mesh.position.y = -.1;
		mesh.receiveShadow = true;
		eathex.scene.add(mesh);

		eathex.scene.add(eathex.camera);
		
		$(document).ready(function(){resize();});

		loadMesh('media/rb_mesh.FBX');
		animate();
	}
	else{ alert("Render window unable to load!"); }
}

function resize() {
	var width = eathex.target_element.clientWidth;
	var height = eathex.target_element.clientHeight;
	eathex.renderer.setSize(width,height);
	eathex.camera.aspect = width/height;
}

function loadMesh(filename){
	if(eathex.ready){
		$("#eathex_render_window").prepend("<div id='eathex_load'><div id='eathex_load_widget'></div></div>");
		
		$("#eathex_load").css({
			"position":"absolute",
			"background-color":"rgba(0,0,0,1)",
			"width":"100%",
			"height":"100%"
		});
		
		$("#eathex_load_widget").css({
			"display":"flex",
			"position":"absolute",
			"width":"25%",
			"height":"25%",
			"background-color":"rgba(255,255,255,1)",
			"text-align":"center",
			"top":"0","left":"0","bottom":"0","right":"0",
			"margin":"auto",
			"justify-content":"center",
			"flex-direction":"column",
			"font-family":"Comic Sans MS, cursive, sans-serif",
			"font-size":"200%",
			"transition":"background-color 1s",
			"-webkit-transition":"background-color 1s"
		});
		
		if(eathex.mesh == null){
			var loader = new THREE.FBXLoader(new THREE.LoadingManager());
			loader.load(
				filename,
				function(obj){
					eathex.scene.add(obj);
					eathex.mesh = obj;
					getMaterials(obj);
					setMaterialsByNode(material_frame,obj,["Arm","Arm001","Frame"]);
					setMaterialsByNode(material_decal,obj,["Rayban","Nose_Decal","Nose_Decal001"]);
					setMaterialsByNode(material_glass,obj,["Glass","Glass001"]);
					setMaterialsByNode(material_plastic,obj,["Nosepad","Nosepad001","Arm_End","Arm_End001"]);
					$("#eathex_load").remove(); 
				},
				function(xhr){
					$("#eathex_load_widget").text(Math.round(xhr.loaded/xhr.total*100));
				},
				function(err){
					console.error(err);
			});
		}
		else{ 
			eathex.scene.add(eathex.mesh); 
			$("#eathex_load").remove();
		}		
	}
}

function animate(){
	requestAnimationFrame(animate);
	if(eathex.mesh){ 
		//eathex.mesh.rotation.y += 0.001; 
		
	}
	eathex.renderer.render(eathex.scene,eathex.camera);
	eathex.controls.update();
}

//Manage the window's sizing
$(window).resize(function(){
	if(eathex.ready){
			$("#eathex_render_window").css("height",($(window).height()*0.8)+"px");
			$("#eathex_render_window").css("width",($(window).height()*0.8)+"px");
		eathex.renderer.setSize(($(window).height()*0.8)+1, ($(window).height()*0.8)+1);
	}
});
