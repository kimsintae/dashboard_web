$(function(){

    //모달 생성
    let myModal = new bootstrap.Modal(document.getElementById('alertModal'), {
        keyboard: false
    })


    //기관선택 이벤트
    $("input[name='gikawnTpye']").click(function(){
        let id = $(this).attr("id");
        switch (id) {
            case "partial":
                $('#governmentTypeDiv').hide();
                $('#zoneTypeDiv').show();
                break;
            default:
                $('#governmentTypeDiv').show();
                $('#zoneTypeDiv').hide();
                break;
        }
    });

    //통계기준 이벤트
    $("#staticsAll").click(function(){
        let checkedFlag = this.checked?true:false;
        $(".statics-btn").each(function(i,e){
            e.checked = checkedFlag;
        })
    });

    //조회버튼 이벤트
    $("#analyBtn").click(function(){
        let insttType = "";
        let insttCd = "";
        let statsType = "";
        $(".map-loading-bar").show();
        if($('input[name=statsType]:checked').length == 0){
            $(".alert-message").text('선택된 통계유형 없습니다.');
                myModal.toggle();
                return;
        }else if($('input[name=statsType]:checked').length == 8){
            statsType = '""';
        }else{
            statsType = "[";
            for(i=0; i<$('input[name=statsType]:checked').length; i++){

                if($('input[name=statsType]:checked')[i].value != "STATS00000"){
                    statsType += '"'+$('input[name=statsType]:checked')[i].value+'",';
                }
            }
            statsType = statsType.slice(0, -1);
            statsType += "]";
        }
        console.log(statsType)
        bsnsType = $('#bsnsType').val();
        if($('input[name=gikawnTpye]:checked').val() == 'partial'){
            insttType = $('#zoneSGGType').val() == 0 ? 'SD':'SGG';
            insttCd = $('#zoneSGGType').val() == 0 ? $('#zoneType').val() : $('#zoneSGGType').val();
        }else{
            insttType = 'INSTT';
            insttCd = $('#insttType').val()
        }
        
        let bizStatsParams = {
            'url': 'http://dev.syesd.co.kr:14000/biz/stats',
            'data': '{"begin":'+$('#planBeginYear').val()+', "end":'+$('#planEndYear').val()+', "bsnsTy":"'+bsnsType+'", "statsTy":'+statsType+', "insttTy":"'+insttType+'", "insttCd":"'+insttCd+'"}',
            'dataType': 'json'
        };
        let bizParams = {
            'url': 'http://dev.syesd.co.kr:14000/biz',
            'data': '{"begin":'+$('#planBeginYear').val()+', "end":'+$('#planEndYear').val()+', "bsnsTy":"'+bsnsType+'", "statsTy":'+statsType+', "insttTy":"'+insttType+'", "insttCd":"'+insttCd+'"}',
            'dataType': 'json'
        };
        let bizSuccess = function(result) {
            global_DashBoard.biz = result;
            let infoHtmls ='';
            for(i=0; i<global_DashBoard.biz.length; i++){
                let info = global_DashBoard.biz[i];
                infoHtmls +='<tr><td>'+info.bsns_nm+'</td><td>'+info.instt_nm+'</td><td>'+info.bsns_ty_nm+'</td><td>'+info.bsns_cl_nm+'</td><td>'+info.bsns_bgnde+'</td><td>'+info.bsns_endde+'</td>';
            }
            $('#infoTable').html(infoHtmls);
            if($('input[name=gikawnTpye]:checked').val() != 'partial'){
                insttDataDraw()
            }    
        }

        //연도별 차트
        let bizStatsSuccess = function(result) {
            if(result.length < 1){
                $(".alert-message").text('분석데이터가 없습니다.');
                myModal.toggle();
                $(".map-loading-bar").hide();
                return;
            }else{
                $("#initBlockBox").hide();
                $("#sidebarToggle").trigger("click");
                setTimeout( function() { 
                if($('input[name=gikawnTpye]:checked').val() == 'partial'){
                    $("#mapLegend").show();
                    $('#mapDiv').show();
                    $('#governmentDiv').hide();
                    $('#governmentTypeDiv').hide();
                    initMap();
                    let sidoId = $("#zoneType").val();
                    let sggId = $("#zoneSGGType").val();
                    let options = {
                        url : './geojson/code_sgg_polygon.geojson',
                        zoneId:''
                    }
                    options.zoneId = (sggId == 0 ? sidoId : sggId);
                    map.updateSize();
                    addZoneLayerWithGeojson(options);
                }else{
                    $('#mapDiv').hide();
                    $("#mapLegend").hide();
                    $('#governmentDiv').show();
                    $('#governmentTypeDiv').show();
                    // $("#sidebarToggle").trigger("click");
                }
                global_DashBoard.bizStats = result;
                let options = {
                    dataset:global_DashBoard.bizStats,//data
                    domainXY:['year','count'],//column 설정
                    style:{//style 적용 가능
                        fill : function(d,i){
                            // let color = ['rgba(255,255,0,0.5)','rgba(100,123,0,0.5)','rgba(100,200,50,0.5)','rgba(69,25,21,0.5)','rgba(10,125,21,0.5)'];
                            // for(c=0; c<global_DashBoard.bizStats.length; c++){
                            //     if(d.year == global_DashBoard.bizStats[c].year){
                            //         color = color[c];
                            //     }
                            // }
                            return "#3A3C68";
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
                        dataset:global_DashBoard.bizStats
                    }
                    };
                let bizcountBar = new syD3('lineChart1','bar',options);
                bizcountBar.create();

                DS_AJAX_POST(bizParams,bizSuccess);
                }, 200);
            }
            
        }
        DS_AJAX_POST(bizStatsParams,bizStatsSuccess);
    });

    //시도 시군구 선택 이벤트
    $("#zoneType").change(function(){
        $("#zoneSGGType").empty();
        let CODE_SD = $(this).val();
        $.get("./geojson/code_sgg_point.geojson", function(d){
            let data = typeof d == 'string' ? JSON.parse(d) : d;
            let sggList = Array();
            let option_htm = "<option value='0'>전체</option>";
            data.features.filter((f)=>f.properties.code.startsWith(CODE_SD))
            .forEach((f)=>sggList.push({cd:f.properties.code,nm:f.properties.nm}));
            let sortedList = sggList.sort((a,b)=>(a.nm.toLowerCase() < b.nm.toLowerCase() ? -1 : 1));
            sortedList.forEach(function(d){
                option_htm += `<option value="${d.cd}">${d.nm}</option>`;
            });
            $("#zoneSGGType").append(option_htm);
        });
    });

    function insttDataDraw(){
        $('#governmentChart').empty();
        let insttDataset = [];    
        for(j=0; j<Object.keys(objGroupByName(global_DashBoard.biz,'instt_nm')).length; j++){
            totExcut = 0;
            totPlan = 0;
            for(k=0; k<Object.values(objGroupByName(global_DashBoard.biz,'instt_nm'))[j].length; k++){
                totExcut += Object.values(objGroupByName(global_DashBoard.biz,'instt_nm'))[j][k].bsns_budget_excut;
                totPlan += Object.values(objGroupByName(global_DashBoard.biz,'instt_nm'))[j][k].bsns_budget_plan;
            }
            insttDataset.push({
                'group':Object.keys(objGroupByName(global_DashBoard.biz,'instt_nm'))[j],
                'J':totExcut,
                'Y':totPlan,
            });
        }
        let options1 = {
            dataset:insttDataset,//data
            domainXY:['year','value'],//column 설정
            style:{//style 적용 가능
                fill : function(d,i){
                return "red"
                },
                stroke : {
                    color : function(d,i){
                        return "skyblue"
                    },
                    width : 2.5
                }
            }
        }; 
        let governmentBar = new syD3('governmentChart','Bar_Group',options1);
        governmentBar.create();
    }
});


