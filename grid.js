var G = (function () {
    "use strict";

	var defaults = {
		setValue: function(value) {
			this.innerHTML = value;
		}
	};

	function create(rows, cols, config) {
		var target = config.target || document.body;
		var table = document.createElement("table"), i, j, row, cell;
		var col, colGroup;
		var config = config || {};
		table.setAttribute('cellspacing', 0);
		table.setAttribute('cellpadding', 0);
		table.setAttribute('rules', 'groups');

		if (config.columnSpans) {
			for (i=0; i<config.columnSpans.length; i++) {
				colGroup = document.createElement('colgroup');
				colGroup.setAttribute('span', config.columnSpans[i]);
				colGroup.setAttribute('style', 'border: solid black 1px !important;');
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
					(config.setValue || defaults.setValue).call(cellEl, value);
				}

				return {
					el: cellEl,
					setValue: setValue
				};
			}

			return {
				el: el,
				cellAt: cellAt,
				setValue: function(col, value) {
					cellAt(col).setValue(value);
				}
			};
		}

		return {
			el: table,
			rowAt: rowAt,
			cellAt: function(row, col) {
				return rowAt(row).cellAt(col);
			},
			setValue: function(row, col, value) {
				return rowAt(row).setValue(col, value);
			}
		};
	}

    return {
		create: create
    };
}());
