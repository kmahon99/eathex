function getMaterials(object){
	object.children.forEach(function(item){
		if(item.children.length != 0){ getMaterials(item); }
		if(!eathex.materials.includes(item.material.name)){ eathex.materials.push(item.material.name); }
	});
}

function setMaterialsByNode(material,object,nodes){
	object.children.forEach(function(item){
		if(item.children.length != 0){ setMaterialsByNode(material,item,nodes); }
		if(nodes.includes(item.name)){
			item.material = material;
		}
	});
}