d3.queue()
	.defer(d3.request, './UNdata_Export_20190625_212647973.xml')
//	,function(row) {
//		return {
//			cityName: row.city,
//			countryCode: row.iso2,
//			CO2: +row.value
//		}
//	})
	.await(function(error, data) {
		if (error) throw error;
		
		console.log(data);
	
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
	
	
	})


