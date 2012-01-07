if (typeof $ === 'undefined') var $ = function(id) { return document.getElementById(id); }

if (typeof Object.keys != 'function') {
	Object.keys = function(obj) {
		if (typeof obj != "object" && typeof obj != "function" || obj == null) {
			throw TypeError("Object.keys called on non-object");
		} 
		var keys = [];
		for (var p in obj) obj.hasOwnProperty(p) && keys.push(p);
		return keys;
	}
}

