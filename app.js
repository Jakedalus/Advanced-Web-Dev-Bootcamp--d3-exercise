



d3.queue()
	.defer(d3.xml, './UNdata_Export_20190625_212647973.xml')
	.await(function(error, data) {
		if (error) throw error;
		
		console.log(data, typeof data);
	
		var records = Array.from(data.getElementsByTagName('record'));
	
		console.log(records, typeof records, Array.isArray(records));
		
		var climateData = [];
	
		for (var record of records) {
//			console.log(record);
			var fields = Array.from(record.getElementsByTagName('field'));
//			console.log(fields);
			
			var recordObj = {};
			for (var field of fields) {
//				console.log(field.getAttribute('name'));
//				console.log(field.textContent);
				
				var label = field.getAttribute('name') === 'Country or Area' ? 'country' : field.getAttribute('name').toLowerCase();
				
				recordObj[label] = field.textContent;
				
//				console.log(recordObj);
			}
			
			climateData.push(recordObj);
		}
		
		console.log(climateData);
	
		var height = 500;
		var width = 500;
		var padding = 50;

		var countries = climateData.reduce((acc, next) => {
			// console.log('acc', acc);
			// console.log('next', next);
			if (acc.indexOf(next.country) === -1) acc.push(next.country);
			return acc;
		}, []);

		console.log('countries:', countries);

		var ausData = climateData.filter(d => d.country === 'Australia');

		console.log(ausData);

		var numBars = ausData.length;
		var barPadding = 10;
		var barWidth = (width / numBars) - barPadding;

		var yScale = d3.scaleLinear()
						.domain(d3.extent(ausData, d => d.value))
						.range([height - padding, padding]);

		var xScale = d3.scaleLinear()
						.domain(d3.extent(ausData, d => d.year))
						.range([padding, width - padding]);

		var svg = d3.select('svg')
					.attr('width', width)
					.attr('height', height);

		svg
			.selectAll('rect')
			.data(ausData)
			.enter()
			.append('rect')
				.attr('width', barWidth)
				.attr('height', d => height - yScale(d.value))
				.attr('y', d => yScale(d.value))
				.attr('x', (d,i) => (barWidth + barPadding) * i)
				.attr('fill', 'purple');
		
		d3.select('select')
			.selectAll('option')
			.data(countries)
			.enter()
			.append('option')
				.text(d => d);

	
	});

