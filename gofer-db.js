// clasa WebDatabase
function WebDatabase(config){

	var databaseName = config.databaseName;
	
	var ddls = config.ddls;

	var indexedDB = window.indexedDB || window.webkitIndexedDB || window.msIndexedDB;

	var db;

	var me = this;
	
	this.open = function(callback){

		var request = indexedDB.open(databaseName,2);
		request.onupgradeneeded = function(e){
			db = e.target.result;	
			me.create(ddls);
			//console.dir(e);
		}

		request.onsuccess = function(e){
			db = e.target.result;
			console.log("success: open database");	
			if (callback){
				callback();
			}
		}
		
		request.onerror = function(e){
			console.log("error: open database");	
		}
	}

	this.drop = function(callback){
		console.log("try to drop database");	
		db.close(); // explicit close the database
		var request = indexedDB.deleteDatabase(this.databaseName);
		request.onsuccess = function(e){
			console.log("success: drop database");	
			if (callback){
				callback();
			}
		}
		
		request.onerror = function(e){
			console.log("error: drop database");	
		}
	}
	
	//[{objectStore:"book",keyPath:id}]
	this.create = function(ddls){
		for (var i in ddls) {
			var ddl=ddls[i];
			db.createObjectStore(ddl.objectStore, { keyPath: ddl.keyPath });
		}
	}
	
	// insert
	// {name:"book", properties:{title:"JavaScript", year:"1995",publisherId:1}}
	this.insert = function(object,callback){
		var objectStore = db.transaction(object.name, "readwrite").objectStore(object.name);
		objectStore.add(object.properties);
	}
	

}



