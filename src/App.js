import React, {useState, useEffect} from 'react';
import {FormControl, Select, MenuItem, Card, CardContent} from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData, prettyPrintStat } from './util';
import LineGraph from './LineGraph';
import './App.css';
import "leaflet/dist/leaflet.css";
 
function App() {

	const lat = 34.80746;
	const lng = -40.4796;

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenetr, setmapCenetr] = useState({lat , lng});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");


  useEffect(() => {
		fetch("https://disease.sh/v3/covid-19/all")
		.then(response => response.json())
		.then(data => {
			setCountryInfo(data);
		})
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
          name: country.country, //country name
          value: country.countryInfo.iso2, //country id
		}));
		
		const sortedData = sortData(data);
		setTableData(sortedData);
		setMapCountries(data);
		setCountries(countries);  	  
      });
    };

    getCountriesData();
  }, []);

  	const onCountryChange = async (event) => {
    const countryCode = event.target.value;
	 setCountry(countryCode);
	 
	const url = countryCode === 'worldwide' 
	 ? 'https://disease.sh/v3/covid-19/all' 
	 : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

	await fetch(url)
	.then(response => response.json())
	.then(data => {
		setCountry(countryCode);
		//All of the data... from country response
		setCountryInfo(data);
		setmapCenetr([data.countryInfo.lat, data.countryInfo.long]);
		setMapZoom(4);
	});
  };

  //console.log("Country INFO >>>", countryInfo);

  return (
    <div className="app">
      <div className="divapp__left">
			
			{/* Header */}
			<div className="app__header">
				<h1>COVID-19 TRACKER</h1>
				
				{/* Title + select input dropdown field */}
				<FormControl className="app__dropdown">
				<Select 
					variant="outlined" 
					onChange={onCountryChange} 
					value={country}>
					<MenuItem value="worldwide">Worldwide</MenuItem>
					{countries.map(country => (
						<MenuItem value={country.value}>{country.name}</MenuItem>
					))
					}
				</Select>
				</FormControl>
			</div>

			<div className="app__stats">
				
				{/* InfoBox Cases*/}
				<InfoBox
					isRed
					active={casesType === "cases"}
					onClick ={(e) => setCasesType('cases')}
					title="Coranavirus Cases" 
					cases={prettyPrintStat(countryInfo.todayCases)} 
					total={prettyPrintStat(countryInfo.cases)}/>

				{/* InfoBox Recoveries*/}
				<InfoBox
					active={casesType === "recovered"} 
					onClick ={(e) => setCasesType('recovered')}
					title="Recovered" 
					cases={prettyPrintStat(countryInfo.todayRecovered)} 
					total={prettyPrintStat(countryInfo.recovered)}/>
				
				{/* InfoBox Deaths*/}
				<InfoBox
					isRed
					active={casesType === "deaths"} 
					onClick={(e) => setCasesType('deaths')}
					title="Deaths" 
					cases={prettyPrintStat(countryInfo.todayDeaths)} 
					total={prettyPrintStat(countryInfo.deaths)}/>
			</div>

			{/* Map */}
			<Map 
				casesType={casesType}
				countries={mapCountries}
				center={mapCenetr}
				zoom={mapZoom}
			/>
			<br></br>
			<br></br>	
      </div>
		<Card className="app__right">
			<CardContent>
				<h3>Live Cases by Country</h3>
				
				{/* Table */}
				<Table countries={tableData} />
				
				{/* Graph */}
				<br></br>
				<br></br>
				<h3 className="app__graphTitle">Worldwide new Cases {casesType}</h3>
				<br></br>
				<br></br>
				<LineGraph 
					className="app__graph"
					casesType={casesType} />
			</CardContent>
		</Card>
	</div>
  );
}

export default App;
