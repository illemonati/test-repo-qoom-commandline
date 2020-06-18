var $select = document.querySelector('select')
	, $main = document.querySelector('main')
	, $table = document.querySelector('div#table')
	, $create = document.querySelector('#create')
;

function loadSelect() {
	const options = {{SELECTDATA}};
	options.forEach(option => {
		var $option = document.createElement('option');
		$option.innerHTML = option;
		$option.value = option
		
		$select.appendChild($option);
	});
}
// https://github.com/divmgl/tabled.js
function loadTable() {
	var schemaName = this.value
		, url = `/view/${schemaName}/table`
	;
	if(!url) return;
	restfull.get({
		path: url,
		loadDivs: [$main]
	}, (err, res) => {
		if(err) return alert(err);
		var header = res && res.length
			? `<th>${Object.keys(res[0]).filter(h => !h.startsWith('__')).join('</th><th>')}</th>`
			: `<th>No Data</th>`
		$table.innerHTML = `<table><thead><tr>${header}</tr></thead></table>`;
		if(res && res.length) {
			try {
				res.forEach(r => {
					if(!r._id) return;
					r._id = `<a href='/update/${schemaName}/${r._id}' target='_blank'>${r._id}</a>`
				})
				tabled.create($table.querySelector('table'), {data: res});
			} catch(ex) {
				console.log(ex)
			}
		}
		
		$create.href = `/insert/${$select.value}`;
		
		const $nooption = $select.querySelector('#nooption');
		if($nooption) $select.removeChild($nooption);
	})
}


$select.addEventListener('change', loadTable);

loadSelect();