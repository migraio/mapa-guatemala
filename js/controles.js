function cargaBarras() {
    var partidos = DATA.DATOS_PRELIMINARES[0].RESULTADO_GLOBAL;
    var obj = DATA.DATOS_PRELIMINARES[0];
    var h_fcn = 0, h_une = 0;

    $.each(partidos, function (key, value) {

        switch (value.partido) {
            case "fcn":
                h_fcn = value.porcentaje;
                dataGlobal.push({partido: value.partido, porcentaje: value.porcentaje, votos: value.votos});
                break;
            case "une":
                h_une = value.porcentaje;
                dataGlobal.push({partido: value.partido, porcentaje: value.porcentaje, votos: value.votos});
                break;
        }


        var t = document.querySelector('#barra-vertical');
        t.content.querySelector('[data-partido]').setAttribute("id", value.partido);
        t.content.querySelector('[data-avatar]').setAttribute("src", "img/avatar-" + value.partido + ".png");
        t.content.querySelector('[data-detalle-pie]').setAttribute("class", "content-detalle-barras-" + value.partido);
        var clone = document.importNode(t.content, true);
        document.querySelector('.content-contenido-barras').appendChild(clone);

        detallePie(value.partido, value.porcentaje, value.votos, "detalle-pie-barras", "content-detalle-barras-" + value.partido);
        detallePie(value.partido, value.porcentaje, value.votos, "detalle-pie", "content-detalle-pie");

    });

    pieManual(dataGlobal, "Nivel Nacional", obj.mesas_computadas.replace("de", "/"));
    mesasComputadas = obj.mesas_computadas.replace("de", "/");

    var total;
    if (h_fcn > h_une) {
        total = h_fcn;
    } else {
        total = h_une;
    }


    $('#fcn div.bottom').height(185 * (h_fcn / total));                   //MAX 185px | MIN 0px
    $('#une div.bottom').height(185 * (h_une / total));                   //MAX 185px | MIN 0px
    $('#mesas div.top').css("width", obj.porcentaje_mesas + "%");         //MAX 255px | MIN 0px
    if (obj.porcentaje_mesas + 7 <= 100) {
        $('#cilindro-v').css("width", (obj.porcentaje_mesas + 7) + "%");  //MAX 255px | MIN 0px
    }
    $("[data-hora]").html('<img src="img/clock2.png"/>' + obj.hora_actualizacion + " <span data-fecha> </span>");
    $("[data-fecha]").html(obj.fecha_actualizacion);
    $("[data-nulos]").html(obj.votos_nulo);
    $("[data-blanco]").html(obj.votos_blanco);
    $("[data-padron]").html(obj.padron_electoral);
    $("[data-votantes]").html(obj.porcentaje_votantes);
    $("[data-mesas]").html(obj.mesas_computadas);
    $("[data-porcentaje-mesas]").html(obj.porcentaje_mesas + "%");
}

function pintaMapa(tipo) {
    var json;
    if (tipo) {
        json = DATA.MAPA_INTERACTIVO_DEPARTAMENTOS;
    } else {
        json = DATA.MAPA_INTERACTIVO_MUNICIPIOS;
    }
    $.each(json, function (key, value) {
        $("#" + value.id).css("fill", value.color);
        $("#" + value.id).addClassSVG("activo")
    });

}

function datosPie(tipo, id, destino) {
    $('.' + destino).empty();
    var json;
    var dataLocal = [];
    if (tipo) {
        json = DATA.MAPA_INTERACTIVO_DEPARTAMENTOS;
    } else {
        json = DATA.MAPA_INTERACTIVO_MUNICIPIOS;
    }

    $.each(json, function (key, value) {
        if (value.id == id) {
            $.each(json[key].RESULTADO, function (key, value) {

                detallePie(value.partido, value.porcentaje, value.votos, "detalle-pie", destino);
                switch (value.partido) {
                    case "fcn":
                        dataLocal.push({partido: value.partido, porcentaje: value.porcentaje});
                        break;
                    case "une":
                        dataLocal.push({partido: value.partido, porcentaje: value.porcentaje});
                        break;
                }
            });
            pie(dataLocal, id, value.mesas_computadas);
        }
    });
}

function datosPieManual(data, id, mesas, destino) {
    $('.' + destino).empty();
    $.each(data, function (key, value) {
        detallePie(value.partido, value.porcentaje, value.votos, "detalle-pie", destino);
    });
    pieManual(data, id, mesas);
}

function detallePie(partido, porcentaje, votos, template, destino) {
    var pie = document.querySelector('#' + template);
    pie.content.querySelector('[data-logo]').setAttribute("id", "logo-" + partido);
    pie.content.querySelector('[data-porcentaje]').setAttribute("class", "texto-porcentaje center  porcentaje-mesas-" + partido);
    pie.content.querySelector('[data-porcentaje]').textContent = porcentaje + "%";
    pie.content.querySelector('[data-votos]').textContent = votos + " votos";
    var clone = document.importNode(pie.content, true);
    document.querySelector('.' + destino).appendChild(clone);
}


function omitirAcentos(text) {
    var acentos = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç";
    var original = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc";
    for (var i = 0; i < acentos.length; i++) {
        text = text.replace(acentos.charAt(i), original.charAt(i));
    }
    return text;
}

function zoomOut() {
    $("#mapa_departamentos").fadeIn("fast");
    $("#mapa_municipios").children("path").hide();
    $("#regresar-mapa").fadeOut('fast');

    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;

    g.transition()
            .duration(750)
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
            .style("stroke-width", 2 / k + "px");

    datosPieManual(dataGlobal, "Nivel Nacional", mesasComputadas, "content-detalle-pie")

}

function zoomOutMuni(depto) {
    $("#regresar-mapa").fadeIn("fast");
    $("#regresar-mapa-municipio").hide();
    $("#titulo-pie em").html('');
    datosPie(true, depto, "content-detalle-pie");
    
}


function clickedDepto(d) {

    var depto = d.properties.Departamento;
    var select = omitirAcentos(d.properties.Departamento.replace(/ /g, '').toLowerCase());

    if ($("#" + select).is(".activo")) {

        //$("#mapa_departamentos").css("opacity","0.4");
        $("#mapa_departamentos").fadeOut("fast");
        $("#mapa_municipios").children("path").hide();
        $("#regresar-mapa, ." + select).show();
        $("#titulo-pie").html(depto).hide().fadeIn('fast');

        pintaMapa(false);
        datosPie(true, select, "content-detalle-pie");


        var x, y, k;
        if (d && centered !== d) {
            var centroid = path.centroid(d);
            x = centroid[0];
            y = centroid[1];
            k = 4;
            centered = d;
            if (select == "peten") {
                k = 1.4;
            }
            if (select == "izabal") {
                k = 2.4;
            }

            if (select == "altaverapaz" || select == "quiche") {
                k = 2.8;
            }

            if (select == "huehuetenango" || select == "escuintla" || select == "bajaverapaz") {
                k = 3.3;
            }

            if (select == "quetzaltenango" || select == "zacapa") {
                k = 4.5;
            }

            if (select == "chiquimula" || select == "jalapa" || select == "elprogreso" || select == "guatemala") {
                k = 5;
            }

            if (select == "retalhuleu" || select == "santarosa") {
                k = 5.3;
            }

            if (select == "suchitepequez" || select == "chimaltenango" || select == "chimaltenango") {
                k = 6;
            }

            if (select == "totonicapan" || select == "solola") {
                k = 7;
            }

            if (select == "sacatepequez") {
                k = 9;
            }
        }
        g.transition()
                .duration(750)
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
                .style("stroke-width", 1 / k + "px");
    }
}

function clickedMuni(d) {
    var muni = d.properties.Municipio;
    var depto = d.properties.Departamento;
    var select = omitirAcentos(depto.replace(/ /g, '').toLowerCase() + "_" + muni.replace(/ /g, '').toLowerCase());
    if ($("#" + select).is(".activo")) {
        $("#titulo-pie").html(depto + "<br/><em>" + muni + "</em>").hide().fadeIn('fast');

        datosPie(false, select, "content-detalle-pie");
        $("#regresar-mapa").hide();
        $("#regresar-mapa-municipio").replaceWith('<div id="regresar-mapa-municipio" class="center" onClick="zoomOutMuni(&quot;'+omitirAcentos(depto.replace(/ /g, '').toLowerCase())+'&quot;);">Regresar a '+depto+'</div>');
        
    }
}


/* MAPA */


var width = 300,
        height = 305,
        centered;


var svg = d3.select("#mapa-interactivo").append("svg")
        .attr("width", width)
        .attr("height", height);

var projection = d3.geo.mercator()
        .center([-85.5, 14.444])
        .scale(4000);

var path = d3.geo.path()
        .projection(projection);

var g = svg.append("g");

d3.json("json/deptos.json", function (error, guate) {
    if (error)
        return console.error(error);

    var deptos = topojson.feature(guate, guate.objects.departamentos).features;

    g.append("g")
            .attr("id", "mapa_departamentos")
            .selectAll("path")
            .data(deptos)
            .enter().append("path")
            .attr("d", path)
            .attr("alt", function (d) {
                return omitirAcentos(d.properties.Departamento.toLowerCase());
            })
            .attr("id", function (d) {
                return omitirAcentos(d.properties.Departamento.replace(/ /g, '').toLowerCase());
            })
            .on("click", clickedDepto);

    pintaMapa(true);
});


d3.json("json/muni.json", function (error, guate) {
    if (error)
        return console.error(error);
    var muni = topojson.feature(guate, guate.objects.municipios).features;
    g.append("g")
            .attr("id", "mapa_municipios")
            .selectAll("path")
            .data(muni)
            .enter().append("path")
            .attr("d", path)
            .attr("alt", function (d) {
                return omitirAcentos(d.properties.Municipio.toLowerCase());
            })
            .attr("class", function (d) {
                return omitirAcentos(d.properties.Departamento.replace(/ /g, '').toLowerCase()) + " hidden";
            }).attr("id", function (d) {
        var muni = omitirAcentos(d.properties.Municipio.replace(/ /g, '').toLowerCase());
        var depto = omitirAcentos(d.properties.Departamento.replace(/ /g, '').toLowerCase());
        return depto + "_" + muni;
    }).on("click", clickedMuni);
});


/* FIN MAPA */  


/* PIE */
var pieDataIni = [
    {partido: "fcn", porcentaje: 100},
    {partido: "une", porcentaje: 100}
];

var svg = d3.select("#pie").append("svg").attr("width", 200).attr("height", 105);

svg.append("g").attr("id", "seccion-pie");
Donut3D.draw("seccion-pie", data(pieDataIni), 100, 45, 85, 43, 15, 0);

function pieManual(arr, titulo, mesas) {
    Donut3D.transition("seccion-pie", data(arr), 85, 43, 15, 0);
    $("[data-titulo-pie]").html(titulo);
    $("[data-mesas-pie]").html(mesas);
}

function pie(arr, titulo, mesas) {
    Donut3D.transition("seccion-pie", data(arr), 85, 43, 15, 0);
    $("[data-mesas-pie]").html(mesas);
}

function data(arreglo) {
    return arreglo.map(function (d) {
        if (d.partido == "fcn") {
            return {value: d.porcentaje, color: "#0F2878"};
        } else {
            return {value: d.porcentaje, color: "#268237"};
        }
    });
}

/* CLASE PARA AGREGAR/QUITAR CLASES A LOS SVG*/
$.fn.addClassSVG = function (className) {
    $(this).attr('class', function (index, existingClassNames) {
        return existingClassNames + ' ' + className;
    });
    return this;
};

$.fn.removeClassSVG = function (className) {
    $(this).attr('class', function (index, existingClassNames) {
        var re = new RegExp(className, 'g');
        return existingClassNames.replace(re, '');
    });
    return this;
};