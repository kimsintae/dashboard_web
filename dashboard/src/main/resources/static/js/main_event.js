$(function() {

    var data = [
        {x: "국가사업", value: 80},
        {x: "gis", value: 56},
        {x: "기본계획", value: 44},
        {x: "실행예산", value: 40},
        {x: "국토부", value: 36},
        {x: "성공사례", value: 32},
        {x: "실패", value: 56},
        {x: "집행수", value: 89}
    ];
    
    // create a chart and set the data
    chart = anychart.tagCloud(data);
    
    // set the container id
    chart.container("wordCloud");
    var customColorScale = anychart.scales.linearColor();
    customColorScale.colors(["#ffcc00", "#00ccff"]);
    // set the color scale as the color scale of the chart
    chart.colorScale(customColorScale);
    // add and configure a color range
    chart.colorRange().enabled(true);
    chart.colorRange().length("90%");
    
    // initiate drawing the chart
    chart.draw();
    
    // create data
    var data = [
        {x: "A", value: 637166},
        {x: "B", value: 721630},
        {x: "C", value: 148662},
        {x: "D", value: 78662},
        {x: "E", value: 90000}
    ];
    
    // create a chart and set the data
    chart = anychart.pie(data);
    chart2 = anychart.pie(data);
    chart3 = anychart.pie(data);
    
    /*
     테스트 차트
    */
    let dataset = [
        {'year':2010,'value':100},
        {'year':2011,'value':50},
        {'year':2012,'value':80},
        {'year':2013,'value':51},
        {'year':2014,'value':40}
      ];
    
      let dataset2 = [
        {'year':2010,'value':76},
        {'year':2011,'value':100},
        {'year':2012,'value':55},
        {'year':2013,'value':30},
        {'year':2014,'value':100}
      ];
    
      let dataset3 = [
        {'year':2010,'value':50},
        {'year':2011,'value':5},
        {'year':2012,'value':35},
        {'year':2013,'value':41},
        {'year':2014,'value':100},
        {'year':2015,'value':41},
        {'year':2016,'value':5},
        {'year':2017,'value':18}
      ];
    
      //차트 초기 생성 옵션
      let options = {
        dataset:dataset,//data
        domainXY:['year','value'],//column 설정
        style:{//style 적용 가능
            fill : function(d,i){
                let color = "";
                switch (d.year) {
                    case 2010:
                        color = "rgba(255,255,0,0.5)";
                        break;
                    case 2011:
                        color = "rgba(100,123,0,0.5)";
                        break;
                    case 2012:
                        color = "rgba(100,200,50,0.5)";
                        break;
                    case 2013:
                        color = "rgba(69,25,21,0.5)";
                        break;
                    case 2014:
                        color = "rgba(10,125,21,0.5)";
                        break;
                    case 2015:
                        color = "rgba(251,211,88,0.5)";
                        break;
                    default:
                        break;
                }
                return color;
            },
            stroke : {
                color : function(d,i){
                    return "skyblue"
                },
                width : 1.5
            }
        },
        SUB_LINE :{//보조지표 넣기( 타입이 BAR일 경우만 해당)
            show:true,
            dataset:dataset2
        }
      };
    
    

    
      let options3 = {
        dataset:[
            {'year':'A','value':60},
            {'year':'B','value':11},
            {'year':'C','value':31},
            {'year':'D','value':41},
            {'year':'E','value':50}
        ],//data
        domainXY:['year','value'],//column 설정
        style:{//style 적용 가능
            fill : function(d,i){
              return "none"
            },
            stroke : {
                color : function(d,i){
                    return "skyblue"
                },
                width : 2.5
            },
            line:'curveMonotoneX'//line
        }
      };
    
      let options4 = {
        dataset:[
            {'year':'A','value':40},
            {'year':'B','value':72},
            {'year':'C','value':33},
            {'year':'D','value':54},
            {'year':'E','value':70}
        ],//data
        domainXY:['year','value'],//column 설정
        style:{//style 적용 가능
            fill : function(d,i){
              return "none"
            },
            stroke : {
                color : function(d,i){
                    return "skyblue"
                },
                width : 2.5
            },
            line:'curveMonotoneX'//line
        }
      };
    
      let options5 = {
        dataset:[
            {'year':'A','value':60},
            {'year':'B','value':22},
            {'year':'C','value':21},
            {'year':'D','value':74},
            {'year':'E','value':100}
        ],//data
        domainXY:['year','value'],//column 설정
        style:{//style 적용 가능
            fill : function(d,i){
              return "none"
            },
            stroke : {
                color : function(d,i){
                    return "skyblue"
                },
                width : 2.5
            },
            line:'curveMonotoneX'//line
        }
      };
      //const syd2 = new syD3('lineChart1','bar',options);
     
      const pie1 = new syD3('pieChart1','pie',options3);
      const pie2 = new syD3('pieChart2','pie',options4);
      const pie3 = new syD3('pieChart3','pie',options5);
      //syd2.create();

      pie1.create();
      pie2.create();
      pie3.create();
        
      //방사형 옵션
      let radarOption = {
        dataset:{
            main : [
                {'key':'A','value':Math.round((options3['dataset'][0].value+options4['dataset'][0].value+options5['dataset'][0].value)/3)},
                {'key':'B','value':Math.round((options3['dataset'][1].value+options4['dataset'][1].value+options5['dataset'][1].value)/3)},
                {'key':'C','value':Math.round((options3['dataset'][2].value+options4['dataset'][2].value+options5['dataset'][2].value)/3)},
                {'key':'D','value':Math.round((options3['dataset'][3].value+options4['dataset'][3].value+options5['dataset'][3].value)/3)},
                {'key':'E','value':Math.round((options3['dataset'][4].value+options4['dataset'][4].value+options5['dataset'][4].value)/3)}
              ],
            sub : [
                {'key':'A','value':50},
                {'key':'B','value':40},
                {'key':'C','value':70},
                {'key':'D','value':100},
                {'key':'E','value':80}
              ]
        },
        domainXY:['key','value'],
        style:{
            fill : function(d,i){
              return "none"
            },
            stroke : {
                color : function(d,i){
                    return "skyblue"
                },
                width : 2.5
            }
        },
      };
    var data = [
        ["January", 10000],
        ["February", 12000],
        ["March", 18000],
        ["April", 11000],
        ["May", 9000]
    ];

    const radar = new syD3('radarChart','radar',radarOption);
    radar.create();
    //방사형 기능
    $('body').on('click','.radar-btn',function(e){
        let $value = $(this).siblings('input');
        let type = $(this).data('type');
        let key = $(this).siblings('span').data('key')
        let realVal = 0;
        switch (type) {
            case 'plus':
                realVal = Number($value.val())+1;
                break;
            case 'minus':
                realVal = Number($value.val())-1;      
                break;
        }
        if(realVal<=100 && realVal>=0){
            $value.val(realVal);
            radarOption['dataset']['main'].filter(d => d.key === key)[0].value = realVal;
        }

        //값 변경
        radar.update(radar,radarOption['dataset']);
    });
});

let global_DashBoard = new Object();
let init_DashBoard = (function(window) {
    
    // 기준연도 가져오기
    let palnCodeParams = {
        'url': 'http://dev.syesd.co.kr:14000/basis',
		'data': '',
		'dataType': 'json'
    };
    let palnCodeSuccess = function(result) {
        global_DashBoard.planCode = result;
            let planHtmls = '';
            for(i=0; i<global_DashBoard.planCode.length; i++){
                planHtmls += '<option value="'+global_DashBoard.planCode[i].plan_no+'">'+(global_DashBoard.planCode[i].plan_no+1)+'차</option>'
            }
            $('#planType').html(planHtmls);
            //기준연도 선택 이벤트
            $('#planType').change(function(){
                let = yearHtmls = '';
                for(i=0; i<global_DashBoard.planCode.length; i++){
                    if(global_DashBoard.planCode[i].plan_no == $(this).val()){
                        for(j=parseInt(global_DashBoard.planCode[i].plan_begin_year); j<parseInt(global_DashBoard.planCode[i].plan_end_year)+1; j++){
                            yearHtmls += '<option value="'+j+'">'+j+'</option>';
                        }
                    }
                }
                $('#planBeginYear').html(yearHtmls);
                $('#planEndYear').html(yearHtmls);
                $("#planEndYear option:last").prop("selected", true);
            });  
            $('#planType').change();
    };
    DS_AJAX_GET(palnCodeParams,palnCodeSuccess);
    // 사업유형 가져오기
    let bsnsTypeParams = {
        'url': 'http://dev.syesd.co.kr:14000/codes/BSNS_TY',
        'data': '',
        'dataType': 'json'
    };
    let bsnsTypeSuccess = function(result) {
        global_DashBoard.bsnsType = result;
            let planHtmls = '<option value="">전체</option>';
            for(i=0; i<global_DashBoard.bsnsType.length; i++){
                planHtmls += '<option value="'+global_DashBoard.bsnsType[i].code+'">'+global_DashBoard.bsnsType[i].nm+'</option>'
            }
            $('#bsnsType').html(planHtmls); 
    };
    DS_AJAX_GET(bsnsTypeParams,bsnsTypeSuccess);
    // 중앙부처
    let insttTypeParams = {
        'url': 'http://dev.syesd.co.kr:14000/codes/INSTT',
        'data': '',
        'dataType': 'json'
    };
    let insttTypeSuccess = function(result) {
        global_DashBoard.insttType = result;
            let insttHtmls = '<option value="">전체</option>';
            for(i=0; i<global_DashBoard.insttType.length; i++){
                insttHtmls += '<option value="'+global_DashBoard.insttType[i].code+'">'+global_DashBoard.insttType[i].nm+'</option>'
            }
            $('#insttType').html(insttHtmls); 
    };
    DS_AJAX_GET(insttTypeParams,insttTypeSuccess);

    // 초기 대구 표출
    $('#zoneType').val(27).change();
    
    
});
init_DashBoard();
function objGroupByName(xs, key){
    return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
}
let toolModal = new bootstrap.Modal(document.getElementById('exampleModalLg'), {
    keyboard: false
})
$('body').on('click','.top-tooltip-icon',function(e){
    if($(this).data("value")=="info"){
        $('#topToolTipBody').html(
            "대시보드 기획의도 설명"
        );
    }else{
        $('#topToolTipBody').html(
            "데이터 출처"
        );
    }
    toolModal.toggle();
});
// initiate drawing the chart
// chart.draw();

        // create a line series and set the data
        

        // let dataset = null;
        // let myChart = null;
        
        // //creating bat chart
        // d3.csv("example.csv").then(function (data) {
        //     dataset = new Array();                                     
        //     let dataYear = d3.rollup(data, d => d3.sum(d,v => v.value), c => c.year, b => 
        //                              b.industry_code_ANZSIC).get("2011");
        //     dataYear.forEach((v,k)=>{
        //             dataset.push({'grade':k,'value':v});   
        //     });
        //     dataset.pop();
        //     //차트 초기 생성 옵션
        //     let options = {
        //         dataset:dataset,
        //         domainXY:['grade','value'],
        //         MARGIN : {
        //             TOP:0,
        //             BOTTOM:30,
        //             LEFT:80,
        //             RIGHT:50
        //         }
        //     };
        //     //차트 객체 생성 ( return svg 반환 )
        //     const syd3 = new syD3('myChart','bar',options);
        //     const barContainer = syd3.create();
        //     const svg = barContainer.getSvg();

        //     //실제 차트 svg 객체 반환
        //     // let myChart = chartHandler.create();

        //     //차트 구현
        //     //차트 객체에서 scale 획득 가능
        //     const xScale = barContainer.getXscale();
        //     const yScale = barContainer.getYscale();

        //     // svg 객체를 반환하면
        //     // x축과 y축을 컨트롤 할 수 잇음 ( class 명 : yAxis , xAxis);
        //     // svg.selectAll('.yAxis')
        //     // .call(d3.axisLeft(yScale).ticks(10))
        //     // .style("font-size","10px");

        //     // svg.selectAll('.xAxis')
        //     // .call(d3.axisBottom(xScale));
        //     d3.select("#myChartBtn").on('click',function(){
        //         dataset = new Array();                                  
        //         let dataYear = d3.rollup(data, d => d3.sum(d,v => v.value), c => c.year, b => 
        //                                 b.industry_code_ANZSIC).get(String(2000+(Math.floor(Math.random() * 10)+10)));
        //         dataYear.forEach((v,k)=>{
        //             // if(Checked.indexOf(k) >= 0){
        //                 dataset.push({'grade':k,'value':v});   
        //             // }
        //         });
        //         dataset.pop();

        //         //차트 업데이트
        //         syd3.update(syd3,dataset);
        //     });
        // });

        // // //creating bat chart
        // d3.csv("example2.csv").then(function (data) {
        //     dataset = new Array();    
        //     data.forEach((v,k)=>{
        //         dataset.push({'year':v.year,'value':Number(v.value)});   
        //     });
        //     let options = {
        //         dataset:dataset,
        //         domainXY:['year','value'],
        //         MARGIN : {
        //             TOP:0,
        //             BOTTOM:30,
        //             LEFT:80,
        //             RIGHT:50
        //         }
        //     };
        //     //차트 객체 생성 ( return svg 반환 )
        //     new syD3('myChart2','bar',options).create();
        // });

        // d3.csv("example2.csv").then(function (data) {
        //     dataset = new Array();   
        //     data.forEach((v,k)=>{
        //         dataset.push({'year':v.year,'value':Number(v.value)});   
        //     });
            
        //     const syd3 = new syD3('myChart3','line',{
        //         dataset:dataset,
        //         domainXY:['year','value'],
        //         MARGIN : {
        //             TOP:0,
        //             BOTTOM:30,
        //             LEFT:80,
        //             RIGHT:50
        //         }
        //     });
        //     syd3.create();

        //     d3.select("#myChart3Btn").on('click',function(){
        //         dataset = [
        //                     {'year':2010,'value':80},
        //                     {'year':2011,'value':15},
        //                     {'year':2012,'value':22},
        //                     {'year':2013,'value':43},
        //                     {'year':2014,'value':65},
        //                     {'year':2015,'value':82},
        //                     {'year':2016,'value':89},
        //                     {'year':2017,'value':90},
        //                     {'year':2018,'value':23},
        //                     {'year':2019,'value':65},
        //                     {'year':2020,'value':42}
        //                 ];
        //             //차트 업데이트
        //             syd3.update(syd3,dataset);
        //         });
        //  });

        // // d3.csv("example.csv").then(function (data) {
        // //     dataset = new Array();   
        // //     let datafillter = d3.rollup(data, d => d3.sum(d,v => v.value), c => c.year, b => 
        // //                                 b.industry_code_ANZSIC).get("2011");
        // //     datafillter.forEach(function(value,code){
        // //         if(code != 'all'){
        // //             dataset.push({
        // //                 code:code,
        // //                 value:value
        // //             })
        // //         }
        // //     });
        // //     data.forEach((v,k)=>{
        // //         dataset.push(v);   
        // //     });
            
        // //     let myChart3 = new SYChartHandler('myChart4','pie',{
        // //         dataset:dataset,
        // //         domainXY:['code','value'],
        // //         MARGIN : {
        // //             TOP:0,
        // //             BOTTOM:50,
        // //             LEFT:80,
        // //             RIGHT:50
        // //         }
        // //     }).create();
        // // });

        // function chartUpdate(syd3,newDataset){
        //     new syD3().update(syd3,newDataset);
        // }