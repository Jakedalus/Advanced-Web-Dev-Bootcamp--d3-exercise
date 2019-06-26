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

	var xAxis = d3.axisBottom(xScale)
					.tickSize(-height + (2 * padding))
					.tickSizeOuter(0);

	var yAxis = d3.axisLeft(yScale)
					.tickSize(-width + (2 * padding))
					.tickSizeOuter(0);

	console.log('xScale:', xScale.domain(), xScale.range());
	console.log('yScale:', yScale.domain(), yScale.range());

	var svg = d3.select('svg')
				.attr('width', width)
				.attr('height', height);

	svg
	  .append('g')
	  .attr('transform', `translate(0, ${height - padding})`)
	  .call(xAxis);

	svg
	  .append('g')
	  .attr('transform', `translate(${padding}, 0)`)
	  .call(yAxis);

	//title
	svg
		.append('text')
			.attr('x', width / 2)
			.attr('y', height - padding)
			.attr('dy', '1.5em')
			.style('text-anchor', 'middle')
			.text('Greenhouse Gas (GHGs) Emissions without Land Use, Land-Use Change and Forestry (LULUCF), in kilotonne CO2 equivalent');

	//x-axis label
	svg
	  .append('text')
	    .attr('x', width / 2)
	    .attr('y', height - padding)
	    .attr('dy', '1.5em')
	    .style('text-anchor', 'middle')
	    .text('Year');
			
	//y-axis label
	svg
	  .append('text')
	    .attr('transform', 'rotate(-90)')
	    .attr('x', -height / 2)
	    .attr('y', padding)
	    .attr('dy', '-1.1em')
	    .style('text-anchor', 'middle')
	    .text('Greenhouse Gas (GHGs) Emissions  in kilotonne CO2 equivalent');



	var update = svg
			.selectAll('rect')
			.data(countryData);
			// .on('mousemove', showTooltip)
			// .on('mouseout', hideTooltip)
			// .on('touchstart', showTooltip)
			// .on('touchend', hideTooltip);

	


	update
		.exit()
		.remove();

	

 	if(!firstPageLoad) {
		update
			.enter()
			.append('rect')
				.on('mousemove touchmove', showTooltip)
        .on('mouseout touchend', hideTooltip)
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
				.attr('fill', 'red');
	} else {
		update
			.enter()
			.append('rect')
				.on('mousemove touchmove', showTooltip)
        .on('mouseout touchend', hideTooltip)
			.merge(svg)
				.attr('width', barWidth)
				.attr('height', d => {
					console.log('d:', d);
					// console.log('yScale value:', yScale(d.value));
					// console.log('height', height - yScale(d.value));
					return height - yScale(d.value)
				})
				.attr('y', d => yScale(d.value))
				.attr('x', (d,i) => (barWidth + barPadding) * i)
				.attr('fill', 'green');


	}

	
}

function showTooltip(d) {
	console.log('showTooltip');
	var tooltip = d3.select('.tooltip');
  tooltip
		.style('opacity', 1)
		.style('left', `${d3.event.x - tooltip.node().offsetWidth / 2}px`)
		.style('top', `${d3.event.y - 25}px`)
		.html(`
		<p>Year: ${d.year}</p>
		<p>Value: ${d.value.toLocaleString()}</p>
		`);
}

function hideTooltip() {
	d3.select('.tooltip')
		.style('opacity', 0);
}







