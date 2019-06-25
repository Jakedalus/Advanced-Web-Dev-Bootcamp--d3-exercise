var height = 500;
var width = 500;
var padding = 50;



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
	
		

		var countries = climateData.reduce((acc, next) => {
			// console.log('acc', acc);
			// console.log('next', next);
			if (acc.indexOf(next.country) === -1) acc.push(next.country);
			return acc;
		}, []);

		console.log('countries:', countries);

		var countryData = climateData.filter(d => d.country === 'Australia');
		graphCountry(countryData, true);
		
		d3.select('select')
			.on('change', function() {
				var country = d3.event.target.value;
				console.log(country);
				var countryData = climateData.filter(d => d.country === country);
				graphCountry(countryData, false);
			})
			.selectAll('option')
			.data(countries)
			.enter()
			.append('option')
				.text(d => d);

	
	});


function graphCountry(countryData, firstPageLoad) {

	console.log('countryData', countryData);
	
	var numBars = countryData.length;
	var barPadding = 10;
	var barWidth = (width / numBars) - barPadding;

	var yScale = d3.scaleLinear()
					.domain(d3.extent(countryData, d => +d.value))
					.range([height - padding, padding]);

	var xScale = d3.scaleLinear()
					.domain(d3.extent(countryData, d => +d.year))
					.range([padding, width - padding]);

	console.log('xScale:', xScale.domain(), xScale.range());
	console.log('yScale:', yScale.domain(), yScale.range());

	var svg = d3.select('svg')
				.attr('width', width)
				.attr('height', height)
				.selectAll('rect')
				.data(countryData);

	svg
		.exit()
		.remove();

 	if(!firstPageLoad) {
		svg
			.enter()
			.append('rect')
			.merge(svg)
				.transition()
				// .delay((d, i) => i * 30)
				.attr('width', barWidth)
				.attr('height', d => {
					// console.log('yScale value:', yScale(d.value));
					// console.log('height', height - yScale(d.value));
					return height - yScale(d.value)})
				.attr('y', d => yScale(d.value))
				.attr('x', (d,i) => (barWidth + barPadding) * i)
				.attr('fill', 'purple');
	} else {
		svg
			.enter()
			.append('rect')
			.merge(svg)
				.attr('width', barWidth)
				.attr('height', d => {
					// console.log('yScale value:', yScale(d.value));
					// console.log('height', height - yScale(d.value));
					return height - yScale(d.value)})
				.attr('y', d => yScale(d.value))
				.attr('x', (d,i) => (barWidth + barPadding) * i)
				.attr('fill', 'purple');
	}
			
}








