var map;
$(function () {
  proj4.defs("EPSG:5179", "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +units=m +no_defs");
  ol.proj.proj4.register(proj4);
  map = new ol.Map({
    name:"mainMap",
    target: "map",
    layers: [
      new ol.layer.Tile({
        source: new ol.source.XYZ({
          url: "http://xdworld.vworld.kr:8080/2d/midnight/202002/{z}/{x}/{y}.png",
        }),
      })
    ],
    view: new ol.View({
      center: [954190.4014571345, 1952046.5746831195],
      projection:"EPSG:5179", // 배경지도 좌표계 설정
      zoom: 11,
      minZoom: 7,
      maxZoom: 19,
    }),
  });
});//ready


function initMap(layerName){
  //차트 삭제
  map.getOverlays().clear();

  //레이어 삭제
  map.getLayers().forEach(layer => {
    if (layer.get('name') && layer.get('name') != "mainMap"){
      //배경지도 빼고 모두 삭제하기
      map.removeLayer(layer);
    }
  });
}

function moveMap(source){
  map.getView().fit(source.getExtent(), map.getSize());
}

/*
  let options = {
      url : geojson 주소,
      layerName: 레이어명,
      zoneId:옵션
  }
*/
function addZoneLayerWithGeojson(options){
  const style = new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255,255,0,0.2)',
      opacity:0.2
    }),
  });

  var vectorSource = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    loader: function () {
      const url = options.url;//5179
      fetch(url)
        .then((response) => response.json())  
        .then((data) => {

          $(".map-loading-bar").hide();
          const features = vectorSource.getFormat()
                          .readFeatures(data)
                          .filter((f)=>f.getProperties().code.startsWith(options.zoneId));
          // chart 추가
          features.forEach(function(f){
            let coordinate = ol.extent.getCenter(f.getGeometry().getExtent());
            var overlay = new ol.Overlay({
              element: makeMapChart(f),
              positioning:'center-center'//앵커 중앙 위치
            });
            map.addOverlay(overlay);
            overlay.setPosition(coordinate);
          });
          vectorSource.addFeatures(features);
          map.getView().fit(vectorSource.getExtent(), map.getSize());
        });
    }
  });

  var vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: style
  });

  vectorLayer.set("name","zoneLayer");
  map.addLayer(vectorLayer);

  // 선택시 적용될 스타일
  const selectStyle = new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255,0,0,0.2)',
    }),
    stroke: new ol.style.Stroke({
      color: 'rgba(255,255,0,0.2)',
      width: 2,
    }),
  });

  let selected = null;
  let chartPopupElem = null;
  map.on('pointermove', function (e) {
    if (selected !== null) {
      selected.setStyle(undefined);
      selected = null;
      chartPopupElem.removeClass("scale-on");
      chartPopupElem.addClass("scale-off");
    }

    // 마우스 오버시 객체 하이라이팅
    map.forEachFeatureAtPixel(e.pixel, function (f) {
      selected = f;
      let containerID = `container_${f.getProperties().code}`;
      chartPopupElem = $("#"+containerID);
      chartPopupElem.removeClass("scale-off");
      chartPopupElem.addClass("scale-on");
      // selectStyle.getFill().setColor('rgba(255,255,0,0.2');
      
      f.setStyle(selectStyle);
      return true;
    });
  });
}

// 구역별 차트 그리기
function makeMapChart(f){
  let conatainerID = 'container_'+f.getProperties().code;
  let contentID = 'myChart_'+f.getProperties().code;
  let zoneId = f.getProperties().code; 

  // 해당 지역의 모든 연차에 대한 계획 및 집행 예산 산출
  let execut_volumn = global_DashBoard['biz'].filter((b)=>b.instt_code === zoneId)
  .map(d=>d.bsns_budget_excut).reduce((a,b) => a+b,0)/1000000;
  let plan_volumn = global_DashBoard['biz'].filter((b)=>b.instt_code === zoneId)
  .map(d=>d.bsns_budget_plan).reduce((a,b) => a+b,0)/1000000;
  
  let dataset = [
    {'type':'ev','value':execut_volumn,'name':f.getProperties().nm},
    {'type':'pv','value':plan_volumn,'name':f.getProperties().nm},
  ];

  // //차트 초기 생성 옵션
  let options = {
    dataset:dataset,
    domainXY:['type','value','name'],

    //반응형
    MARGIN : {
      TOP:0,
      BOTTOM:0,
      LEFT:0,
      RIGHT:0
    }
  };
  

  
  let container = document.createElement('div');
  let content = document.createElementNS('http://www.w3.org/2000/svg','svg');
      // container.style.border = '1px solid #424242';
      container.style.width = '50px';
      container.style.height = '50px';
      container.setAttribute('id',conatainerID);
      content.setAttribute('id',contentID);
      container.appendChild(content);
      document.body.appendChild(container);
      
  const syd3 = new syD3(contentID,'BAR_OVERLAY',options);
  syd3.create();
  // content.innerHTML = '<span style="color:red;">' + f.getProperties().nm + '</span>';
  return container;
};
