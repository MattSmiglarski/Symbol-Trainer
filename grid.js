var G = (function () {
    "use strict";

	var defaults = {
		setValue: function(value) {
			this.appendChild(value);
		}
	};

	function create(rows, cols, config) {
		var target = config.target || document.body;
		var table = document.createElement("table"), i, j, row, cell;
		var col, colGroup;
		var config = config || {};
		var value;

		table.setAttribute('cellspacing', '5px');
		table.setAttribute('cellpadding', 0);

		if (config.columnSpans) {
			for (i=0; i<config.columnSpans.length; i++) {
				colGroup = document.createElement('colgroup');
				colGroup.setAttribute('span', config.columnSpans[i]);
				table.appendChild(colGroup);
			}
		}

		for (i=0; i<rows; i+=1) {
			row = document.createElement("tr");
			for (j=0; j<cols; j+=1) {
				cell = document.createElement("td");
				row.appendChild(cell);
			}
			table.appendChild(row);
		}
		target.appendChild(table);
		
		function rowAt(row) {
			var el = table.getElementsByTagName('tr')[row];	

			function cellAt(col) {
				var cellEl = el.getElementsByTagName('td')[col];

				function setValue(value) {
					if (value) {
						cellEl.appendChild(value);
					}
				}

				function getValue() {
					return cellEl.getAttribute('data-value');
				}

				return {
					el: cellEl,
					setValue: setValue,
					getValue: getValue
				};
			}

			return {
				el: el,
				cellAt: cellAt,
				setValue: function(col, value) {
					cellAt(col).setValue(value);
				},
				getValue: function(col) {
					return cellAt(col).getValue();
				}
			};
		}

		function cellAt(row, col) {
			return rowAt(row).cellAt(col);
		}

		return {
			el: table,
			rowAt: rowAt,
			cellAt: cellAt,
			setValue: function(row, col, value) {
				return rowAt(row).setValue(col, value);
			},
			getValue: function(row, col) {
				return rowAt(row).cellAt(col).getValue();
			},
			rows: function() { return target.getElementsByTagName('tr').length },
			cols: function() { return target.getElementsByTagName('tr')[0].getElementsByTagName('td').length },
			clear: function() {
				for (var i=0; i<rows.length; i+=1) {
					for (var j=0; j<cols.length; j+=1) {
						cellAt(i, j).innerHTML = '';	
					}
				}
			}
		};
	
	}

    return {
		create: create
    };
}());
