colors=new Array(
"#ffe0ff",
"#e0ffe0",
"#e0e0ff",
"#ffb0b0"
);

degrees=new Array(
{ids:new Array("1"), fillColor:new Array("white")},
{ids:new Array("2-","9-"), fillColor:new Array(colors[1],colors[3])},
{ids:new Array("2","9"), fillColor:new Array(colors[2],colors[3])},
{ids:new Array("2+", "3-","9+"), fillColor:new Array(colors[0],colors[1],colors[3])},
{ids:new Array("4-","3","11-"), fillColor:new Array(colors[1],colors[2],colors[3])},
{ids:new Array("4","11"), fillColor:new Array(colors[2],colors[3])},
{ids:new Array("4+","5-","11+"), fillColor:new Array(colors[0],colors[1],colors[3])},
{ids:new Array("5"), fillColor:new Array(colors[2])},
{ids:new Array("5+","6-","13-"), fillColor:new Array(colors[0],colors[1],colors[3])},
{ids:new Array("7--","6","13"), fillColor:new Array(colors[1],colors[2],colors[3])},
{ids:new Array("6+","7-","13+"), fillColor:new Array(colors[0],colors[1],colors[3])},
{ids:new Array("7M"), fillColor:new Array(colors[2])}
);

predef_scales=new Array(
{id:"custom", degrees:""},
{id:"ionian (major mode 1)", degrees:"1,2,3,4,5,6,7M"},
{id:"dorian (major mode 2)", degrees:"1,2,3-,4,5,6,7-"},
{id:"phrygian (major mode 3)", degrees:"1,2-,3-,4,5,6-,7-"},
{id:"lydian (major mode 4)", degrees:"1,2,3,4+,5,6,7M"},
{id:"mixolydian (major mode 5)", degrees:"1,2,3,4,5,6,7-"},
{id:"aeolian (major mode 6)", degrees:"1,2,3-,4,5,6-,7-"},
{id:"locrian (major mode 7)", degrees:"1,2-,3-,4,5-,6-,7-"},

{id:"melodic minor", degrees:"1,2,3-,4,5,6,7M"},
{id:"dorian b9 (melodic minor mode 2)", degrees:"1,2-,3-,4,5,6,7-"},
{id:"lydian #5 (melodic minor mode 3)", degrees:"1,2,3,4+,5+,6,7M"},
{id:"lydian b7 (melodic minor mode 4)", degrees:"1,2,3,4+,5,6,7-"},
{id:"mixolydian b13 (melodic minor mode 5)", degrees:"1,2,3,4,5,6-,7-"},
{id:"locrian &#9838;9 (melodic minor mode 6)", degrees:"1,2,3-,4,5-,6-,7-"},
{id:"altered (melodic minor mode 7)", degrees:"1,2-,3-,4-,5-,6-,7-"},

{id:"harmonic minor", degrees:"1,2,3-,4,5,6-,7M"},
{id:"locrian &#9838;13 (harmonic minor mode 2)", degrees:"1,2-,3-,4,5-,6,7-"},
{id:"ionian #5 (harmonic minor mode 3)", degrees:"1,2,3,4,5+,6,7M"},
{id:"dorian #11 (harmonic minor mode 4)", degrees:"1,2,3-,4+,5,6,7-"},
{id:"mixolydian b9 b13 (harmonic minor mode 5)", degrees:"1,2-,3,4,5,6-,7-"},
{id:"lydian #9 (harmonic minor mode 6)", degrees:"1,9+,3,4+,5,6,7M"},
{id:"altered bb7 (harmonic minor mode 7)", degrees:"1,2-,3-,4-,5-,6-,7--"},

{id:"harmonic major", degrees:"1,2,3,4,5,6-,7M"},
{id:"dorian b5 (harmonic major mode 2)", degrees:"1,2,3-,4,5-,6,7-"},
{id:"phrygian b4 (harmonic major mode 3)", degrees:"1,2-,3-,4-,5,6-,7-"},
{id:"lydian b3 (harmonic major mode 4)", degrees:"1,2,3-,4+,5,6,7M"},
{id:"mixolydian b9 (harmonic major mode 5)", degrees:"1,2-,3,4,5,6,7-"},
{id:"lydian #2 #5 (harmonic major mode 6)", degrees:"1,2+,3,4+,5+,6,7M"},
{id:"locrian bb7 (harmonic major mode 7)", degrees:"1,2-,3-,4,5-,6-,7--"},

{id:"major pentatonic", degrees:"1,2,3,5,6"},
{id:"minor pentatonic", degrees:"1,3-,4,5,7-"},
{id:"minor 6 pentatonic", degrees:"1,3-,4,5,6"},

{id:"1-2-3-4", degrees:"1,2,3,5"},
{id:"1-3b-4-5", degrees:"1,3-,4,5"},

{id:"major bop", degrees:"1,2,3,4,5,6-,6,7M"},
{id:"mixolydian bop", degrees:"1,2,3,4,5,6,7-,7M"}
);

offset=new Array(10,10);
fretssize=new Array(25,20);
posradius=10;
font="10px Arial";
startdegree=0;
startdrag=false;
dragref=new Array(0,0);

function init()
{
    var canvas=document.getElementById("main-canvas");
    canvas.addEventListener("mousedown", cb_mouse_down,false);
    canvas.addEventListener("mouseup", cb_mouse_up,false);
    canvas.addEventListener("mousemove", cb_mouse_move,false);
    document.getElementById("line1").style.backgroundColor=colors[0];
    document.getElementById("line2").style.backgroundColor=colors[1];
    document.getElementById("line3").style.backgroundColor=colors[2];
    document.getElementById("line4").style.backgroundColor=colors[3];
    // predefined scales
    var predef=document.getElementById("predefined-scales");
    while (predef.firstChild)
    {
        predef.removeChild(predef.firstChild);
    }
    var optionsColors=new Array("white", "#e0e0ff");
    var colorIndex=0;
    for (var i=0; i<predef_scales.length; i++)
    {
        var option=document.createElement("option");
        option.innerHTML=predef_scales[i].id;
        option.style.backgroundColor=optionsColors[colorIndex++];
        if (colorIndex==optionsColors.length)
        {
            colorIndex = 0;
        }
        option.setAttribute("value", "predef-"+i.toString());
        predef.appendChild(option);
    }
    predef.value="predef-0";
    cb_predef_changed();
    var canvassize=document.getElementById("canvas-size");
    canvassize.value="1200x800";
    cb_canvas_size_changed();
    reinit_canvas();
}

function cb_predef_changed()
{
    var predef=document.getElementById("predefined-scales");
    for (var i=0; i<predef_scales.length; i++)
    {
        if (predef.value=="predef-"+i.toString())
        {
            var split=predef_scales[i].degrees.split(",");
            for (var j=0; j<degrees.length; j++)
            {
                for(k=0; k<degrees[j].ids.length; k++)
                {
                    if (split.indexOf(degrees[j].ids[k])==-1)
                    {
                        document.getElementById("chk-"+degrees[j].ids[k]).checked=false;
                    }
                    else
                    {
                        document.getElementById("chk-"+degrees[j].ids[k]).checked=true;
                    }
                }
            }
            break;
        }
    }
    reinit_canvas();
}

function cb_canvas_size_changed()
{
    var canvassize=document.getElementById("canvas-size");
    var canvas=document.getElementById("main-canvas");
    var size=canvassize.value.split("x");
    canvas.width=size[0];
    canvas.height=size[1];
    reinit_canvas();
}

function cb_mouse_down(_event)
{
    var fretscount=parseInt(document.getElementById("frets-count").value);
    var stringscount=parseInt(document.getElementById("strings-count").value);
    var canvas=document.getElementById("main-canvas");
    offset[0]=(canvas.width-fretscount*fretssize[0])/2;
    offset[1]=(canvas.height-(stringscount-1)*fretssize[1])/2;
    startdrag=true;
    dragref[0]=_event.clientX;
    dragref[1]=_event.clientY;
}

function cb_mouse_up(_event)
{
    startdrag=false;
}

function cb_mouse_move(_event)
{
    var tuningdifference=parseInt(document.getElementById("tuning-difference").value);
    if (startdrag)
    {
        var changed=false;
        dt=new Array(_event.clientX-dragref[0],_event.clientY-dragref[1]);
        if (dt[0]>fretssize[0] || dt[0]<-fretssize[0])
        {
            if (dt[0]>fretssize[0])
            {
                startdegree=startdegree==0?11:startdegree-1;
            }
            else
            {
                startdegree=(startdegree+1)%12;
                dragref[0]=_event.clientX;
                changed=true;
            }
        }
        if (dt[1]>fretssize[1] || dt[1]<-fretssize[1])
        {
            if (dt[1]>fretssize[1])
            {
                startdegree=(startdegree+tuningdifference)%12;
            }
            else
            {
                startdegree-=tuningdifference;
                if (startdegree<0)
                {
                    startdegree=11+startdegree+1;
                }
            }
            dragref[1]=_event.clientY;
            changed=true;
        }
        if (changed)
        {
            reinit_canvas();
        }
    }
}

function cb_tuningdifference_change(_q)
{
    var bounds=new Array(0,11);
    var actual=parseInt(document.getElementById("tuning-difference").value);
    if ((_q>0 && actual<bounds[1]) || (_q<0 && actual>bounds[0]))
    {
        actual+=_q;
    }
    document.getElementById("tuning-difference").value=actual.toString();
    reinit_canvas();
}

function cb_stringscount_change(_q)
{
    var bounds=new Array(1,24);
    var actual=parseInt(document.getElementById("strings-count").value);
    if ((_q>0 && actual<bounds[1]) || (_q<0 && actual>bounds[0]))
    {
        actual+=_q;
    }
    document.getElementById("strings-count").value=actual.toString();
    reinit_canvas();
}

function cb_fretscount_change(_q)
{
    var bounds=new Array(1,48);
    var actual=parseInt(document.getElementById("frets-count").value);
    if ((_q>0 && actual<bounds[1]) || (_q<0 && actual>bounds[0]))
    {
        actual+=_q;
    }
    document.getElementById("frets-count").value=actual.toString();
    reinit_canvas();
}

function cb_adjust_chk(_caller)
{
    document.getElementById("predefined-scales").firstChild.selected=true;
    if(_caller.checked)
    {
        for (var i=0;i<degrees.length;i++)
        {
            for (var j=0;j<degrees[i].ids.length;j++)
            {
                if (_caller.id==("chk-"+degrees[i].ids[j]))
                {
                    for (var k=0;k<degrees[i].ids.length;k++)
                    {
                        if (k==j)
                        {
                            continue;
                        }
                        document.getElementById("chk-"+degrees[i].ids[k]).checked=false;
                    }
                    break;
                }
            }
        }
    }
    reinit_canvas();
}

function cb_display_degrees()
{
    reinit_canvas();
}

function draw_frets(_ctx,_x,_y,_fretscount,_stringscount,_background)
{
    _ctx.beginPath();
    _ctx.fillStyle=_background;
    _ctx.fillRect(_x,_y,_fretscount*fretssize[0],(_stringscount-1)*fretssize[1]);
    _ctx.fill();
    _ctx.beginPath();
    for (i=0;i<_stringscount;i++)
    {
        _ctx.moveTo(_x,_y+i*fretssize[1]);
        _ctx.lineTo(_x+fretssize[0]*_fretscount,_y+i*fretssize[1]);
    }
    for (i=0;i<_fretscount+1;i++)
    {
        _ctx.moveTo(_x+i*fretssize[0],_y);
        _ctx.lineTo(_x+i*fretssize[0],_y+(_stringscount-1)*fretssize[1]);
    }
    if (_stringscount==1)
    {
        for(i=0;i<_fretscount+1;i++)
        {
            _ctx.moveTo(_x+i*fretssize[0],_y-fretssize[1]/4);
            _ctx.lineTo(_x+i*fretssize[0],_y+(_stringscount-1)*fretssize[1]+fretssize[1]/4);
        }
    }
    _ctx.stroke();
}

function reinit_canvas()
{
    var fretscount=parseInt(document.getElementById("frets-count").value);
    var stringscount=parseInt(document.getElementById("strings-count").value);
    var canvas=document.getElementById("main-canvas");
    var ctx=canvas.getContext('2d');
    var i=0;
    var j=0;
    offset[0]=(canvas.width-fretscount*fretssize[0])/2;
    offset[1]=(canvas.height-(stringscount-1)*fretssize[1])/2;
    ctx.strokeStyle="black";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw_frets(ctx,offset[0],offset[1],fretscount,stringscount,"white");
    draw_scale(offset,startdegree);
    // horizontal extent
    if (document.getElementById("h-extent").checked)
    {
        // left
        draw_frets(ctx,offset[0]-(fretscount+1)*fretssize[0],offset[1],fretscount,stringscount,"lightgray");
        alt_startdegree=startdegree-fretscount+1;
        if (alt_startdegree<0)
        {
            alt_startdegree=11+alt_startdegree+1;
        }
        draw_scale(new Array(offset[0]-(fretscount+1)*fretssize[0],offset[1]),alt_startdegree);
        // right
        draw_frets(ctx,offset[0]+(fretscount+1)*fretssize[0],offset[1],fretscount,stringscount,"lightgray");
        alt_startdegree=(startdegree+fretscount-1)%12;
        draw_scale(new Array(offset[0]+(fretscount+1)*fretssize[0],offset[1]),alt_startdegree);
    }
    // vertical extent
    if (document.getElementById("v-extent").checked)
    {
        // up
        draw_frets(ctx,offset[0],offset[1]-stringscount*fretssize[1]-fretssize[1]*0.5,fretscount,stringscount,"lightgray");
        alt_startdegree=(startdegree+(stringscount-1)*5)%12;
        draw_scale(new Array(offset[0],offset[1]-stringscount*fretssize[1]-fretssize[1]*0.5),alt_startdegree);
        // down
        draw_frets(ctx,offset[0],offset[1]+stringscount*fretssize[1]+fretssize[1]*0.5,fretscount,stringscount,"lightgray");
        alt_startdegree=startdegree-(stringscount-1)*5;
        while (alt_startdegree<0)
        {
            alt_startdegree+=12;
        }
        draw_scale(new Array(offset[0],offset[1]+stringscount*fretssize[1]+fretssize[1]*0.5),alt_startdegree);
    }
}

function draw_pos(_offset,_fret,_string,_fillColor,_label)
{
    var ctx=document.getElementById("main-canvas").getContext('2d');
    var stringscount=parseInt(document.getElementById("strings-count").value);
    var textsize=ctx.measureText(_label);
    var displaydegrees=document.getElementById("display-degrees").checked;
    ctx.font=font;
    ctx.beginPath();
    ctx.fillStyle=_fillColor
    ctx.arc(_offset[0]+(_fret-1)*fretssize[0]+fretssize[0]/2,_offset[1]+(_string-1)*fretssize[1],posradius,0,Math.PI*2,false);
    ctx.fill();
    ctx.beginPath();
    ctx.strokeStyle="black";
    ctx.arc(_offset[0]+(_fret-1)*fretssize[0]+fretssize[0]/2,_offset[1]+(_string-1)*fretssize[1],posradius,0,Math.PI*2,false);
    ctx.stroke();
    if (displaydegrees)
    {
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        ctx.fillStyle="black";
        ctx.fillText(_label,_offset[0]+(_fret-1)*fretssize[0]+fretssize[0]/2,_offset[1]+(_string-1)*fretssize[1]);
    }
}

function draw_scale(_offset,_startdegree)
{
    var tuningdifference=parseInt(document.getElementById("tuning-difference").value);
    var fretscount=parseInt(document.getElementById("frets-count").value);
    var stringscount=parseInt(document.getElementById("strings-count").value);
    var rootpos=new Array(1,stringscount);
    var cpt=0;
    for (var i=stringscount;i>0;i--)
    {
        for (var j=0;j<fretscount;j++)
        {
            var degree=(((stringscount-i)*tuningdifference+j)+_startdegree)%12;
            for (var k=0;k<degrees[degree].ids.length;k++)
            {
                if (document.getElementById("chk-"+degrees[degree].ids[k]).checked)
                {
                    draw_pos(_offset,j+1,i,degrees[degree].fillColor[k],degrees[degree].ids[k]);
                }
            }
        }
    }
}
