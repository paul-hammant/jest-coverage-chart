colorslist = ["#FFA07A", "#20B2AA", "#778899", "#B0C4DE", "#F5F5DC", "#00FF00", "#000000", "#32CD32", "#FAF0E6", "#0000FF", "#FF00FF", "#8A2BE2", "#800000", "#A52A2A", "#66CDAA", "#DEB887", "#0000CD", "#5F9EA0", "#7FFF00", "#9370DB", "#D2691E", "#FF7F50", "#7B68EE", "#6495ED", "#48D1CC", "#DC143C", "#C71585", "#00FFFF", "#191970", "#00008B", "#F5FFFA", "#008B8B", "#FFE4E1", "#B8860B", "#A9A9A9", "#006400", "#000080", "#BDB76B", "#8B008B", "#808000", "#6B8E23", "#FF8C00", "#FFA500", "#9932CC", "#FF4500", "#8B0000", "#DA70D6", "#E9967A", "#EEE8AA", "#8FBC8F", "#98FB98", "#483D8B", "#AFEEEE", "#2F4F4F", "#DB7093", "#00CED1", "#9400D3", "#FFDAB9", "#FF1493", "#CD853F", "#00BFFF", "#FFC0CB", "#696969", "#DDA0DD", "#1E90FF", "#B0E0E6", "#B22222", "#800080", "#FFFAF0", "#FF0000", "#228B22", "#BC8F8F", "#FF00FF", "#4169E1", "#DCDCDC", "#FA8072", "#FFD700", "#FAA460", "#DAA520", "#2E8B57", "#808080", "#008000", "#A0522D", "#ADFF2F", "#C0C0C0", "#87CEEB", "#FF69B4", "#6A5ACD", "#CD5C5C", "#708090", "#4B0082", "#00FF7F", "#F0E68C", "#4682B4", "#E6E6FA", "#D2B48C", "#008080", "#7CFC00", "#D8BFD8", "#FFFACD", "#FF6347", "#ADD8E6", "#40E0D0", "#F08080", "#EE82EE", "#F5DEB3", "#FAFAD2", "#90EE90", "#D3D3D3", "#FFFF00", "#FFB6C1"];
charttooltipfields = {"total":{"show":true,"title":"Total","position":"right"},"covered":{"show":true,"title":"Covered","position":"right"},"skipped":{show:true,"title":"Skipped","position":"left"},"pct":{"show":true,"title":"Percentage","position":"right"}}
function getData(){
    $.ajax({type:"GET",url: "./data/coverage_history.json",data:JSON.stringify({"file":"./data/coverage_history.json"}),datatype:"json",
     success: function(data){ 
         gdata = data;
         generateChart(data,true,0,"branches");
     },
     complete : function(data)
      {
      },
     error: function(jqXHR, exception) 
      {
       console.log(jqXHR);
      }
   });
}

legendbbox = null;
chartposition = "left";
movelegendpositionby = -30;
spacingbetweenrows = 10;
gencharttimes = 1;
genstart = 0;
legendposition = "bottom";
selectedobj = null;

checkboxtickformat ="M 19.28125 5.28125 L 9 15.5625 L 4.71875 11.28125 L 3.28125 12.71875 L 8.28125 17.71875 L 9 18.40625 L 9.71875 17.71875 L 20.71875 6.71875 Z";

function generateChart(data,checklegendbox,lheight,selectedoption){
    newdata = {};
    plotoptions = {};
    data_ready = [];
    timedata = {};
    numberoftimes = 0;
    tickvalues = [];
    for (date in data){
         if (!timedata[new Date(date).getTime()]){
             timedata[new Date(date).getTime()] = true;
             numberoftimes++;
         }
         for (mainplot in data[date]){
              if (!newdata[mainplot]){
                  newdata[mainplot] = {};
              }
              newdata[mainplot][date] = data[date][mainplot];
         }
    }

    start = Object.keys(timedata)[0];
    end =   Object.keys(timedata)[Object.keys(timedata).length-1];
    start = parseFloat(start)-(60 * 60 * 24 * 1000 * 5);
    end = parseFloat(end)+(60 * 60 * 24 * 1000 * 5);
    timdata = [];
    tickvalues.push(new Date(start));
    timdata.push(start);
    for (tim in timedata){
         tickvalues.push(new Date(parseFloat(tim)));
         timdata.push(parseFloat(tim));
    }
    tickvalues.push(new Date(end));
    timdata.push(end);

    timestart = d3.min(timdata,function(d){return d});
    timeend = d3.max(timdata,function(d){return d});
    margins = {right:10,left:25,top:10,bottom:10}
    d3.select("#wrapper #chart").html('<div id = "charttitle"></div><div id = "chartarea"></div>');
    d3.select("#chartarea").style("width",$("#wrapper #chart").width()-margins.left-margins.right+(margins.left/2)+"px");
    d3.select("#chartarea").style("height",$("#wrapper #chart").height()-margins.top-margins.bottom+"px");
    d3.select("#chartarea").style("margin-left","10px");
    d3.select("#chartarea").style("margin-top",margins.top+"px");
    d3.select("#wrapper #chart").select("#charttitle").html("Line Chart");
    width = $("#chartarea").width()-margins.left-margins.right-(margins.left/2);
    height = $("#chartarea").height()-margins.top-margins.bottom;
    svg = d3.select("#chartarea").append("svg").attr("width",(width+margins.left+margins.right)+10).attr("height",height+margins.top+margins.bottom+movelegendpositionby)
    defs = svg.append("defs")
    gmain = svg.append("g")
               .attr("transform","translate("+(margins.left+10)+","+margins.top+")")
    svg.select("#legends").remove();
    g = gmain.append("g");
    if (legendbbox){
        chartheight = height - legendbbox.height - 60 - 15;
    }else{
        chartheight = height - lheight - 15;
    }
    if (width > 1000){
        movelegendpositionby = -30;
    }else{
        movelegendpositionby = -30;
    }
    defs.append("clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("x",-margins.left) 
        .attr("y",-margins.top) 
        .attr("width", width+margins.left+margins.right)
        .attr("height", height+margins.top+margins.bottom);

    defs.append("clipPath")
         .attr("id", "clipdiagram")
         .append("svg:rect")
         .attr("x","0") 
         .attr("y","0") 
         .attr("width", width)
         .attr("height", chartheight)

    gaxis = g.append("g");
    xdomain = [timestart,timeend];
    ydomain = [-1,102];
    xScale = d3.scaleLinear().range([0, width]).domain(xdomain);
    yScale = d3.scaleLinear().range([chartheight, 0]).domain(ydomain); 
    valueline = d3.line()
                          .x(function(d) { return xScale(d.name); })
                          .y(function(d) { return yScale(d.value); }); 

    
    xAxis = d3.axisBottom(xScale)
                  .tickFormat(d3.timeFormat("%Y-%m-%d"))
                  .tickValues(tickvalues)
    yAxis = d3.axisLeft(yScale).ticks(10);


    outermostRadius = (Math.min(width, height) / 2)-20;
    outermostRadius = outermostRadius * .80;

    xAxisGroup = gaxis.append("g")
               .attr("id","x-axis") 
               .attr("transform", "translate(0," + (chartheight) + ")")      
               .call(xAxis)


    yAxisGroup = gaxis.append("g") 
               .attr("id","y-axis") 
               .attr("transform", "translate(0,0)")   
               .call(yAxis)

    gaxis.append("g").attr("transform",
            "translate(" + ((width/2)-5) + " ," + 
                           (chartheight + margins.top + 22) + ")")
            .append("text")             
            .style("text-anchor", "middle")
            .text("Date")
            .style("font-size","12px")


    gaxis.append("text")
           .attr("transform", "rotate(-90)")
           .attr("y", 0 - margins.left - 10)
           .attr("x",0 - (chartheight / 2))
           .attr("dy", "1em")
           .style("text-anchor", "middle")
           .text("Percentage")
           .style("font-size","12px")    


    graph = g.append("g").attr("clip-path", "url(#clipdiagram)");

    for (mainplot in newdata){
         for (subplot in newdata[mainplot]){
              for (subsubplot in newdata[mainplot][subplot]){
                   if (!plotoptions[subsubplot]){
                       plotoptions[subsubplot] = true;
                   }
              }
         }
    }
    option = [];
    for (opt in plotoptions){
         option.push(opt);
    }
    $("#options").empty();
    html = "";
    for (iopt = 0; iopt < option.length; iopt++){  
         if (option[iopt].toUpperCase() === selectedoption.toUpperCase()){
             html += '<option selected id = "'+option[iopt]+'">'+option[iopt]+"</option>";
         }else{ 
            html += '<option id = "'+option[iopt]+'">'+option[iopt]+"</option>";
         }
    }
    $("#options").append(html);
    lines = {};
    points = {};
    colorcounter = 0;
    for (mainplot in newdata){
         totalperc = 0;
         for (subplot in newdata[mainplot]){
              for (subsubplot in newdata[mainplot][subplot]){
                   if (String(newdata[mainplot][subplot][subsubplot].pct).toUpperCase() === "UNKNOWN"){
                   }else{
                      totalperc += parseFloat(newdata[mainplot][subplot][subsubplot].pct);
                   }
              }
         }
         cdata = [];
         for (subplot in newdata[mainplot]){
              cdatapoint = {}; 
              cdatapoint.name = new Date(subplot).getTime();
              cdatapoint.main = mainplot;
              for (subsubplot in newdata[mainplot][subplot]){
                   if (subsubplot === selectedoption){
                       cdatapoint.value = parseFloat(newdata[mainplot][subplot][subsubplot].pct);
                       if (isNaN(cdatapoint.value)){
                           cdatapoint.value = 0;
                       }
                       cdatapoint.value = Math.round(cdatapoint.value * 100)/100; 
                   }
              }
              cdata.push(cdatapoint);
         }


         chartholder = graph.append("g").attr("transform","translate(0,0)").attr("id","main_"+mainplot.split("/").join("_"))

         lines[mainplot] = chartholder.append("path")
              .data([cdata])
              .attr("class", "line")
              .attr("d", valueline) 
              .attr("fill","none")
              .attr("stroke",function(d,i){dt = {}; dt.legendshapesizeradius = 5; dt.legendshape = "circle"; dt.legendshapesizewidth = 10; dt.legendshapesizeheight = 10; dt.legendfont = "Arial"; dt.legendfontsize = "10px";  dt.color = colorslist[colorcounter]; dt.name = mainplot; dt.data = d; d.key = mainplot; data_ready.push(dt);return colorslist[colorcounter]});

         points[mainplot]  = chartholder
              .selectAll("circle")
              .data(cdata)
              .enter()
              .append("circle")
              .attr("r",5)
              .attr("cx",function(d){return xScale(d.name);})
              .attr("cy",function(d){return yScale(d.value);})
              .attr("fill",function(d,i){return colorslist[colorcounter];})
              .attr("stroke-width","1px")
              .attr("stroke","green")
              .style("pointer-events","fill")
              .attr("vector-effect","non-scaling-stroke")
              .on("click",function(d){
                  tooltip(1,d,d3.select(this),this);      
              })
              .on("mouseover",function(d){
                  tooltip(2,d,d3.select(this),this);    
               })
              .on("mouseout",function(d){
                  if (selectedobj){
                      return; 
                  }
                  d3.select(this).style("opacity",1);
                  d3.select(this).style("cursor","default");
                  $("#tooltip").html("");
               })
         colorcounter++;
     }
     gridg = gaxis.append("g").attr("clip-path", "url(#clip)").append("g");

     gridg.call(grid, xScale, yScale);

     zoom = d3.zoom()
           .scaleExtent([1,30])// less than 1 means can resize smaller than  original size    
           .extent([
                [margins.left, margins.top],
                [width+margins.left-50, chartheight+margins.top]
           ])
           .translateExtent([
                [margins.left, margins.top],
                [width+margins.left-50, chartheight+margins.top]
           ])
           .on("zoom",zoomed);  
     svg.call(zoom); 

     movelegendboxX = 0;
     options = {};
     options.linelegendposition = "bottom"
     options.legendboxwidth = 100;
     options.legendboxheight = 100;
     options.legendshapesizewidth = 15;
     options.legendshapesizeheight = 15;
     options.spacingbetweenlegends = 10;
     options.spacingbetweenrows = 15;
     options.legendshape = "rect"  // can be rect or circle
     options.movelegendpositionby = 40;
     options.widthadjust = 0;

     let ticks = svg.select("#x-axis").selectAll(".tick text");     
     ticks.each(function(){ 
         ticks.attr("current",0);
         ticks.attr("opacity","1")
     }); 
     ticks.each(function(){
               if (d3.select(this).attr("opacity") == 1){ 
                   d3.select(this).attr("current",1);
                   let bbox1 = d3.select(this).node().getBoundingClientRect();
                   let mx1 = bbox1.x;
                   let mx2 = bbox1.x+bbox1.width+15;
                   ticks.each(function(){ 
                       if (d3.select(this).attr("current") == 0){ 
                           let bbox2 = d3.select(this).node().getBoundingClientRect();
                           let x1 = bbox2.x;
                           let x2 = bbox2.x+bbox2.width;
                           if (x1 >= mx1 && x1 <= mx2){ 
                               overlap = true;
                               d3.select(this).attr("opacity",0)
                           }
                       } 
                  });
                  d3.select(this).attr("current",0);
              } 
     });

     if (options.linelegendposition == "bottom"){
         movelegendboxY = 25;
         if (!legendbbox){
             legends = svg.append("g")
                          .attr("class", "legends") 
                          .attr("transform","translate(0,"+movelegendboxY+")")
             legendbbox = generatelegends(data_ready,legends,svg,margins,width,.5,.5,height,options.linelegendposition,0);
         }else{
             legends = svg.append("g")
                      .attr("class", "legends") 
                      .attr("transform","translate(0,"+movelegendboxY+")")

               if (options.linelegendposition == "top" || options.linelegendposition == "bottom"){
                   if (options.linelegendposition == "bottom"){
                       generatelegends(data_ready,legends,svg,margins,width,chartheight,.5,.5,options.linelegendposition,0)
                   }else{
                       generatelegends(data_ready,legends,svg,margins,width,chartheight,.5,.5,options.linelegendposition,0)
                   } 
               }else{
                   generatelegends(data_ready,legends,svg,margins,width,chartheight,.5,.5,options.linelegendposition,0)
               }
         }
     }
     if (legendbbox && options.linelegendposition == "bottom"){
         movex = (((svg.node().getBBox().x + svg.node().getBBox().width) - svg.select(".legends").node().getBBox().width)/2)-15;
         svg.select(".legends").attr("transform","translate("+movex+","+(d3.select(d3.select("svg").selectAll("g")._groups[0][0]).node().getBBox().height+movelegendpositionby)+")");
         if (genstart < gencharttimes){
             genstart++;
             generateChart(data,checklegendbox,parseFloat(legendbbox.height+20),selectedoption);
         }
     }
}

function tooltip(type,event,tobj,thobj){
      event.preventDefault();
      event.stopPropagation();
      if (type > 1){
          if (selectedobj){
              return;
          }
      }
      tobj.style("cursor","pointer");
      if (selectedobj){
          tobj.style("opacity",1);
          selectedobj = null;
          return; 
      }
      tobj.style("opacity",.1);
      var pos = d3.pointer(event,thobj);
      selectedobj = tobj;
      datagot = event.target.__data__;
      month = String(new Date(datagot.name).getMonth()+1);
      if (month.length < 2){
          month = "0"+month;
      }
      date = String(new Date(datagot.name).getDate());
      if (date.length < 2){
          date = "0"+date;
      }    
      sdate = new Date(datagot.name).getFullYear()+"-"+month+"-"+date;

      name = datagot.main
      perc = datagot.value;
      sdata = newdata[datagot.main][sdate];
      tiphtml = "<table style = 'background:rgba(0,0,0,.9);color:#fff;opacity:1;font-size:14px;'>";
      tiphtml += "<tr style = 'border:1px solid white'>";
      tiphtml += "<td style = 'width:75px;margin-top:1px;opacity:1;border-right:1px solid white;text-align:left;'>";
      tiphtml += "<b>"+name+"</b>";
      tiphtml += "</td>"
      tiphtml += "<td style = 'width:75px;margin-top:1px;opacity:1;border-right:1px solid white;text-align:left;'>";
      tiphtml += "<b>"+sdate+"</b>";
      tiphtml += "</td>"
      tiphtml += "<td style = 'width:75px;margin-top:1px;opacity:1;border-right:1px solid white;text-align:left;'>";
      tiphtml += "<b>"+perc+"</b>";
      tiphtml += "</td>"
      tiphtml += "</tr>";
      tiphtml += "<tr><td></td><td></td><td></td></tr>";
      tiphtml += "<tr><td></td><td></td><td></td></tr>";
      tiphtml += "<tr><td></td><td></td><td></td></tr>";
      for (title in sdata){
           tiphtml += "<tr style = 'border:1px solid white'>";
           tiphtml += "<td style = 'width:75px;margin-top:1px;opacity:1;border-right:1px solid white;text-align:left;'>";
           tiphtml += "<u>"+title+"</u>";
           tiphtml += "</td>"
           tiphtml += "</tr>";
           tiphtml += "<tr></tr>";
           for (item in charttooltipfields){
                if (charttooltipfields[item].hide){
                    continue;
                } 
                tiphtml += "<tr style = 'border:1px solid white'>";
                tiphtml += "<td style = 'width:75px;margin-top:1px;opacity:.5;border-right:1px solid white;text-align:left;'>";
                tiphtml += charttooltipfields[item].title;
                tiphtml += "</td>"
                tiphtml += "<td>";
                tiphtml += "</td>"
                tiphtml += "<td style = 'width:75px;margin-top:1px;opacity:.5;text-align:" +charttooltipfields[item].position+"'>";
                if (sdata[title][item]){
                    tiphtml += sdata[title][item];
                }  
                tiphtml += "</td>";
                tiphtml += "</tr>";
           }
      }
      tiphtml += "</table>";
      $("#tooltip").html(tiphtml);
}

function zoomed(event){
        tip.hide();
        t = event.transform;
        Object.keys(lines).forEach(function(line){
             lines[line].attr("transform",t)
        })
        Object.keys(points).forEach(function(point){
             points[point].attr("transform",t)
        })
        nx = xAxis.scale(event.transform.rescaleX(xScale));
        ny = yAxis.scale(event.transform.rescaleY(yScale))
        xAxisGroup.call(nx);
        yAxisGroup.call(ny); 
        gridg.attr("transform",t);
        gridg.selectAll("line").attr("stroke-width",1/t.k);
}

function wc_hex_is_light(color) {
    const hex = color.replace('#', '');
    const c_r = parseInt(hex.substr(0, 2), 16);
    const c_g = parseInt(hex.substr(2, 2), 16);
    const c_b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
    return brightness > 155;
}


function generatelegends(data,legends,svg,margins,svgwidth,svgheight,fillopacity,strokeopacity,legendposition,outermostRadius){  
  var itemWidth =80;
  var itemHeight = options.legendshapesizeheight;
  numberofrows = 1;
  llengths = 0;
  for (idata = 0; idata < data.length; idata++){
       llengths += 1;
  }
  var perrow = llengths/numberofrows;
  legend = legends.selectAll(".legend")
                      .data(data)
                      .enter()
                      .filter(function(d){
                          return true;           
                      }) 
                      .append("g")
                      .attr("id",function(d,i){return "lg_"+i;})  
                      .attr("rel",function(d,i){
                               return d.name;
                       })  
                      .attr("transform", function(d,i) { 
                             return "translate(" + i%perrow * itemWidth + "," + outermostRadius+(i%perrow * itemHeight) + ")"; 
                       })
                      .attr("class","legend");
  for (ishape = 0; ishape < legend._groups[0].length; ishape++){
       id = legend._groups[0][ishape].id; 
       rid = legends.select("#"+id).attr("rel");
       if (options.legendshape == "rect"){
           legendicongenerate(legends,id,"rect",options.legendshapesizewidth,options.legendshapesizeheight,fillopacity,strokeopacity,(parseFloat(options.legendshapesizewidth)+3),(parseFloat(options.legendshapesizeheight)/1.4),rid,parseFloat(options.legendshapesizeradius));
        } 
       if (options.legendshape == "circle"){
           legendicongenerate(legends,id,"rect",options.legendshapesizewidth,options.legendshapesizeheight,fillopacity,strokeopacity,(parseFloat(options.legendshapesizewidth)+3),(parseFloat(options.legendshapesizeheight)/1.4),rid,parseFloat(options.legendshapesizeradius));
       }
   }
   if (legendposition == "bottom"){
       newwidth = svgwidth - margins.left - margins.right - options.widthadjust;
       totalwidth = [];     
       rowelements = 0;       
       twidth = 0;
       widthcheckencountered = false;
       legends.selectAll("[id^=lg_]").each(function(){
          twidth += d3.select(this).node().getBBox().width+options.spacingbetweenlegends+20;
          widthcheck = false;
          if (twidth > newwidth){ 
              twidth -= d3.select(this).node().getBBox().width+options.spacingbetweenlegends+20;
              t = {}; 
              t.perrow = rowelements;
              t.width = twidth;
              totalwidth.push(t);  
              rowelements = 0;  
              twidth = 0;  
              widthcheckencountered = true;
              widthcheck = true;   
          } 
          if (!widthcheck){
              rowelements++;
              if (rowelements > perrow-1){
                  t = {}; 
                  t.perrow = rowelements;
                  t.width = twidth;
                  totalwidth.push(t);  
                  rowelements = 0;  
                  twidth = 0;  
             } 
          } 
       })
       if (twidth > 0){
           t = {}; 
           t.perrow = rowelements+1;
           t.width = twidth;
           totalwidth.push(t);  
       } 
       if (options.chartposition == "left" || options.chartposition == "right"){ 
           newwidth = d3.max(totalwidth,function(d){return d.width;});
       } 
       wstart = 0; 
       lstart = (outermostRadius * 2)+options.movelegendpositionby;
       rowelements = 0;
       wstart = 0;
       perrow = totalwidth[wstart].perrow; 
       object = [];
       legends.selectAll("[id^=lg_]").each(function(){
          object.push(d3.select(this))
          trans = d3.select(this).attr("transform");
          trans  = parsetransform(trans);
          transX = parseFloat(trans.translate[0]);
          transY = parseFloat(trans.translate[1]);
          trans  = "translate("+transX+","+lstart+")"
          d3.select(this).attr("transform",trans); 
          rowelements++; 
          if (rowelements > perrow-1){
              wstart++;   
              rowelements = 0;  
              object = []; 
              lstart += itemHeight+options.spacingbetweenrows;
              if (wstart < totalwidth.length){
                  perrow = totalwidth[wstart].perrow;
              } 
          }     
       });  
       if (rowelements > 0){
           wstart++;   
           for (iobject = 0; iobject < object.length; iobject++){
                id = object[iobject]._groups[0][0].id;
                trans = d3.select('[id="'+id+'"]').attr("transform");
                trans  = parsetransform(trans);
                transX = parseFloat(trans.translate[0]);
                transY = parseFloat(trans.translate[1]);
                trans  = "translate("+transX+","+lstart+")"
                d3.select('[id="'+id+'"]').attr("transform",trans); 
           }
       }   
       wstart = 0;
       respos = newwidth-totalwidth[wstart].width;
       if (options.chartposition == "center"){ 
           lstart = (respos/2)+margins.left;
       }     
       if (options.chartposition == "left"){ 
           lstart = margins.left;
       }     
       rowelements = 0;
       object = [];
       perrow = totalwidth[wstart].perrow;              
       legends.selectAll("[id^=lg_]").each(function(){
          object.push(d3.select(this))
          trans = d3.select(this).attr("transform");
          trans  = parsetransform(trans);
          transX = parseFloat(trans.translate[0]);
          transY = parseFloat(trans.translate[1]);
          trans  = "translate("+lstart+","+transY+")"
          d3.select(this).attr("transform",trans); 
          lstart += d3.select(this).node().getBBox().width+options.spacingbetweenlegends;
          rowelements++;
          if (rowelements > perrow-1){
              wstart++
              object = [];
              if (wstart < totalwidth.length){
                  respos = newwidth-totalwidth[wstart].width;
                  lstart = (respos/2)+margins.left;
                  if (lstart <= 0){
                      lstart = margins.left;
                  }  
                  perrow = totalwidth[wstart].perrow;
              } 
              rowelements = 0;  
          } 
       }); 
       if (wstart > 0 && wstart < totalwidth.length){
           respos = newwidth-totalwidth[wstart].width;
           perrow = totalwidth[wstart].perrow;
           lstart = (respos/2)+margins.left;
           if (lstart <= 0){
               lstart = margins.left;
           }  
           for (iobject = 0; iobject < object.length; iobject++){
                id = object[iobject]._groups[0][0].id;
                trans = d3.select('[id="'+id+'"]').attr("transform");
                trans  = parsetransform(trans);
                transX = parseFloat(trans.translate[0]);
                transY = parseFloat(trans.translate[1]);
                trans  = "translate("+lstart+","+transY+")"               
                d3.select('[id="'+id+'"]').attr("transform",trans); 
                lstart += d3.select('[id="'+id+'"]').node().getBBox().width+options.spacingbetweenlegends;
           }
       }  
       bbox = legends.node().getBBox();
       bbox1 = d3.select(svg._groups[0][0]).node().getBBox();
       rwidth = (svg.node().parentNode.parentNode.parentNode.offsetWidth- bbox.width)/2;
       if (rwidth < 0){
           rwidth = 0;
       }
       trans = d3.select(legends._groups[0][0]).attr("transform");
       trans  = parsetransform(trans);
       transX = parseFloat(movelegendboxX)+rwidth;
       transY = parseFloat(trans.translate[1]);
       d3.select(legends._groups[0][0]).attr("transform","translate("+transX+","+transY+")");
       first = true;
       wwidth = 0;
       ttrans = -1;
       etodo = [];
       done = false;
       legends.selectAll("[id^=lg_]").each(function(element){
          trans = d3.select(this).attr("transform");    
          trans  = parsetransform(trans);
          transX = parseFloat(trans.translate[0]);
          transY = parseFloat(trans.translate[1]);
          if (first){
              ttrans = transY
          }
          if (ttrans != transY && !first){
              ttrans = transY;
              diff = ((svgwidth - wwidth)/2)-20;
              cumwidth = 0;
              etodo.forEach(function(element){
                 tran = d3.select(element._groups[0][0]).attr("transform"); ;
                 tran = parsetransform(tran);
                 tranX = parseFloat(tran.translate[0]); 
                 tranY = parseFloat(tran.translate[1]);
                 d3.select(element._groups[0][0]).attr("transform","translate("+(diff+cumwidth)+","+tranY+")");
                 cumwidth  += d3.select(element._groups[0][0]).node().getBBox().width+options.spacingbetweenlegends;
              });
              etodo = [];
              wwidth = 0;
              done = false;          
          }
          first = false;
          done = true;
          wwidth += d3.select(this).node().getBBox().width+options.spacingbetweenlegends;
          etodo.push(d3.select(this));

       }) 
       if (done){
           ttrans = transY;
           diff = ((svgwidth - wwidth)/2)-20;
           cumwidth = 0;
           etodo.forEach(function(element){
              tran = d3.select(element._groups[0][0]).attr("transform"); ;
              tran = parsetransform(tran);
              tranX = parseFloat(tran.translate[0]); 
              tranY = parseFloat(tran.translate[1]);
              d3.select(element._groups[0][0]).attr("transform","translate("+(diff+cumwidth)+","+tranY+")");
              cumwidth  += d3.select(element._groups[0][0]).node().getBBox().width+options.spacingbetweenlegends;
           });
           etodo = [];
           wwidth = 0;
           done = false;
       }
   }
    props = {};
    props.width = 0;
    props.height = 0
    bbox = d3.select(svg.node().parentNode.parentNode).select(".legends").node().getBBox();
    props.width = bbox.width;
    props.height = bbox.height+10;
console.log(props);
    return props; 
}


function legendicongenerate(legends,id,type,legendshapesizewidth,legendshapesizeheight,fillopacity,strokeopacity,x,y,rid,r){
   legends.select("#"+id).append(type)
          .attr("width",legendshapesizewidth)
          .attr("height",legendshapesizeheight)
          .attr("r",parseFloat(options.legendshapesizeradius))
          .attr("fill", function(d,i) { 
              return d.color 
          })
          .style("fill-opacity",fillopacity)
          .style("stroke-opacity",strokeopacity)
          .style("pointer-events","fill")
          .on("mouseover",function(d){
              d3.select(this).style("cursor","pointer");
          })
          .on("mouseout",function(d){
              d3.select(this).style("cursor","default");
          })
          .on("click",function(d){
              if (d3.select(d3.select(this)._groups[0][0].parentNode).select("#tick").style("display") !== "none"){
                  d3.select(d3.select(this)._groups[0][0].parentNode).select("#tick").style("display","none");
                  d3.select("#main_"+d.target.__data__.name.split("/").join("_")).style("display","none");
              }else{
                  d3.select(d3.select(this)._groups[0][0].parentNode).select("#tick").style("display","block");
                  d3.select("#main_"+d.target.__data__.name.split("/").join("_")).style("display","block");
              }
          });
    legends.select("#"+id).append('text')
           .attr("x", x)
           .attr("y",y)
           .text(function(d) { return rid; })
           .style("font-family",function(d){
              return "Arial"  
           }) 
           .style("font-size",function(d){
              return "12px"  
           }) 
           .style("pointer-events","fill")
           .on("mouseover",function(d){
               d3.select(this).style("cursor","pointer");
           })
           .on("mouseout",function(d){
               d3.select(this).style("cursor","default");
           })
           .on("click",function(d){
               if (d3.select(d3.select(this)._groups[0][0].parentNode).select("#tick").style("display") !== "none"){
                   d3.select(d3.select(this)._groups[0][0].parentNode).select("#tick").style("display","none");
                   d3.select("#main_"+d.target.__data__.name.split("/").join("_")).style("display","none");
               }else{
                   d3.select(d3.select(this)._groups[0][0].parentNode).select("#tick").style("display","block");
                   d3.select("#main_"+d.target.__data__.name.split("/").join("_")).style("display","block");
               }
           });

     legends.select("#"+id).append("g")
            .attr("transform","translate(2,2) scale(.5)")
            .append("path")
            .attr("id","tick")
            .attr("d",checkboxtickformat)
            .style("fill",function(d){
               if (wc_hex_is_light(d.color)){
                   return "#000000"
               }else{
                   return "#ffffff"
               }
            })
            .style("stroke",function(d){
               if (wc_hex_is_light(d.color)){
                   return "#000000"
               }else{
                   return "#ffffff"
               }
            })
            .style("pointer-events","fill")
            .on("mouseover",function(d){
                d3.select(this).style("cursor","pointer");
            })
            .on("mouseout",function(d){
                d3.select(this).style("cursor","default");
            })
            .on("click",function(d){
                if (d3.select(d3.select(this)._groups[0][0].parentNode).select("#tick").style("display") !== "none"){
                    d3.select(d3.select(this)._groups[0][0].parentNode).select("#tick").style("display","none");
                    d3.select("#main_"+d.target.__data__.name.split("/").join("_")).style("display","none");
                }else{
                    d3.select(d3.select(this)._groups[0][0].parentNode).select("#tick").style("display","block");
                    d3.select("#main_"+d.target.__data__.name.split("/").join("_")).style("display","block");
                }
           });
}



grid = (g, x, y) => g
        .attr("stroke", "currentColor")
        .attr("stroke-opacity", 0.1)
        .call(g => g
          .selectAll(".xgrid")
          .data(x.domain())
          .join(
            enter => enter.append("line").attr("class", "x").attr("y2", chartheight),
            update => update,
            exit => exit.remove()
          )
          .attr("x1", d => 0.5 + x(d))
         .attr("x2", d => 0.5 + x(d)))
         .call(g => g
           .selectAll(".ygrid")
           .data(y.ticks(10))
           .join(
             enter => enter.append("line").attr("class", "y").attr("x2", width),
             update => update,
             exit => exit.remove()
           )
           .attr("y1", d => 0.5 + y(d))
           .attr("y2", d => 0.5 + y(d)));


function parsetransform(a){
    var b={};
    for (var i in a = a.match(/(\w+\((\-?\d+\.?\d*e?\-?\d*,?)+\))+/g))
    {
        var c = a[i].match(/[\w\.\-]+/g);
        b[c.shift()] = c;
    }
    return b;
}

$(document).on("change","#options",function(d){
   sel = $(this).val();
   selectedobj = null;
   $("#tooltip").html("");
   generateChart(gdata,true,0,sel);
});


getData();




