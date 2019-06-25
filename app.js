
//d3.xml('UNdata_Export_20190625_212647973.xml', function(error, xml) {
//	if (error) throw error;
//	
//	console.log(xml);
//	console.log(xml.responseXML);
//	console.log('what');
//});

d3.queue()
	.defer(d3.xml, './UNdata_Export_20190625_212647973.xml')
//	,function(row) {
//		return {
//			row
//		}
//	})
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
	
		
	
//		var data = countries.geonames.map(country => {
//			country.cities = cities.filter(city => city.countryCode === country.countryCode);
//			return country;
//		});
//	
//		var countrySelection = d3.select('body')
//			.selectAll('div')
//			.data(data)
//			.enter()
//			.append('div');
//	
//		countrySelection
//			.append('h3')
//				.text(d => d.countryName);
//	
//		countrySelection
//			.append('ul')
//			.html(d => d.cities.map(city => {
//				var percentage = (city.population / d.population) *100;
//				return `<li>${city.cityName} - ${percentage.toFixed(2)}%</li>`;
//			}).join(''));
	
	
	});
//
//
