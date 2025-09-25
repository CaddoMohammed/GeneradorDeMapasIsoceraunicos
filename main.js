let locale = {moduleType:"locale",name:"es",dictionary:{Autoscale:"Autoescalar","Box Select":"Seleccionar Caja","Click to enter Colorscale title":"Introducir el t\xedtulo de la Escala de Color","Click to enter Component A title":"Introducir el t\xedtulo del Componente A","Click to enter Component B title":"Introducir el t\xedtulo del Componente B","Click to enter Component accordion title":"Introducir el t\xedtulo del Componente C","Click to enter Plot title":"Introducir el t\xedtulo de la Gr\xe1fica","Click to enter X axis title":"Introducir el t\xedtulo del eje X","Click to enter Y axis title":"Introducir el t\xedtulo del eje Y","Click to enter radial axis title":"Introducir el t\xedtulo del eje radial","Compare data on hover":"Comparar datos al pasar por encima","Double-click on legend to isolate one trace":"Haga doble-clic en la leyenda para aislar una traza","Double-click to zoom back out":"Haga doble-clic para restaurar la escala","Download plot as a png":"Descargar gr\xe1fico como png","Download plot":"Descargar gr\xe1fico","Edit in Chart Studio":"Editar en Chart Studio","IE only supports svg.  Changing format to svg.":"IE solo soporta svg. Cambiando formato a svg.","Lasso Select":"Seleccionar con lazo","Orbital rotation":"Rotaci\xf3n esf\xe9rica",Pan:"Desplazarse","Produced with Plotly.js":"Hecho con Plotly.js",Reset:"Reiniciar",	"Reset axes":"Reiniciar ejes","Reset camera to default":"Restaurar c\xe1mara predeterminada","Reset camera to last save":"Restaurar anterior c\xe1mara","Reset view":"Restaurar vista","Reset views":"Restaurar vistas","Show closest data on hover":"Mostrar el dato m\xe1s cercano al pasar por encima","Snapshot succeeded":"Gr\xe1fico guardado correctamente","Sorry, there was a problem downloading your snapshot!":"\xa1La descarga del gr\xe1fico fall\xf3!","Taking snapshot - this may take a few seconds":"Guardando gr\xe1fico - podr\xeda tardar unos segundos","Toggle Spike Lines":"Mostrar/Ocultar Gu\xedas","Toggle show closest data on hover":"Activar/Desactivar mostrar el dato m\xe1s cercano al pasar por encima","Turntable rotation":"Rotaci\xf3n plana",Zoom:"Modo Ampliar/Reducir","Zoom in":"Ampliar","Zoom out":"Reducir","close:":"cierre:","high:":"alza:","incoming flow count:":"flujo de entrada:","kde:":"edp:","lat:":"lat:","lon:":"lon:","low:":"baja:","lower fence:":"l\xedmite inferior:","max:":"m\xe1x:","mean \xb1 \u03c3:":"media \xb1 \u03c3:","mean:":"media:","median:":"mediana:","min:":"m\xedn:","new text":"nuevo texto","open:":"apertura:","outgoing flow count:":"flujo de salida:","q1:":"q1:","q3:":"q3:","source:":"fuente:","target:":"destino:",trace:"traza","upper fence:":"l\xedmite superior:"},format:{days:["Domingo","Lunes","Martes","Mi\xe9rcoles","Jueves","Viernes","S\xe1bado"],shortDays:["Dom","Lun","Mar","Mi\xe9","Jue","Vie","S\xe1b"],months:["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],shortMonths:["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],date:"%d/%m/%Y",decimal:".",thousands:","}};
const Mapa = [L.map("map",{tap:false,center:[14.084657,-87.165792],zoom:7,minZoom:3,maxZoom:18,zoomControl:false,attributionControl:false}),null];
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`}).addTo(Mapa[0]);	
new L.Control.MiniMap(L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:15}),{toggleDisplay:true,minimized:false}).addTo(Mapa[0]);
new L.Control.Zoom({position:'topleft'}).addTo(Mapa[0]);
Mapa[0].setMaxBounds(L.latLngBounds(L.latLng(90,-180),L.latLng(-90,180)));
L.control.resetView({position:"topleft",title:"Reset view",latlng:L.latLng([14.084657,-87.165792]),zoom:7,}).addTo(Mapa[0]);
L.control.scale().addTo(Mapa[0]);
const Descriptors = [Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value").set,Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value").get];
let Inputs = [{"lat":document.getElementById("lat-max"),"lng":document.getElementById("lng-max")},{"lat":document.getElementById("lat-min"),"lng":document.getElementById("lng-min")}];
let ErrorInputs = [{"lat":document.getElementById("error-lat-max"),"lng":document.getElementById("error-lng-max")},{"lat":document.getElementById("error-lat-min"),"lng":document.getElementById("error-lng-min")}];
let error = [{"lat":false,"lng":false},{"lat":false,"lng":false}];
let timer = null;
let request = indexedDB.open("CaddoMohammed-MapasIsoceraunicos",1);
let db;
request.onupgradeneeded = function(event){
	db = event["target"]["result"];
	if(!db.objectStoreNames.contains("mapas")){
		db.createObjectStore("mapas",{keyPath:"Datos"});
	}
}
request.onsuccess = function(event){
	db = event["target"]["result"];
}
request.onerror = function(event){
	console.error("Error al abrir la base de datos:",event["target"]["error"]);
}
const Servidor = "https://8pf9pjc8-4000.use2.devtunnels.ms";
let resultados,curvasDeNivel;
window.addEventListener("load",() => {
	if(!db){return};
	let tx = db.transaction("mapas","readonly");
	let store = tx.objectStore("mapas");
	let request = store.get("1");
	request.onsuccess = function(){
		if(request["result"]){
			resultados = request["result"]["valor"];
			for(let i=0;i<2;i++){
				for(let j of ["lat","lng"]){
					Inputs[i][j]["value"] = resultados["Coordenadas"][i][j];
				}
			}
			let x = Mapa[0]["LeafletSelectArea"];
			x["Rectangle"] = L.rectangle(resultados["Coordenadas"],{"color":x["color"],"weight":x["weight"]}).addTo(Mapa[0]);
			Mapa[0].fitBounds(resultados["Coordenadas"]);
			x["Status"]["StartPoint"] = resultados["Coordenadas"][0];
			x["Status"]["EndPoint"] = resultados["Coordenadas"][1];
			LeafletSetMarkers(Mapa[0],resultados["Coordenadas"]);
		}
	}
});
document.getElementById("ver-resultados").addEventListener("change",() => Resultados(Number(document.getElementById("ver-resultados").value)));
Object.defineProperty(HTMLInputElement.prototype,"value",{
	set:function(newValue){
		Descriptors[0].call(this,newValue);
		validation(this.id);
	},
	get:function(){
		return Descriptors[1].call(this);
	},
	configurable:true,
	enumerable:true
});
for(let i=0;i<Inputs.length;i++){
	for(let j of ["lat","lng"]){
		Inputs[i][j]["value"] = "";
		Inputs[i][j].addEventListener("input",() => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				validation(Inputs[i][j]["id"]);
				if((error[0]["lat"]===false)&&(error[0]["lng"]===false)&&(error[1]["lat"]===false)&&(error[1]["lng"]===false)){LeafletDrawArea(Mapa[0],Inputs)};
			},500);
		});
	}
}
LeafletSelectArea(Mapa[0],Inputs,{"max area":100});
function validation(x){
	const a = Inputs.findIndex(obj => Object.values(obj).some(input => input["id"]===x));
	if(a===-1){return};
	const b = Object.entries(Inputs[a]).find(([k,input]) => input["id"]===x)[0];
	const Max={"lat":90,"lng":180},Name={"lat":"latitud","lng":"longitud"};
	if(isNaN(Inputs[a][b]["value"])){
		Inputs[a][b]["className"] = "block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none dark:text-white dark:border-red-500 border-red-600 dark:focus:border-red-500 focus:outline-none focus:ring-0 focus:border-red-600 peer";
		ErrorInputs[a][b]["innerHTML"] = "Solamente números";
		error[a][b] = true;
		return;
	} else {
		error[a][b] = false;
	}
	if(Math.abs(Inputs[a][b]["value"])>Max[b]){
		Inputs[a][b]["className"] = "block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none dark:text-white dark:border-red-500 border-red-600 dark:focus:border-red-500 focus:outline-none focus:ring-0 focus:border-red-600 peer";
		ErrorInputs[a][b]["innerHTML"] = `La ${Name[b]} debe ser solo desde -${Max[b]}° hasta ${Max[b]}°`;
		error[a][b] = true;
		return;
	} else {
		error[a][b] = false;
	}
	Inputs[a][b]["className"] = "block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer";
	ErrorInputs[a][b].innerHTML = "";
	if(Inputs[a][b]["value"].trim()===""){error[a][b]=true;return};
	if((error[0]["lat"]===false)&&(error[0]["lng"]===false)&&(error[1]["lat"]===false)&&(error[1]["lng"]===false)){InputsName()};
}
function InputsName(){
	let a = [0,0];
	let x=document.getElementById("corner-1"),y=document.getElementById("corner-2");
	if(Inputs[0]["lat"]["value"]>Inputs[1]["lat"]["value"]){a[0]=1};
	if(Inputs[0]["lng"]["value"]>Inputs[1]["lng"]["value"]){a[1]=1};
	if((a[0]===1)&&(a[1]===1)){
		x["innerHTML"] = "Coordenadas de la esquina noroeste";
		y["innerHTML"] = "Coordenadas de la esquina sureste";
	}
	if((a[0]===0)&&(a[1]===1)){
		x["innerHTML"] = "Coordenadas de la esquina suroeste";
		y["innerHTML"] = "Coordenadas de la esquina noreste";
	}
	if((a[0]===1)&&(a[1]===0)){
		x["innerHTML"] = "Coordenadas de la esquina noreste";
		y["innerHTML"] = "Coordenadas de la esquina suroeste";
	}
	if((a[0]===0)&&(a[1]===0)){
		x["innerHTML"] = "Coordenadas de la esquina sureste";
		y["innerHTML"] = "Coordenadas de la esquina noroeste";
	}
}
function Mostrar(){
	let a = document.getElementById("home");
	let b = document.getElementById("resultados");
	if(a.classList.contains("flex")){
		a.classList.add("hidden");
		a.classList.remove("flex");
		b.classList.remove("hidden");
		b.classList.add("flex");
	} else {
		a.classList.remove("hidden");
		a.classList.add("flex");
		b.classList.add("hidden");
		b.classList.remove("flex");
	}
}
function calcular(){
	let base = Number(Inputs[0]["lng"]["value"])-Number(Inputs[1]["lng"]["value"]);
	let altura = Number(Inputs[0]["lat"]["value"])-Number(Inputs[1]["lat"]["value"]);
	if(Math.abs(base*altura)>100){
		return;
	}
	if(resultados){
		let a = L.latLngBounds([{"lat":Number(Inputs[0]["lat"]["value"]),"lng":Number(Inputs[0]["lng"]["value"])},{"lat":Number(Inputs[1]["lat"]["value"]),"lng":Number(Inputs[1]["lng"]["value"])}]);
		let b = L.latLngBounds(resultados["Coordenadas"]);
		if(a.equals(b)){
			Mostrar();
			Resultados(0);
			return;
		}
	}
	let z = {"min":{"lat":Math.min(Inputs[0]["lat"]["value"],Inputs[1]["lat"]["value"]),"lng":Math.min(Inputs[0]["lng"]["value"],Inputs[1]["lng"]["value"])},"max":{"lat":Math.max(Inputs[0]["lat"]["value"],Inputs[1]["lat"]["value"]),"lng":Math.max(Inputs[0]["lng"]["value"],Inputs[1]["lng"]["value"])}};
	let btn = document.getElementById("btn-calcular");
	let label = document.getElementById("label-calcular");
	let spinner = document.getElementById("spinner-calcular");
	btn["disabled"] = true;
	btn["classList"].add("bg-blue-400","dark:bg-blue-500","cursor-not-allowed");
	label["innerHTML"] = "Cargando...";
	spinner["classList"].remove("hidden");
	fetch(`${Servidor}/generar-mapa-isoceraunico`,{method:"POST",headers:{"Content-Type":"application/json",},body:JSON.stringify(z)})
	.then(u => {
		btn["disabled"] = false;
		btn["classList"].remove("bg-blue-400","dark:bg-blue-500","cursor-not-allowed");
		label["innerHTML"] = "Calcular";
		spinner["classList"].add("hidden");
		return u.json();
	})
	.then(v => {
		Mostrar();
		resultados = v;
		let tx = db.transaction("mapas","readwrite");
		let store = tx.objectStore("mapas");
		store.put({"Datos":"1",valor:v});
		Resultados(0);
	})
	.catch(k => console.error(k));
}
function Resultados(x){
	document.getElementById("ver-resultados").value = x;
	for(let i=0;i<3;i++){
		if(x===i){
			document.getElementById(`ver-resultados-${i}`).className = "text-blue-600 bg-gray-100 dark:bg-gray-800 dark:text-blue-500 inline-block p-4 rounded-t-lg";
		} else {
			document.getElementById(`ver-resultados-${i}`).className = "inline-block p-4 rounded-t-lg hover:text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-blue-500";
		}
	}
	if(x!=2){
		document.getElementById("modelos").classList.remove("flex");
		document.getElementById("modelos").classList.add("hidden");
		document.getElementById("mapas").classList.add("flex");
		document.getElementById("mapas").classList.remove("hidden");
		let y,z;
		if(Mapa[1]){Mapa[1].remove()};
		Mapa[1] = L.map("Mapas",{tap:false,attributionControl:false});
		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`}).addTo(Mapa[1]);	
		Mapa[1].fitBounds([{"lat":Inputs[0]["lat"]["value"],"lng":Inputs[0]["lng"]["value"]},{"lat":Inputs[1]["lat"]["value"],"lng":Inputs[1]["lng"]["value"]}],{padding:[0,0]});
		if(!resultados["Mapas"]["seleccionado"]){resultados["Mapas"]["seleccionado"]=13};
		if(x===0){
			if(resultados["Mapas"]["seleccionado"]>14){
				resultados["Mapas"]["seleccionado"] = 13;
			}
			y = {xaxis:{showgrid:true,zeroline:true,showline:true,mirror:"ticks",gridcolor:"#bdbdbd",gridwidth:1,zerolinecolor:"#969696",zerolinewidth:1,linecolor:"#636363",linewidth:1,tickmode:"auto",dtick:0.1,ticklen:10,minor:{ticklen:5,nticks:10,},mirror:true,rangemode:"tozero"},yaxis:{title:`Horas de tormenta por mes`,showgrid:true,zeroline:true,showline:true,mirror:"ticks",gridcolor:"#bdbdbd",gridwidth:1,zerolinecolor:"#969696",zerolinewidth:1,linecolor:"#636363",linewidth:1,tickmode:"auto",dtick:0.1,ticklen:10,minor:{ticks:"outside",ticklen:5,nticks:15,},mirror:true,rangemode:"tozero"},showlegend:false,dragmode:false,scrollZoom:false,margin:{autoexpand:false,b:60,l:60,r:5,t:35}};
			z = {displaylogo:false,toImageButtonOptions:{format:"png",filename:"Horas de tormenta por mes",height:1080,width:1300,scale:1},modeBarButtonsToRemove:["autoScale2d","lasso2d","select2d","zoom2d"],displayModeBar:true,showAxisRangeEntryBoxes:false,showAxisDragHandles:false,showAxisRangeEntryBoxes:false,responsive:true,doubleClickDelay:10};
			document.getElementById("title-barplot").innerHTML = "Promedio de horas de tormenta por mes";
			document.getElementById("unidades").innerHTML = `Unidades en <a href="https://data.nasa.gov/dataset/world-wide-lightning-location-network-wwlln-monthly-thunder-hour-data" class="">horas de tormenta por mes</a>`;
		} else {
			if(resultados["Mapas"]["seleccionado"]<14){
				resultados["Mapas"]["seleccionado"] = 26;
			}
			y = {xaxis:{showgrid:true,zeroline:true,showline:true,mirror:"ticks",gridcolor:"#bdbdbd",gridwidth:1,zerolinecolor:"#969696",zerolinewidth:1,linecolor:"#636363",linewidth:1,tickmode:"auto",dtick:0.1,ticklen:10,minor:{ticklen:5,nticks:10,},mirror:true,rangemode:"tozero"},yaxis:{title:`Densidad de rayos por km<sup>2</sup>`,showgrid:true,zeroline:true,showline:true,mirror:"ticks",gridcolor:"#bdbdbd",gridwidth:1,zerolinecolor:"#969696",zerolinewidth:1,linecolor:"#636363",linewidth:1,tickmode:"auto",dtick:0.1,ticklen:10,minor:{ticks:"outside",ticklen:5,nticks:15,},mirror:true,rangemode:"tozero"},showlegend:false,dragmode:false,scrollZoom:false,margin:{autoexpand:false,b:60,l:60,r:5,t:35}};
			z = {displaylogo:false,toImageButtonOptions:{format:"png",filename:"Densidad de rayos por km cuadrado",height:1080,width:1300,scale:1},modeBarButtonsToRemove:["autoScale2d","lasso2d","select2d","zoom2d"],displayModeBar:true,showAxisRangeEntryBoxes:false,showAxisDragHandles:false,showAxisRangeEntryBoxes:false,responsive:true,doubleClickDelay:10}
			document.getElementById("title-barplot").innerHTML = "Promedio de densidad de rayos por km<sup>2</sup> por mes";
		}
		Mapas(0);
		Plotly.newPlot("bar-plot",[resultados["Bar plots"][x]],y,z);
	} else {
		document.getElementById("modelos").classList.remove("hidden");
		document.getElementById("modelos").classList.add("flex");
		document.getElementById("mapas").classList.remove("flex");
		document.getElementById("mapas").classList.add("hidden");
		let y = resultados["Datos"]["Modelos"];
		let a = 0;
		for(let i in y){
			if(a<y[i]["r2"]){
				resultados["select"] = i;
				a = y[i]["r2"];
			}
			document.getElementById(`${i}-r2`).innerHTML = y[i]["r2"];
		}
		document.getElementById("correlacion").innerHTML = resultados["Datos"]["Correlacion"].toLocaleString('en-US',{style:"decimal",maximunFractionDigits:5});
		document.getElementById("modelo-optimo").innerHTML = `modelo ${resultados["select"]}`;
		Modelo();
	}
}
function Modelo(x){
	let y = ["Exponencial","Lineal","Logaritmico","Potencial"];
	let a = y.indexOf(resultados["select"]);
	if(x===false){
		if(a==0){
			a = 3;
		} else {
			a = a-1;
		}
	}
	if(x===true){
		if(a==3){
			a = 0;
		} else {
			a = a+1;
		}
	}
	resultados["select"] = y[a];
	let u = {xaxis:{title:{text:`Horas de tormenta por mes`},showgrid:true,zeroline:true,showline:true,mirror:"ticks",gridcolor:"#bdbdbd",gridwidth:1,zerolinecolor:"#969696",zerolinewidth:1,linecolor:"#636363",linewidth:1,tickmode:"auto",dtick:0.1,ticklen:10,minor:{ticklen:5,nticks:10,},mirror:true,rangemode:"tozero"},yaxis:{title:{text:`Densidad de rayos por km<sup>2</sup> por mes`},showgrid:true,zeroline:true,showline:true,mirror:"ticks",gridcolor:"#bdbdbd",gridwidth:1,zerolinecolor:"#969696",zerolinewidth:1,linecolor:"#636363",linewidth:1,tickmode:"auto",dtick:0.1,ticklen:10,minor:{ticks:"outside",ticklen:5,nticks:15,},mirror:true,rangemode:"tozero"},showlegend:false,dragmode:false,scrollZoom:false,margin:{autoexpand:false,b:60,l:70,r:5,t:35}};
	let v = {displaylogo:false,toImageButtonOptions:{format:"png",filename:`Modelo ${y[a]}`,height:1080,width:1300,scale:1},modeBarButtonsToRemove:["autoScale2d","lasso2d","select2d","zoom2d"],displayModeBar:true,showAxisRangeEntryBoxes:false,showAxisDragHandles:false,showAxisRangeEntryBoxes:false,responsive:true,doubleClickDelay:10};
	Ecuacion(resultados["select"]);
	Ecuacion(y[a]);
	Plotly.newPlot("grafico",[resultados["Datos"]["Puntos"],resultados["Datos"]["Modelos"][y[a]]],u,v);
}
function Ecuacion(x){
	let a = "";
	let b = "";
	let c = resultados["Datos"]["Modelos"];
	let d = [0,0];
	for(let i=0;i<2;i++){
		if(c[x]["parametros"][i]<1){
			d[i] = c[x]["parametros"][i].toExponential(4);
		} else {
			d[i] = c[x]["parametros"][i].toLocaleString('en-US',{style:"decimal",maximunFractionDigits:5});
		}
	}
	for(let i of ["parametros","errores_std","t"]){
		for(let j=0;j<2;j++){
			document.getElementById(`${i}-${j}`).innerHTML = c[x][i][j];
		}
	}
	switch(x){
		case "Exponencial":
			a = "Modelo Exponencial";
			b = `N<sub>d</sub> = ${d[0]} Exp(${d[1]==1?"":d[1]+" "}T<sub>h</sub>)`;
			break;
		case "Lineal":
			a = "Modelo Lineal";
			b = `N<sub>d</sub> = ${d[0]} T<sub>h</sub> ${d[1]<0?"":"+"} ${d[1]}`;
			break;
		case "Logaritmico":
			a = "Modelo Logarítmico";
			b = `N<sub>d</sub> = ${d[0]} Ln(T<sub>h</sub> ${d[1]<0?"":"+"} ${d[1]})`;
			break;
		case "Potencial":
			a = "Modelo Potencial";
			b = `N<sub>d</sub> = ${d[0]} T<sub>h</sub> <sup>${d[1]}</sup>`;
			break;
	}
	document.getElementById("title-modelo").innerHTML = a;
	document.getElementById("ecuacion-modelo").innerHTML = b;
}
function Mapas(x){
	let a="",b=0,c="";
	b = resultados["Mapas"]["seleccionado"];
	if(resultados["Mapas"]["seleccionado"]<14){
		a = "WWLLN";
		if(x===true){
			if(b===13){
				b = 1;
			} else {
				b = b+1;
			}
		}
		if(x===false){
			if(b===1){
				b = 13;
			} else {
				b = b-1;
			}
		}
		resultados["Mapas"]["seleccionado"] = b;
	} else {
		a = "WGLC";
		if(x===true){
			if(b===26){
				b = 14;
			} else {
				b = b+1;
			}
		}
		if(x===false){
			if(b===14){
				b = 26;
			} else {
				b = b-1;
			}
		}
		resultados["Mapas"]["seleccionado"] = b;
		b = b-13;
	}
	switch(resultados["Mapas"]["seleccionado"]){
		case 1:
			c = "Mapa Isoceráunico para el mes de enero";
			break;
		case 2:
			c = "Mapa Isoceráunico para el mes de febrero";
			break;
		case 3:
			c = "Mapa Isoceráunico para el mes de marzo";
			break;
		case 4:
			c = "Mapa Isoceráunico para el mes de abril";
			break;
		case 5:
			c = "Mapa Isoceráunico para el mes de mayo";
			break;
		case 6:
			c = "Mapa Isoceráunico para el mes de junio";
			break;
		case 7:
			c = "Mapa Isoceráunico para el mes de julio";
			break;
		case 8:
			c = "Mapa Isoceráunico para el mes de agosto";
			break;
		case 9:
			c = "Mapa Isoceráunico para el mes de septiembre";
			break;
		case 10:
			c = "Mapa Isoceráunico para el mes de octubre";
			break;
		case 11:
			c = "Mapa Isoceráunico para el mes de noviembre";
			break;
		case 12:
			c = "Mapa Isoceráunico para el mes de diciembre";
			break;
		case 13:
			c = `Mapa Isoceráunico para el promedio de 2013 a ${2012+resultados["Bar plots"][0]["Total de registros"]}`;
			break;
		case 14:
			c = "Mapa de densidad de rayos por km<sup>2</sup> para el mes de enero";
			break;
		case 15:
			c = "Mapa de densidad de rayos por km<sup>2</sup> para el mes de febrero";
			break;
		case 16:
			c = "Mapa de densidad de rayos por km<sup>2</sup> para el mes de marzo";
			break;
		case 17:
			c = "Mapa de densidad de rayos por km<sup>2</sup> para el mes de abril";
			break;
		case 18:
			c = "Mapa de densidad de rayos por km<sup>2</sup> para el mes de mayo";
			break;
		case 19:
			c = "Mapa de densidad de rayos por km<sup>2</sup> para el mes de junio";
			break;
		case 20:
			c = "Mapa de densidad de rayos por km<sup>2</sup> para el mes de julio";
			break;
		case 21:
			c = "Mapa de densidad de rayos por km<sup>2</sup> para el mes de agosto";
			break;
		case 22:
			c = "Mapa de densidad de rayos por km<sup>2</sup> para el mes de septiembre";
			break;
		case 23:
			c = "Mapa de densidad de rayos por km<sup>2</sup> para el mes de octubre";
			break;
		case 24:
			c = "Mapa de densidad de rayos por km<sup>2</sup> para el mes de noviembre";
			break;
		case 25:
			c = "Mapa de densidad de rayos por km<sup>2</sup> para el mes de diciembre";
			break;
		case 26:
			c = `Mapa de densidad de rayos por km<sup>2</sup> para el promedio de 2010 a ${2009+resultados["Bar plots"][1]["Total de registros"]}`;
			break;
	}
	if(curvasDeNivel){Mapa[1].removeLayer(curvasDeNivel)};
	document.getElementById("title-mapa").innerHTML = c;
	curvasDeNivel = L.geoJSON(resultados["Mapas"][a][b],{
		style:function(feature){
			return {color:"#000000",fillColor:feature["properties"]["fill"],weight:feature["properties"]["stroke-width"],fillOpacity:feature["properties"]["fill-opacity"]}
		},
		onEachFeature:function(feature,layer){
			layer.bindTooltip(feature["properties"]["level"].toString(),{
				permanent:false,
				direction:"top",
				sticky:true
			});
			layer.on("mouseover",function(){layer.openTooltip()});
			layer.on("mouseout",function(){layer.closeTooltip()});
		}
	}).addTo(Mapa[1]);
	L.geoJSON(Limites,{style:{color:"#000000",weight:3,fillOpacity:0},interactive:false}).addTo(Mapa[1]);
}
function Exportar(){
	let btn = document.getElementById("btn-exportar");
	let label = document.getElementById("label-exportar");
	let spinner = document.getElementById("spinner-exportar");
	btn["disabled"] = true;
	btn["classList"].add("bg-blue-400","dark:bg-blue-500","cursor-not-allowed");
	spinner.classList.remove("hidden");
	label["innerHTML"] = "Cargando...";
	fetch(`${Servidor}/exportar-resultados`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(resultados)})
	.then(a => {
		btn["disabled"] = false;
		btn["classList"].remove("bg-blue-400","dark:bg-blue-500","cursor-not-allowed");
		label["innerHTML"] = "Exportar resultados en PDF";
		spinner["classList"].add("hidden");
		if(!a["ok"]){
			throw new Error("Error al descargar el PDF");
		}
		return a.blob();
	})
	.then(x => {
		const a = window.URL.createObjectURL(x);
		const b = document.createElement("a");
		b["href"] = a;
		b["download"] = "Reporte.pdf";
		b["style"]["display"] = "none";
		b.click();
		window.URL.revokeObjectURL(a);
	})
	.catch(q => {console.error(q)});
}