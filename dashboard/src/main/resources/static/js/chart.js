
let ChartContainers = new Map();

class StyleHandler{

}

class Pie{
    constructor(id,options){
        this.id = id;
        this.dataset;//가공된 dataset을 제공 받는다.
        this.options = options;
        this.svg
        this.xScale;
        this.yScale;
        this.w;
        this.h;
    }

    getSvg(){
        if(this.svg == null){console.error("svg object is null")}
        return this.svg;
    }

    draw(){
        const MARGIN = {
            TOP:0,
            RIGHT:0,
            BOTTOM:0,
            LEFT:0
        };
        const id = this.id;
        const dataset = this.options.dataset;
        const width = document.getElementById(this.id).parentNode.offsetWidth;
        const height = document.getElementById(this.id).parentNode.offsetHeight;
        const domainX = this.options.domainXY[0];
        const domainY = this.options.domainXY[1];
        this.svg = d3.select("#"+this.id)
        .attr("width",width-MARGIN.LEFT-MARGIN.RIGHT)
        .attr("height",height)

        this.w = this.svg.attr("width");
        this.h = this.svg.attr("height");

        const svgDimensions = {
            width: this.w/1.4,//좌우측 정렬
            height: this.h-MARGIN.TOP-MARGIN.BOTTOM
        };
        const radius = Math.min(svgDimensions.width, svgDimensions.height)/2.5;
        const g = this.svg
            .append("g")
            .attr(
            "transform",
            `translate(${(svgDimensions.width / 2)}, ${svgDimensions.height/2})`
        );

        const color = d3.scaleOrdinal([
            "#D4F0F0",
            "#8FCACA",
            "#CCE2CB",
            "#B6CFB6",
            "#97C1A9",
            "#FF3219"
        ]);

        //value 값 뽑아서 pie 생성
        const pie = d3.pie().value(function(d) {
        return Number(d[domainY])
        }).sort(null);//값으로 정렬하지 않음
         
        // pie 조각
        const arc = d3.arc().innerRadius(18).outerRadius(radius);
        const arcs = g
        .selectAll("arc")
        .data(pie(dataset))
        .join("g")
        .attr("class", "arc_"+id)
        .on("mouseover", function(e,d){
            $(this).attr('transform','scale( 1.2 )')
            $($('.legend_'+id)[d.index]).children('text')
            .attr('fill','red')
        })
        .on("mouseout", function(e,d){
            $(this).attr('transform','scale( 1 )')
            $($('.legend_'+id)[d.index]).children('text').attr('fill','black');
        });

        arcs
            .append("path")
            .attr("fill", (d, i) => color(i))
            .attr("d", arc);

        arcs
            .append("text")
            .attr("transform", (d) => `translate(${arc.centroid(d)})`)
            .text((d) => d.value)
            .attr("font-size", "12px")
            .attr("fill", "black")
            .attr("text-anchor", "middle")
        // .attr("display", "none");
        let avgScore = 
            dataset.reduce(function(a, b) {
                return a + b.value;
            }, 0);
            avgScore = avgScore/dataset.length;
        g.append("svg:text")
            // .attr("class",'pieAvgScore_'+id)
            .attr("dy", ".30em")
            .attr("text-anchor", "middle") // text-align: right
            .text(avgScore);

        let legendG = g.selectAll(".legend_"+id)
            .data(pie(dataset))
            .enter()
            .append("g")
            .attr("transform", function(d,i){
                return "translate(" + ((svgDimensions.width/2)) + "," + (i * 15 - (svgDimensions.height/3)) + ")";
            })
            .attr("class", "legend_"+id)
            .on('mousemove',function(e,d){
                // pie 조각 스케일 조정
                let path = $($(".arc_"+id)[d.index]);
                path.attr('transform','scale( 1.2 )');
            })
            .on('mouseout',function(e,d){
                // pie 조각 스케일 조정
                let path = $($(".arc_"+id)[d.index]);
                path.attr('transform','scale( 1)');
            });    
            
            legendG.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill",  function(d,i) { 
                return color(i); 
            });
    
            legendG.append("text")
            .text(function(d){ 
                return d.data[domainX];
            })
            .attr("fill", "black")
            .style("font-size", 15)
            .attr("y", 10)
            .attr("x", 15)

        // g.append('text')
        //     .text(function(d,i){
        //         return title_group[0];
        //     })
        //     .attr("fill", "black")
        //     .style("font-size", 15)
        //     .attr("y", 0)
        //     .attr("x", -90)
        
        // console.info('PIE Chart frame is successed !');
        return this.svg;
    }
}

class Bar{
    constructor(id,options){
        this.id = id;
        this.dataset;//가공된 dataset을 제공 받는다.
        this.options = options;
        this.svg;
        this.xScale;
        this.yScale;
        this.w;
        this.h;
        this.create;
    };

    getDomain(){
        return this.options.domainXY;
    }
    getSvg(){
        if(this.svg == null){console.error("svg object is null")}
        return this.svg;
    };

    getXscale(){return this.xScale;};

    getYscale(){return this.yScale;};
    
    draw(dataset){

        // console.log(this.id," bar drawing... ");
        const MARGIN = this.options.MARGIN;
        const width = document.getElementById(this.id).parentNode.offsetWidth;
        const height = document.getElementById(this.id).parentNode.offsetHeight;
        const domainX = this.options.domainXY[0];
        const domainY = this.options.domainXY[1];
        const style = this.options.style;
        
        const tooltip = $("#yearChartToolipBox");
    
        this.svg = d3.select("#"+this.id)
        .attr('preserveAspectRatio','xMidYMid meet')
        .attr('viewBox','0 0 '+width+' '+height+'');//반응형 SVG

                    //  .attr("width",width)
                    //  .attr("height",height);

        this.w = width-MARGIN.LEFT;
        this.h = height;

        //x 스케일 생성
        this.xScale = d3.scaleBand().range([0,this.w-this.options.CHART_WH['w']]).padding(0.5);
        this.yScale = d3.scaleLinear().range([this.h,this.options.CHART_WH['h']]);

        // // x 축 도메인 구성
        this.xScale.domain(dataset.map(function(d){return d[domainX]}));
        // y 축 도메인 구성
        this.yScale.domain([0, d3.max(dataset,function(d){return Number(d[domainY]);})]);

        let BEANDWIDTH = this.xScale.bandwidth();
        this.svg.selectAll("g").remove();
        this.svg.selectAll("rect")
            .data(dataset)
            .join("rect")
            .attr("class",this.id+"_bar sy-bar")
            .attr("x",(d)=>this.xScale(d[domainX])+MARGIN.LEFT)
            .attr("width",BEANDWIDTH)
            .attr("y",(d)=>this.yScale(0)-MARGIN.BOTTOM)
            .attr("height",(d) => this.h-this.yScale(0))
            .style("fill",style.fill)
            .style("stroke",style.stroke.color)
            .on("mousemove",function(e,d){ 
                //툴팁박스
                // $("body").append("<div id='chartToolipBox'></div>");
                $(tooltip).empty();
                $(tooltip).show();
                $(tooltip).css('position','absolute');
                $(tooltip).html(`
                    <div style="display: inline-block;width: 50%; color:red; font-weight:bold; font-size:14px;">${d[domainX]}</div>
                    <div style="display: inline-block;width: 40%;">(년)</div>
                    <div style="display: inline-block;width: 50%; color:red; font-weight:bold; font-size:14px;">${d[domainY]}</div>
                    <div style="display: inline-block;width: 40%;">(건)</div>
                `)
                .css("left", (e.x-45) + "px")		
                .css("top", (e.y-60) + "px")
                .css("opacity", .9);
            })
            .on("mouseout", function(e,d) {		
                $(tooltip).hide();
            });

        this.svg.selectAll("rect")
            .transition()
            .duration(800)
            .attr("y",(d)=>this.yScale(Number(d[domainY]))-MARGIN.BOTTOM)
            .attr("height",(d) => this.h-this.yScale(Number(d[domainY])))
            .delay(function(d,i){return(i*100)});

        //보조 지표 라인
        if(this.options.SUB_LINE.show){
            let valueline = d3.line()
                .x((d)=> this.xScale(d[domainX])+((BEANDWIDTH/2)+MARGIN.LEFT) )
                .y((d)=> this.yScale(Number(d[domainY]))-MARGIN.BOTTOM )
                .curve(d3.curveMonotoneX);
                
            this.svg.selectAll("path")
                .data([this.options.SUB_LINE.dataset])
                .join("path")
                .style("fill","none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", valueline)
                .on("mousemove",function(e,d){

                })
                .on("mouseout", function(e,d) {		
                    // tooltip.style("opacity", 0);	
                });

            this.svg.selectAll("circle")
                .data(this.options.SUB_LINE.dataset)
                .join("circle")
                .style("fill","red")
                .attr("cx", (d, i) => this.xScale(d[domainX]) + ((BEANDWIDTH/2)+MARGIN.LEFT))
                .attr("cy", (d, i) => this.yScale(Number(d[domainY]))-MARGIN.BOTTOM)
                .attr("r", 5);
        }

        // x 축 생성
        this.svg.append("g")
            .attr("class","xAxis")
            .attr("transform", "translate("+MARGIN.LEFT+"," + (this.h-MARGIN.BOTTOM) + ")")
            .call(d3.axisBottom(this.xScale));

        // y 축 생성
        this.svg.append("g")
            .attr("class","yAxis")
            .attr("transform", "translate("+MARGIN.LEFT+","+(-MARGIN.BOTTOM)+")")
            .transition()
            .duration(800)
            .call(d3.axisLeft(this.yScale).ticks(10))

        // console.info('Chart frame is successed !');
        return this.svg;
    }
}

class Bar_Group{
    constructor(id,options){
        this.id = id;
        this.dataset= options.dataset;//가공된 dataset을 제공 받는다.
        this.options = options;
        this.svg;
        this.xScale;
        this.yScale;
        this.w;
        this.h; 
        this.create;
    };

    draw(){
        const MARGIN = this.options.MARGIN;
        MARGIN.LEFT = 70;
        const width = document.getElementById(this.id).parentNode.offsetWidth;
        const height = document.getElementById(this.id).parentNode.offsetHeight-30;
        const domainX = this.options.domainXY[0];
        const domainY = this.options.domainXY[1];
        const style = this.options.style;
        const tooltip = $("#goverChartToolipBox");
        this.svg = d3.select("#"+this.id)
        .attr('viewBox','0 0 '+width+' '+height+'');
                    //  .attr("width",width)
                    //  .attr("height",height);
        this.w = width-MARGIN.LEFT;
        this.h = height-MARGIN.BOTTOM;
        let subgroups = ['Y','J']; // x 축 그룹
        let maxVal = d3.max(
            d3.map(this.dataset,function(d){return d.Y}).concat(
                d3.map(this.dataset,function(d){return d.J})
            )
        );
        
        let groups = d3.map(this.dataset,function(d){return d.group}); // x축
        let x = d3.scaleBand()
                .domain(groups)
                .range([0, this.w-MARGIN.LEFT])
                .padding([0.2]);
        
        // x축
        this.svg.append("g")
            .attr("transform", "translate("+MARGIN.LEFT+"," + (this.h) + ")")
            .style("font-size","12")
            .call(d3.axisBottom(x).tickSize(0));

        let y = d3.scaleLinear()
                .domain([0, maxVal])
                .range([ this.h, 40 ]);

        //y축
        this.svg.append("g")
            .attr('class',this.id+'-Y-axis')
            .attr("transform", "translate("+MARGIN.LEFT+",0)")
            .call(d3.axisLeft(y).tickFormat((d, i) => numberFormat(d/1000000)));
        this.svg.append('text')
        .text('(백만)')
        .style('font-size','10px')
        .attr('x',MARGIN.LEFT-15) 
        .attr('y',y(maxVal)-10)
        var xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, x.bandwidth()])
        .padding([0.01])

        var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['rgba(255,0,0,0.6)','rgba(0,0,255,0.6)'])

        this.svg.append("g")
            .selectAll("g")
            .data(this.dataset)
            .enter()
            .append("g")
            .attr("transform", function(d) { return "translate(" + (x(d.group)) + ",0)"; })
            .selectAll("rect")
            .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
            .enter().append("rect")
            .attr("x", function(d) { return xSubgroup(d.key)+MARGIN.LEFT; })
            .attr("width", xSubgroup.bandwidth())
            .attr("y", function(d) { return y(maxVal); })
            .attr("height", function(d) { return (height-MARGIN.BOTTOM-40); })
            .attr("fill", function(d) { return '#432c2c1a'; })
           
        this.svg.append("g")
            .selectAll("g")
            .data(this.dataset)
            .enter()
            .append("g")
            .attr("transform", function(d) { return "translate(" + (x(d.group)) + ",0)"; })
            .selectAll("rect")
            .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
            .enter().append("rect")
            .attr('class',function(d){return "JY_rect rect_"+d.key;})
            .attr("x", function(d) { return xSubgroup(d.key)+MARGIN.LEFT; })
            .attr("width", xSubgroup.bandwidth())
            .attr("y", function(d) { return y(0); })
            .attr("height", function(d) { return (height-MARGIN.BOTTOM) - y(0); })
            .attr("fill", function(d) { return color(d.key); })
            .on('mousemove',(e,d)=>{
                let color = '#a59e9e54';
                let key = d.key==='Y'?'J':'Y';
                this.svg.selectAll('.rect_'+key).attr('fill',color);
                this.svg.selectAll('.'+key+'-avg-line').attr('stroke',color);
                let v = numberFormat(Math.floor(d.value/1000000));
                //툴팁
                $(tooltip).empty();
                $(tooltip).show();
                $(tooltip).css('position','absolute');
                $(tooltip).html(`
                    <div style="display: inline-block;width: 50%; color:red; font-weight:bold; font-size:14px;">${d.key==='Y'?'사업예산비':'사업집행비'}</div>
                    <div style="display: inline-block;width: 40%;">(년)</div>
                    <div style="display: inline-block;width: 50%; color:red; font-weight:bold; font-size:14px;">${v}</div>
                    <div style="display: inline-block;width: 40%;">(백만)</div>
                `)
                .css("left", (e.x-45) + "px")		
                .css("top", (e.y-80) + "px")
                .css("opacity", .9);
            })
            .on('mouseout',(e,d)=>{
                this.svg.selectAll('.rect_J').attr('fill','rgba(0,0,255,0.6)');
                this.svg.selectAll('.rect_Y').attr('fill','rgba(255,0,0,0.6)');
                this.svg.selectAll('.J-avg-line').attr('stroke','rgba(0,0,255,0.6)');
                this.svg.selectAll('.Y-avg-line').attr('stroke','rgba(255,0,0,0.6)');
                $(tooltip).hide();
            });
        
        this.svg.selectAll(".JY_rect")
            .transition()
            .duration(800)
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return (height-MARGIN.BOTTOM) - y(d.value); })
            .delay(function(d,i){return(i*100)});

        //평균 선 올리기
        this.svg.append("g")
            .attr('class','J-avg')
            .attr("transform", "translate("+MARGIN.LEFT+"," + (this.h-140) + ")")
            .style('stroke-width','3')
            .call(d3.axisBottom(x).tickSize(0).tickFormat(""));
            
        d3.select('.J-avg').selectAll('path')
        .attr('class','J-avg-line')
        .style("stroke-dasharray", ("3, 3"))
        .attr('stroke','#e41a1c');

        this.svg.append("g")
            .attr('class','Y-avg')
            .attr("transform", "translate("+MARGIN.LEFT+"," + (this.h-80) + ")")
            .style('stroke-width','3')
            .call(d3.axisBottom(x).tickSize(0).tickFormat(""));
        d3.select('.Y-avg').selectAll('path')
        .attr('class','Y-avg-line')
        .style("stroke-dasharray", ("3, 3"))
        .attr('stroke','#377eb8');
    }
}

class Bar_Overlay{
    constructor(id,options){
        this.id = id;
        this.dataset;//가공된 dataset을 제공 받는다.
        this.options = options;
        this.svg;
        this.xScale;
        this.yScale;
        this.w;
        this.h;
        this.create;
    };
    getDomain(){
        return this.options.domainXY;
    }
    getSvg(){
        if(this.svg == null){console.error("svg object is null")}
        return this.svg;
    };

    getXscale(){return this.xScale;};

    getYscale(){return this.yScale;};
    
    draw(dataset){
        const MARGIN = this.options.MARGIN;
        const width = document.getElementById(this.id).parentNode.offsetWidth;
        const height = document.getElementById(this.id).parentNode.offsetHeight+50;
        const domainX = this.options.domainXY[0];
        const domainY = this.options.domainXY[1];
        const zoneName = dataset[0]['name'];
        this.svg = d3.select("#"+this.id)
                     .attr("width",width)
                     .attr("height",height);
        this.w = this.svg.attr("width");
        this.h = this.svg.attr("height");

        //x 스케일 생성
        this.xScale = d3.scaleBand().range([0,this.w]).padding(0.1);
        this.yScale = d3.scaleLinear().range([this.h,50]);

        // // x 축 도메인 구성
        this.xScale.domain(dataset.map(function(d){return d[domainX]}));

        // y 축 도메인 구성
        this.yScale.domain([0, d3.max(dataset,function(d){return d[domainY];})]);
        
        this.svg.selectAll("g").remove();
        this.svg.selectAll("rect")
            .data(dataset)
            .join("rect")
            .attr("class","overlay_bar")
            .attr("x",(d)=>this.xScale(d[domainX])+MARGIN.LEFT)
            .attr("width",this.xScale.bandwidth())
            .attr("y",(d)=>this.yScale(0))
            .attr("height",(d) => this.h-this.yScale(0))
            .attr("fill", function(d){ return d[domainX] == "ev" ? "rgba(255,0,0,0.6)" : "rgba(252,221,97,0.6)"})
            .on('mousemove',function(d){
                // console.log('oevr !! ')
            });
        this.svg.selectAll("rect")
            .transition()
            .duration(800)
            .attr("y",(d)=>this.yScale(d[domainY])-MARGIN.BOTTOM-30)
            .attr("height",(d) => (d[domainY]>0) ? this.h-this.yScale(d[domainY])-10:0)
            .delay(function(d,i){return(i*100)})

        this.svg.selectAll('text')
            .data(dataset)
            .enter()
            .append('text')
            .text((d)=>Math.floor(d[domainY]))
            .style('font-size','8px')
            .attr("fill", (d)=> d[domainX] == "ev" ? "rgba(255,0,0,0.6)" : "rgba(252,221,97,0.6)")            
            .attr('stroke','white')            
            .attr('x',(d)=>this.xScale(d[domainX]))
            .attr('y',(d)=>(this.yScale(d[domainY])-35));
  
        this.svg.append('text')
            .text(zoneName)
            .style('font-size','12px')
            .attr('width',this.w)
            .attr('fill','white')
            // .attr('stroke','green')
            // .attr('stroke-width','1px')
            .attr("text-anchor", "right")            
            .attr('x',10)
            .attr('y',90);

        // x축
        this.svg.append("g")
            .attr("transform", "translate("+MARGIN.LEFT+"," + (this.h-40) + ")")
            .style("font-size","9")
            .style("color","white")
            .call(d3.axisBottom(this.xScale).tickSize(0)
            .tickFormat((d)=> d=='ev'?'계획':'집행'));


        // console.info('Chart frame is successed !');
        return this.svg;
    }
}

class Line{
    constructor(id,options){
        this.id = id;
        this.dataset;//가공된 dataset을 제공 받는다.
        this.options = options;
        this.svg
        this.xScale;
        this.yScale;
        this.w;
        this.h;
        this.valueline;
    }

    getSvg(){
        if(this.svg == null){console.error("svg object is null")}
        return this.svg;
    }

   draw(dataset){
        const MARGIN = this.options.MARGIN;
        const width = document.getElementById(this.id).parentNode.offsetWidth;
        const height = document.getElementById(this.id).parentNode.offsetHeight;
        const domainX = this.options.domainXY[0];
        const domainY = this.options.domainXY[1];
        const style = this.options.style;
        
        //툴팁박스
        const tooltip = d3.select("#chartToolipBox");
        this.svg = d3.select("#"+this.id)
                        .attr("width",width)
                        .attr("height",height);
        
        this.w = this.svg.attr("width")-MARGIN.LEFT-MARGIN.RIGHT;
        this.h = this.svg.attr("height")-MARGIN.BOTTOM-MARGIN.TOP;

        //x 스케일 생성
        let xScale = d3.scaleBand().range([0,this.w-this.options.CHART_WH['w']]).padding(0.5);
        let yScale = d3.scaleLinear().range([this.h,this.options.CHART_WH['h']]);

        // // x 축 도메인 구성
        xScale.domain(dataset.map(function(d){return d[domainX]}));

        // y 축 도메인 구성
        let max = d3.max(dataset,function(d){return Number(d[domainY]);});
        yScale.domain([0, max]);

        let BEANDWIDTH = xScale.bandwidth();
        this.svg.selectAll("g").remove();

        // 라인 생성
        this.valueline = d3.line()
            .x(function(d) { return xScale(d[domainX])+MARGIN.LEFT+15; })
            .y(function(d) { return yScale(Number(d[domainY]))-MARGIN.BOTTOM-MARGIN.TOP; })
            .curve(d3[style.line]);

        this.svg.selectAll("path")
        .data([dataset])
        .join("path")
        .style("fill",style.fill)
        .attr("stroke",style.stroke.color)
        .attr("stroke-width", style.stroke.width)
        .transition()
        .duration(800)
        .attr("class",this.id+"_line")
        .attr("d", this.valueline)

        // 포인트 생성
        this.svg.selectAll("circle")
        .data(dataset)
        .join("circle")
        .attr("class","line-pointer")
        .style("fill","blue")
        .attr("cx", (d, i) => xScale(d[domainX]) + ((BEANDWIDTH/2)+MARGIN.LEFT))
        .attr("cy", (d, i) => yScale(Number(d[domainY]))-MARGIN.BOTTOM)
        .attr("r", 5);
        
        let pointer = $(".line-pointer");

        // 배경 rect 만들기
        this.svg.selectAll("rect")
        .data(dataset)
        .join("rect") // == enter().append()
        .attr("x",(d)=>xScale(d[domainX])+(MARGIN.LEFT-(BEANDWIDTH/2)))
        .attr("width",BEANDWIDTH*2)
        .attr("y",(d)=>yScale(max)-MARGIN.BOTTOM)
        .attr("height",(d) => this.h-yScale(max))
        .style("fill","rgba(0,0,0,0)")
        .on("mousemove",function(e,d){
            //해당 값의 대한 마우스가 닿았을 경우 circle의 위치값 가져오기
            let idx = $(this).index()-dataset.length;
            let top = $(pointer[idx-1]).position().top;
            let left = $(pointer[idx-1]).position().left;
            d3.select(pointer[idx-1]).style("fill","red");
            tooltip.html(`
            <span class='sy-toolip-contents sy-toolip-key'>${d[domainX]}</span> :
            <span class='sy-toolip-contents sy-toolip-value'>${d[domainY]}</span>
            `)
            .style("left", (left-40) + "px")
            .style("top", (top-35) + "px")
            .style("opacity", .9);
        })
        .on("mouseout",function(e,d){
            let idx = $(this).index()-dataset.length;
            d3.select(pointer[idx-1]).style("fill","blue");
            tooltip.style("opacity", 0);
        })

        // x 축 생성
        this.svg.append("g")
                .attr("transform", "translate("+MARGIN.LEFT+"," + (this.h-MARGIN.BOTTOM) + ")")
                .call(d3.axisBottom(xScale));

        // y 축 생성
        this.svg.append("g")
                .attr("transform", "translate("+MARGIN.LEFT+","+(-MARGIN.BOTTOM)+")")
                .transition()
                .duration(800)
                .style("font-size","13px")
                .call(d3.axisLeft(yScale).ticks(10));
                
        // console.info('Chart frame is successed !');
        return this.svg;
   }
}

// 방사형 차트
class Radar{
    
    constructor(id,options){
        this.id = id;
        this.dataset = options.dataset['main']
        this.dataset_sub = options.dataset['sub']
        this.options = options;
        this.svg
        this.xScale;
        this.yScale;
        this.w;
        this.h;
        this.valueline;
    }

    getSvg(){
        if(this.svg == null){console.error("svg object is null")}
        return this.svg;
    }

    generatePoint(params){
        const point =
        {
            x: params.center.x + ( params.length * Math.sin( params.offset - params.angle ) ),
            y: params.center.y + ( params.length * Math.cos( params.offset - params.angle ) )
        };
        return point;
    }

    drawPath(points, svg){
        const lineGenerator = d3.line()
        .x( d => d.x )
        .y( d => d.y );

        parent.append( "path" )
        .attr( "d", lineGenerator( points ) );
    }

    genTicks(levels){
        const ticks = [];
        const step = 100 / levels;
        for ( let i = 0; i <= levels; i++ ) 
        {
            const num = step * i;
            if ( Number.isInteger( step ) )
            {
                ticks.push( num );
            }
            else
            {
                ticks.push( num.toFixed( 2 ) );
            }
        }
        return ticks;
    }

    drawCircles(type,points){
        const tooltip = $("#yearChartToolipBox");

        const mouseEnter = d =>
        {
            // console.log( d3.event );
            tooltip.style( "opacity", 1 );
            const { x, y } = d3.event;
            tooltip.style( "top", `${ y - 20 }px` );
            tooltip.style( "left", `${ x + 15 }px` );
            tooltip.text( d[dataXY[1]] );
        };

        const mouseLeave = d =>
        {
            tooltip.style( "opacity", 0 );
        };

        this.svg.append( "g" )
            .attr( "class", type+"-indic" )
            .selectAll( "circle" )
            .data( points )
            .enter()
            .append( "circle" )
            .attr( "cx", d => d.x )
            .attr( "cy", d => d.y )
            .attr( "r", 4 )
            .on("mousemove",function(e,d){ 
                //툴팁박스
                // $("body").append("<div id='chartToolipBox'></div>");
                $(tooltip).empty();
                $(tooltip).show();
                $(tooltip).css('position','absolute');
                $(tooltip).html(`
                    <div style="display: inline-block;width: 80%;">항목점수</div>
                    <div style="display: inline-block;width: 20%; color:white; font-weight:bold; font-size:14px;">`+d.value+`</div>
                `)
                .css("left", (e.x-45) + "px")		
                .css("top", (e.y-60) + "px")
                .css("opacity", .9);
            })
            .on("mouseout", function(e,d) {		
                $(tooltip).hide();
            });
            // .on( "mouseenter", mouseEnter )
            // .on( "mouseleave", mouseLeave );
    }

    drawOptionPanel(dataset,domainXY){
        let panel_container = $(".radar-option-content");
        let svg = this.svg;
        let ID = this.id;
        panel_container.empty();

        let template = '';
        dataset.forEach((d)=>{
            template += `   <div class="input-group mb-1 radar-data-box">
                <span style="width:40px;" class="input-group-text radar-data-key" data-key=${d[domainXY[0]]}>${d[domainXY[0]]}</span>\
                <button type="button" data-type="plus" class="form-control btn btn-primary radar-btn">+</button>\
                <input type="text" value="${d[domainXY[1]]}" class="form-control radar-value" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" style="font-size:11px;" disabled>\
                <button type="button" data-type="minus" class="form-control btn btn-primary radar-btn">-</button>\
                </div>
            `
        });
        panel_container.append(template);
        $(".radar-data-box").on('mouseover',function(e){
            let idx = $(this).index();
            let circles = d3.select('.nomal-indic').selectAll('circle');
            // circles.each((d,i)=>{
            //     if(i == idx){
            //         d.attr("ddd")
            //         console.log(d);
            //     }
            // })
        })
    }

    clear=(svg)=>{  
        // d3.select('.radarChart-shape').remove();
        svg.selectAll('g').remove();
    }

    draw(data){
        
        const MARGIN = this.options.MARGIN;
        const width = document.getElementById(this.id).parentNode.clientWidth/1.5;
        const height = document.getElementById(this.id).parentNode.clientHeight;
        const dataset = data['main'];
        const dataset_sub = data['sub'];
        // const dataset_sub = this.dataset_sub; //평균값
        const domainX = this.options.domainXY[0];
        const domainY = this.options.domainXY[1];
        const NUM_OF_SIDES = dataset.length; // 꼭지점의 갯수
        const NUM_OF_LEVEL = dataset.length-1; // 방사형 깊이
        const SVG_ID=this.id;
        const RADAR_MOVE_LEFT = 1; // 방사형 X 위치
        const RADAR_MOVE_TOP = 0.5; // 방사형 Y 위치
        const style = this.options.style;
        
        //툴팁박스
        const tooltip = $("#radarCharToolipBox");
        this.svg = d3.select("#"+SVG_ID)
                        .attr("width",width)
                        .attr("height",height)
                        .append("g");
        const size = Math.min( width, height),
        offset = Math.PI,
        polyangle = ( Math.PI * 2 ) / NUM_OF_SIDES,
        r = 0.9 * size,//방사형 전체 크기
        r_0 = r / 2,
        center =
        {
            x: size  - 140,
            y: size / 2 + 20
        };
        const scale = d3.scaleLinear()
            .domain( [ 0, 100] )
            .range( [ 0, r_0 ] )
            .nice();

        // [1] 기본 폴리곤 생성
        for ( let level = 1; level <= NUM_OF_LEVEL; level++ ) 
        {
            const hyp = ( level / NUM_OF_LEVEL ) * r_0;
            const points = [];
            for ( let vertex = 0; vertex < NUM_OF_SIDES; vertex++ ) 
            {
                const theta = vertex * polyangle;
                points.push( this.generatePoint( { length: hyp, angle: theta, center: center, offset:offset } ) );
            }
            const polygon_g = this.svg.append( "g" )
            .attr( "class", "levels" )
            // .style('fill','red');
            // drawPath( [ ...points, points[ 0 ] ], group );
            
            // path 생성
            const lineGenerator = d3.line()
                .x( d => d.x )
                .y( d => d.y );
            polygon_g.append( "path" )
                .attr( "d", lineGenerator( [ ...points, points[ 0 ] ] ) )
                .style("fill","none")
                .style("stroke","black");
        }

        // [ 2 ] 깊이 라인 만들기
        const grid_line_g = this.svg.append( "g" ).attr( "class", SVG_ID+"-grid-lines" );
        for ( let vertex = 1; vertex <= NUM_OF_SIDES; vertex++ ){
            const theta = vertex * polyangle;
            const point = this.generatePoint( { length: r_0, angle: theta, center: center, offset:offset } );
            // drawPath( [ center, point ], group );
            // path 생성
            const lineGenerator = d3.line()
                .x( d => d.x )
                .y( d => d.y );
            grid_line_g.append( "path" )
            .attr( "d", lineGenerator( [ center, point ] ) )
            .style("fill","none")
            .style("stroke","black");
        }

        //  [ 3 ] Axis 축 만들기
        const groupL = this.svg.append( "g" ).attr( "class", SVG_ID+"-tick-lines" );
        const axis_point = this.generatePoint( { length: r_0, angle: 0, center: center, offset:offset } );
        // drawPath( [ center, point ], groupL );
        const lineGenerator = d3.line()
                .x( d => d.x )
                .y( d => d.y );

        groupL.append( "path" )
                .attr( "d", lineGenerator( [ center, axis_point ],groupL ) )
                .style("fill","none")
                .style("stroke","red");
        
        const groupT = this.svg.append( "g" ).attr( "class", SVG_ID+"-ticks" );
        const ticks = this.genTicks(NUM_OF_LEVEL);
        ticks.forEach( ( d, i ) =>
        {
            const r = ( i / NUM_OF_LEVEL ) * r_0;
            const p = this.generatePoint( { length: r, angle: 0, center: center, offset:offset } );
            const points =
            [
                p,
                {
                    ...p,
                    x: p.x - 10 // 눈금 가로 길이
                }
                
            ];
            const lineGenerator = d3.line()
                .x( d => d.x )
                .y( d => d.y );

            groupT.append( "path" )
            .attr( "d", lineGenerator( points, groupL ) )
            .style("fill","none")
            .style("stroke","red");

            // 축 값 텍스트 설정
           
            const xSpacing = d.toString().includes( "." ) ? 30 : 22;
            groupT.append( "text" )
                .attr( "x", p.x - xSpacing )
                .attr( "y", p.y + 5 )
                .html( d )
                .style( "text-anchor", "middle" )
                .style( "fill", "green" )
                .style( "font-size", "15px" )
                .style( "font-family", "sans-serif" )
                .style("font-weight","bold");
                    
            
        } );

        // [ 4 ] 요소 항목 나타내기
        const label_group = this.svg.append( "g" ).attr( "class", SVG_ID+"-labels" );
        const text_location = 1;
        for ( let vertex = 0; vertex < NUM_OF_SIDES; vertex++ ) 
        {
            const angle = vertex * polyangle;
            const label = dataset[ vertex ][domainX];
            const point = this.generatePoint( { length: text_location * ( size / 2 ), angle , center: center, offset:offset } );

            // 항목 텍스트 설정
            if ( true ){
                label_group.append( "text" )
                    .attr( "x", point.x )
                    .attr( "y", point.y )
                    .html( label )
                    .style( "text-anchor", "middle" )
                    .attr( "fill", "black" )
                    .style( "font-size", "15px" )
                    .style( "font-family", "sans-serif" );
            }
        }

        // [ 5 ] 데이터셋 적용하기
        // 1) 평균 값 나타내기
        const data_points_avg = [];
        dataset_sub.forEach( ( d, i ) => 
        {
            const len = scale( d[domainY] );
            const theta = i * ( 2 * Math.PI / NUM_OF_SIDES );
            data_points_avg.push(
                {
                    ...this.generatePoint( { length: len, angle: theta, center: center, offset:offset } ),
                    value: d[domainY]
                } );
        } );
        let avgScore_sub = 
        dataset_sub.reduce(function(a, b) {
                return a + b.value;
            }, 0);
            avgScore_sub = Math.round(avgScore_sub/dataset_sub.length);
        const group_data_avg = this.svg.append( "g" ).attr( "class", SVG_ID+"-shape-avg "+SVG_ID+"-shape" );
        const data_lineGenerator_avg = d3.line()
                .x( d => d.x )
                .y( d => d.y );

        group_data_avg.append( "path" )
            .attr( "d", data_lineGenerator_avg( [ ...data_points_avg, data_points_avg[ 0 ] ]) )
            .style("stroke","rgba(0, 0, 255, 1)")
            .style("fill","rgba(0,0,0,0.1)")
            .style('stroke-width','3')
            .on('mousemove',function(e,d){
                $(this).css('stroke-width','5');
                $(tooltip).empty();
                $(tooltip).show();
                $(tooltip).css('position','absolute');
                $(tooltip).html(`
                    <div style="display: inline-block;width: 60%;">분석 평균값</div>
                    <div style="display: inline-block;width: 40%; color:blue; font-weight:bold; font-size:14px;">`+avgScore_sub+`</div>
                `)
                .css("left", (e.x-45) + "px")		
                .css("top", (e.y-60) + "px")
                .css("opacity", .9);
            })
            .on('mouseout',function(e,d){
                $(tooltip).hide();
                $(this).css('stroke-width','3');
            })

        // 2) 분석 값 나타내기
        const data_points = [];
        dataset.forEach( ( d, i ) => 
        {
            const len = scale( d[domainY] );
            const theta = i * ( 2 * Math.PI / NUM_OF_SIDES );
            data_points.push(
                {
                    ...this.generatePoint( { length: len, angle: theta, center: center, offset:offset } ),
                    value: d[domainY]
                } );
        } );
        let avgScore = 
            dataset.reduce(function(a, b) {
                return a + b.value;
            }, 0);
            avgScore = Math.round(avgScore/dataset.length);
        const group_data = this.svg.append( "g" ).attr( "class", SVG_ID+"-shape-select "+SVG_ID+"-shape" );
        const data_lineGenerator = d3.line()
                .x( d => d.x )
                .y( d => d.y );

        group_data.append( "path" )
            .attr( "d", data_lineGenerator( [ ...data_points, data_points[ 0 ] ]) )
            .style("stroke","rgba(255, 0, 0, 1)")
            .style("fill","rgba(0,0,0,0.1)")
            .style('stroke-width','3')
            .on('mousemove',function(e,d){
                $(this).css('stroke-width','5');
                $(tooltip).empty();
                $(tooltip).show();
                $(tooltip).css('position','absolute');
                $(tooltip).html(`
                    <div style="display: inline-block;width: 60%;">선택 평균값</div>
                    <div style="display: inline-block;width: 40%; color:red; font-weight:bold; font-size:14px;">`+avgScore+`</div>
                `)
                .css("left", (e.x-45) + "px")		
                .css("top", (e.y-60) + "px")
                .css("opacity", .9);
            })
            .on('mouseout',function(e,d){
                $(tooltip).hide();
                $(this).css('stroke-width','3');
            })
        this.drawCircles('avg',data_points_avg);
        this.drawCircles('nomal',data_points);



        // [ 6 ] 가중치 옵션 패널 설정
        this.drawOptionPanel(dataset,this.options.domainXY);

        // console.info('Radar Chart frame is successed !');
        return this.svg;
   }
}

/*
    1. 스타일적용에 대한 디자인구성 필요
    2. 항상 부모요소의 크기와 위치를 따를것.
    3. 차트 생성에 관한 책임은 차트객체로 전달
    4. DATA 핸들링은 클라이언트에서 수행 ( 클라이언트는 차트 생성 호출만 하면 될 수 있도록 )
    5. 옵션(축,폰트,색상 등등)의 대한 디자인 구성 필요
    

    * 추가 디자인 사항
    - 툴팁이 옵션으로 가능하여야 한다.
    - svg에 다중 차트레이어가 적용 되어야 한다.
    - svg 상태 update가 되어야 한다.
*/
class syD3 {
    //차트 객체와 연결하기 위한 객체
    constructor(id,type,options){
        this.id = id;
        this.type = type;
        this.options = options;
        this.chartContainer;
        this.checkExist;
        this.update;
    }

    // init(){
    //     console.log(document.getElementById(this.id)+" init chart");
    // }
    create(){
        console.log(document.getElementById(this.id), " createing chart...");
        if(!validation(this.id,this.type,this.options)){
            return;
        }
        this.options = initOptions(this.options);
        if(this.type.toUpperCase() == 'BAR'){this.chartContainer = new Bar(this.id,this.options);}
        if(this.type.toUpperCase() == 'BAR_GROUP'){this.chartContainer = new Bar_Group(this.id,this.options);}
        if(this.type.toUpperCase() == 'BAR_OVERLAY'){this.chartContainer = new Bar_Overlay(this.id,this.options);}
        if(this.type.toUpperCase() == 'LINE'){this.chartContainer = new Line(this.id,this.options);}
        if(this.type.toUpperCase() == 'PIE'){this.chartContainer = new Pie(this.id,this.options);}
        if(this.type.toUpperCase() == 'RADAR'){this.chartContainer = new Radar(this.id,this.options);}
        this.chartContainer.draw(this.options.dataset);
        if(this.checkExist(this.id))ChartContainers.delete(this.id);
        
        //생성 차트객체 추가
        ChartContainers.set(this.id,this.chartContainer);
        return this.chartContainer;
    }

    //update
    update(syd3,newDataset){
        // console.log('get Container :: ', ChartContainers.get(syd3.id), " updated_data ::",newDataset)
        ChartContainers.get(syd3.id).clear(ChartContainers.get(syd3.id).svg)
        ChartContainers.get(syd3.id).draw(newDataset);
    }

    checkExist(id){return ChartContainers.get(id) != undefined;}
}

// 파라미터 예외 체크
function validation(id,type,options){
    let flag = true;

    // 1차 검증 ( 공통 속성값 체크 )
    if(id == null || type == null || options.domainXY == null || options.dataset == null){
        console.error("There is a null parameter, you should create all parameters ");
        flag = false;
    }

    // // 2차 검증 ( 타입별 필수 속성값 체크 )
    // if(type == 'line'){
    //     if(this){
    //         console.error('You should need to add "line" attribution in "style"');
    //         flag = false;

    //     }
    // }

    return flag;
}


function initOptions(options){
        /*z
            공통 기본값 설정
        */
        // 차트 표현값의 대한 위치
        if(options.MARGIN == null){
            options.MARGIN = {
                TOP:0,
                BOTTOM:30,
                LEFT:50,
                RIGHT:0
            }
        }

        // 보조라인 안주었으면
        if(options.SUB_LINE == null){
            options.SUB_LINE = {
                show:false,
                dataset:null
            }
        }

        // style 옵션을 안주었으면
        if(options.style == null){
            options.style = {//style 적용 가능
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
        }else{
            // fill 옵션 지정
            if(options.style.fill == null){
                options.style.fill = {
                    fill : function(d,i){
                      return "skyblue"
                    }
                }
            }
            // stroke 옵션 지정
            if(options.style.stroke == null){
                options.style.stroke = {
                    color : function(d,i){
                        return "skyblue"
                    },
                    width : 2.5
                }
            }
        }

        //차트 전체 높이, 너비
        options.CHART_WH = {
            w : 50,
            h : 50
        };
        return options;
}

numberFormat = (v)=>{
    return d3.format(",")(v);
}

