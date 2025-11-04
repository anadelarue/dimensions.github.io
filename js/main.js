/*
* Comenzar el proceso de análisis y visualización cuando el documento esté listo
*/
if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
    initMap();
} else {
    document.addEventListener("DOMContentLoaded", initMap);
}

/* VARIABLES GLOBALES */

let map;

const results = document.querySelectorAll('.main__result');
const dropdowns = document.querySelectorAll('.dropdown__menu--container');

const mobileFiltersBtn = document.querySelector('.mobile__filters--btn');
const mobileFilters = document.querySelector('.mobile__filters');

const resultTexts = document.querySelectorAll('.main__result--text');
const cityLists = document.querySelectorAll('.dropdown__menu');

// Para cada par de menú desplegable
results.forEach((resultBtn, index) => {
    const dropdown = dropdowns[index];
    resultBtn.addEventListener('click', () => {
        dropdown.classList.toggle('hidden');
    });
});

// Botón de filtros móviles
mobileFiltersBtn.addEventListener('click', () => {
    mobileFilters.classList.toggle('hidden');
    mobileFiltersBtn.innerHTML = 
        mobileFiltersBtn.innerHTML === 'Open filters' 
        ? 'Close filters' 
        : 'Open filters';
});

/* ZOOM, MINZOOM Y CENTER EN FUNCIÓN DEL DISPOSITIVO */
let mapWidth = document.getElementById('map').clientWidth;
let zoom = mapWidth > 525 ? 16 : 14;
let minZoom = mapWidth > 525 ? 5.5 : 5;
let maxZoom = 18;
let hoveredStateId = null;

function initMap() {
    //Token de acceso
    const TOKENPREPRODUCCION = 'pk.eyJ1IjoiYW5hZGVsYXJ1ZSIsImEiOiJjbWhpeGdjbTkxNHR0MmxzYzZlOWVjaTh4In0.XqTr1LmMePiWOMvpXJ-WRA'; 
    const TOKENPRODUCCION = 'pk.eyJ1IjoiYW5hZGVsYXJ1ZSIsImEiOiJjazkwYTdqdTQwM2FqM3JycmgwZDd0Y2Y4In0.tXY9uN63f6PkA-KXLKBzpQ';
    mapboxgl.accessToken = TOKENPREPRODUCCION;

    /* Inicio de la configuración del mapa */
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/anadelarue/cmhj6tjcx00c601pjfdp21vee',
        attributionControl: false,
        zoom: zoom,
        minZoom: minZoom,
        maxZoom: maxZoom,
        center: [-3.687490780590369, 40.47732390784789],
        pitch: 60,        // ← inclinación (0–85)
        bearing: -20
    });


    /* Controles en el mapa (https://docs.mapbox.com/mapbox-gl-js/api/markers/) */

    /* Buscador de calles https://docs.mapbox.com/mapbox-gl-js/example/mapbox-gl-geocoder/ */
    map.addControl(
        new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
            language: 'en',
            countries: 'es',
            marker: false,
            placeholder: 'Search your street or town'
        })
    );

    /* Navegación */
    let nav = new mapboxgl.NavigationControl({showCompass:false});
    map.addControl(nav, 'top-right');

    let currentCityObjectArray = [
    {   
        city: 'Madrid',
        coords: [-3.6853731602178286, 40.43821545985204]
    },
    {   
        city: 'Barcelona',
        coords: [2.1664518998805873, 41.38893033844846]
    },
    {   
        city: 'Valencia',
        coords: [-0.3694135172687377, 39.45792122399101]
    },
    {   
        city: 'Sevilla',
        coords: [-5.977891674307028, 37.38314424873644]
    },
    {   
        city: 'Zaragoza',
        coords: [-0.887342499491404, 41.647137577907635]
    },
    {   
        city: 'Málaga',
        coords: [-4.431584628023731, 36.72303674850588]
    },
    {   
        city: 'Murcia',
        coords: [-1.1318286952633863, 37.98703971974235]
    },
    {   
        city: 'Palma',
        coords: [2.647964593821155, 39.576167351380214]
    },
    {   
        city: 'Las Palmas de Gran Canaria',
        coords: [-15.4395312199649, 28.116528035671077]
    },
    {   
        city: 'Alicante',
        coords: [-0.47956225566695304, 38.35770598121282]
    },
    {   
        city: 'Córdoba',
        coords: [-4.778563104744266, 37.889986336318174]
    },
    {   
        city: 'Valladolid',
        coords: [-4.7282065046014, 41.64042297096785]
    },
    {   
        city: 'Vigo',
        coords: [-8.722250301012327, 42.2233561323733]
    },
    {   
        city: 'Hospitalet de Llobregat',
        coords: [2.1119953833258664, 41.359777655096]
    },
    {   
        city: 'Gijón',
        coords: [-5.666480306816674, 43.535597641522976]
    },
    {   
        city: 'La Coruña',
        coords: [-8.412769528659636, 43.36043891237319]
    },
    {   
        city: 'Elche',
        coords: [-0.7007542548517142, 38.266056656297245]
    },
    {   
        city: 'Granada',
        coords: [-3.601314072445702, 37.181834819008884]
    },
    {   
        city: 'Terrassa',
        coords: [2.0215123920079408, 41.56448095047689]
    },
        {   
        city: 'Badalona',
        coords: [2.240573758975145, 41.44762575254535]
    },
    {   
        city: 'Sabadell',
        coords: [2.102681877533322, 41.54729518956485]
    },
    {   
        city: 'Oviedo',
        coords: [-5.847198852053992, 43.362186756921346] 
    },
    {   
        city: 'Cartagena',
        coords: [-0.9963618314158477, 37.625807804355496] 
    },
    {   
        city: 'Móstoles',
        coords: [-3.8657000658607097, 40.32289555109307]
    },

    {   
        city: 'Jerez de la Frontera',
        coords: [-6.124315727523306, 36.68770888473997]
    },

    {   
        city: 'Santa Cruz de Tenerife',
        coords: [-16.26839614417299, 28.45608364417226]
    },

    {   
        city: 'Almería',
        coords: [-2.4479318970675847, 36.848190694621806]
    },    
    {   
        city: 'Alcalá de Henares',
        coords: [-3.365903454474187, 40.49211372616691]
    },
    {   
        city: 'Leganés',
        coords: [-3.7631518789915557, 40.33204431787643] 
    },
    {   
        city: 'Fuenlabrada',
        coords: [-3.8092061613621535, 40.29068804901477]
    },
    {   
        city: 'Getafe',
        coords: [-3.7356892768267658, 40.3084244878206] 
    },
    {   
        city: 'Castellón de la Plana',
        coords: [-0.04699013642458179, 39.9861770820958]
    },
    {   
        city: 'Burgos',
        coords: [-3.6867100013849274, 42.35027927179343] 
    },
    {   
        city: 'Albacete',
        coords: [-1.8595164791718295, 38.9946341227042] 
    },
    {   
        city: 'Santander',
        coords: [-3.8165449417680115, 43.46751190381657]
    },
    {   
        city: 'Alcorcón',
        coords: [-3.8268810527739094, 40.34353534115329]
    },
    {   
        city: 'San Cristóbal de La Laguna',
        coords: [-16.30706768109267, 28.474550412697543] 
    },
    {   
        city: 'Marbella',
        coords: [-4.896927576022978, 36.5160255286582]
    },
    {   
        city: 'Logroño',
        coords: [-2.4487918643237783, 42.46187582904787] 
    },
    {   
        city: 'Badajoz',
        coords: [-6.974889877668474, 38.88171793677364] 
    },
    {   
        city: 'Salamanca',
        coords: [-5.664319483621123, 40.9670031226234] 
    },
    {   
        city: 'Lleida',
        coords: [0.6204927480914896, 41.618181884191664]
    },
    {   
        city: 'Huelva',
        coords: [-6.940677355582867, 37.2672137113718]
    },
    {   
        city: 'Tarragona',
        coords: [1.2438187193769983, 41.12069705438099]
    },
    {   
        city: 'Torrejón de Ardoz',
        coords: [-3.465454379369786, 40.45447434232001] 
    },
    {   
        city: 'Dos Hermanas',
        coords: [-5.927786664588978, 37.28443616302352] 
    },
    {   
        city: 'Parla',
        coords: [-3.767350088242449, 40.23415770891054] 
    },
    {   
        city: 'Mataró',
        coords: [2.4409926516810394, 41.53874290571141] 
    },
    {   
        city: 'Algeciras',
        coords: [-5.456395302695838, 36.1296957052123] 
    },
    {   
        city: 'León',
        coords: [-5.572198829186482, 42.60009925686211] 
    },
    {   
        city: 'Alcobendas',
        coords: [-3.624374895509215, 40.52975507015624] 
    },
    {   
        city: 'Santa Coloma de Gramenet',
        coords: [2.211361737736197, 41.45134094584706]
    },
    {   
        city: 'Jaén',
        coords: [-3.7857929348250727, 37.779347614783966] 
    },
    {   
        city: 'Cádiz',
        coords: [-6.278947917605504, 36.52018030418963]
    },
    {   
        city: 'Reus',
        coords: [1.1061810348685848, 41.38893033844846] 
    },
    {   
        city: 'Roquetas de Mar',
        coords: [-2.611783311342057, 41.38893033844846] 
    },
    {   
        city: 'Girona',
        coords: [2.820126218631122, 41.97578382898892] 
    },
    {   
        city: 'Ourense',
        coords: [-7.864071827807694, 42.3366813237158]
    },
    {   
        city: 'Telde',
        coords: [-15.417962460602041, 27.995063499529522]
    },
    {   
        city: 'Rivas-Vaciamadrid',
        coords: [-3.529377511740835, 40.35097317444909]
    },















    ];

    cityLists.forEach((cityList, index) => {
        cityList.addEventListener('click', (ev) => {
            const currentCityValue = ev.target.innerHTML.trim();
            if (!currentCityValue) return;

            console.log(`Ciudad seleccionada: ${currentCityValue}`);

            const currentCityFind = currentCityObjectArray.find(city => city.city === currentCityValue);
            if (!currentCityFind) {
                console.warn(`⚠️ Ciudad "${currentCityValue}" no encontrada en el array`);
                return;
            }

            const [lon, lat] = currentCityFind.coords;

            // FlyTo
            map.flyTo({
                center: [lon, lat],
                zoom: 12,
                essential: true
            });

            // Actualiza el texto del bloque correspondiente (móvil o escritorio)
            resultTexts[index].innerHTML = currentCityValue;
        });
    });



    //Una vez cargados los datos externos, cargamos el mapa
        map.on('load', function(){
            
            const mapCheckBoxes = document.querySelector('.mapCheckBoxes');

            let layersObject = [
                {
                    id:'antes-40',
                    source: 'antes-40',
                    sourceLayer: '01_antes_1940',
                    visibility: 'visible'
                },                
                {
                    id:'40-60',
                    source: '40-60',
                    sourceLayer: '02_1940_1959',
                    visibility: 'visible'
                },
                {
                    id:'60-80',
                    source: '60-80',
                    sourceLayer: '03_1960_1979',
                    visibility: 'visible'
                },
                {
                    id:'80-00',
                    source: '80-00',
                    sourceLayer: '04_1980_1999',
                    visibility: 'visible'
                },                
                {
                    id:'desde-2000',
                    source: 'desde-2000',
                    sourceLayer: '05_desde_2000',
                    visibility: 'visible'
                }
            ];



            // Añadir fuente de datos al mapa (y otorgarle un nombre para luego usarlo como layer)
            map.addSource('antes-40', {
                'type': 'vector',
                'url': 'mapbox://anadelarue.ctmusbz2'
            });

            map.addSource('40-60', {
                'type': 'vector',
                'url': 'mapbox://anadelarue.dt8goyad'
            });

            map.addSource('60-80', {
                'type': 'vector',
                'url': 'mapbox://anadelarue.a0nlitii'
            });

            map.addSource('80-00', {
                'type': 'vector',
                'url': 'mapbox://anadelarue.9xvpmkz4'
            });

            map.addSource('desde-2000', {
                'type': 'vector',
                'url': 'mapbox://anadelarue.7qy1wlu9'
            });

            layersObject.forEach(layer =>{
                map.addLayer({
                'id': layer.id,
                'source': layer.source,
                'source-layer': layer.sourceLayer,
                'type': 'fill-extrusion',
                'paint': {
                    // Color dinámico según altura
                    'fill-extrusion-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'numberOfFloorsAboveGround'],
                        2, '#DFEFCA',
                        4, '#B1CCA4',
                        7, '#83AA7F',
                        9, '#548759',
                        10, '#266433'
                    ],
                    'fill-extrusion-height': ['*', ['get', 'numberOfFloorsAboveGround'], 2],
                    'fill-extrusion-opacity': 0.9
                    }           
                }, 'road-label');
            });

            const mapCheckBoxesAll = document.querySelectorAll('.mapCheckBoxes');
            console.log(mapCheckBoxesAll);

            mapCheckBoxesAll.forEach(mapCheckBoxes => {
                mapCheckBoxes.addEventListener('click', (ev) => {
                    let currentClassName = ev.target.className;
                    
                    let layerIndex = layersObject.findIndex(object => object.id == currentClassName);
                    if (layerIndex === -1) return;

                    const currentLayer = layersObject[layerIndex];

                    currentLayer.visibility = currentLayer.visibility === 'visible' ? 'none' : 'visible';

                    if (map.getLayer(currentLayer.id)) {
                        map.setLayoutProperty(currentLayer.id, 'visibility', currentLayer.visibility);
                        console.log(`Capa ${currentLayer.id} → ${currentLayer.visibility}`);
                    } else {
                        console.warn(`⚠️ La capa ${currentLayer.id} no está en el mapa aún`);
                    }
                });
            });

            


            
            



            /*map.addLayer({
                'id': 'municipios',
                'source': 'municipios',
                'source-layer': 'municipios_nombre-dfeb7s',
                'type': 'fill',
                'paint': {
                    'fill-color': 'transparent'
                },           
            }, 'road-simple');*/

            // Comunicar al mapa cómo debe funcionar a determinados eventos (https://docs.mapbox.com/mapbox-gl-js/api/handlers/)
            map.scrollZoom.disable();
       
        });

        document.addEventListener('click', function(){
            let currentZoom = map.getZoom();
            console.log(currentZoom);
        })
    
        var tooltip = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });

        map.on('mousemove', function (e) {
          // Check if the zoom level is 13 or greater
          if (map.getZoom() >= 13) {
            var municipiosFeatures = map.queryRenderedFeatures(e.point, { layers: ['municipios'] });
            var edificiosLayers = ['antes-40', '40-60', '60-80', '80-07', 'desde-2008', 'errores', 'eficiencia_pais_vasco']; // Agrega las nuevas capas aquí
            var edificiosFeatures = map.queryRenderedFeatures(e.point, { layers: edificiosLayers });
            // Verificar la presencia de ambas capas
            if (municipiosFeatures.length > 0 && edificiosFeatures.length > 0) {
              var tooltipText = '';
        
              municipiosFeatures.forEach(function (feature) {
                tooltipText += `<p style = 'font-family:Roboto;font-weight:700;font-size:12px;'>${feature.properties.mun} (${feature.properties.prov})</p>`;
                tooltipText += `<hr style = 'opacity: 0.3; border: 1px dashed #000000;'>`;
                // Agregar más propiedades según tus datos
              });
        
              edificiosFeatures.forEach(function (feature) {
                if(feature.properties.cal === undefined || !['residential', 'Residencial'].includes(feature.properties.use)){
                tooltipText += `Sin datos`;} 
                else {
                tooltipText += `<div style="display: flex; align-items: center;margin-bottom:3px;">
                    <p style = 'opacity:0.6;font-weight:600;'>Año de construcción: </p>
                    <p style="margin: 0; margin-left: 2px;font-weight:500;font-size:10px;">${(feature.properties.anno)}</p>
                    </div>`;
                tooltipText += `<p style = 'opacity:0.6;font-weight:600;'>Demanda actual: </p>`;
                tooltipText += `<div style="display: flex; align-items: center;">
                                <span style="background-color: #2C2C2C; padding-right: ${feature.properties.cal * 60 / 270.14}%; color: #fff; padding-top: 7px; display: inline-block; border-radius: 2px;"></span>
                                <p style="margin: 0; margin-left: 5px;font-weight:500;font-size:10px;">${Math.round((feature.properties.cal))} kWh/m²</p>
                                </div>`;
                tooltipText += `<p style = opacity:0.6;font-weight:600;>Demanda tras la reforma: </p>`;
                tooltipText += `<div style="display: flex; align-items: center; margin-bottom:3px;">
                                <span style="background-color: #2C2C2C; padding-right: ${feature.properties.cal_post * 60 / 270.14}%; color: #fff; padding-top: 7px; display: inline-block; border-radius: 2px;"></span>
                                <p style="margin: 0; margin-left: 5px;font-weight:500;font-size:10px;">${Math.round((feature.properties.cal_post))} kWh/m²</p>
                                </div>`;
                tooltipText += `<p style = 'opacity:0.6;font-weight:600;'>Coste estimado </p>`
                tooltipText += `<p style = 'opacity:0.6;font-weight:600;font-style:italic;'>(a precios de 2019): </p>`
                tooltipText += `<p style = "font-weight:500;font-size:10px;">${(feature.properties.cost).toString().replace('.', ',')}€/m²</p>`
                };
              });
              
        
              tooltip.setLngLat(e.lngLat).setHTML(tooltipText).addTo(map);
            } else {
              tooltip.remove(); // Ocultar el tooltip si no están ambas capas presentes
            }
          } else {
            tooltip.remove(); // Ocultar el tooltip si el zoom es menor que 13
          }
        });
        
        map.on('mouseleave', function () {
          tooltip.remove();
        });
 
    
    }