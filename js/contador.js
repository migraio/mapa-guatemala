
function ini(){
    $("#contador").show();
    /*var fecha=new Date('2015','08','25','07','00','00')
    var hoy=new Date()*/
    var dias=0
    var horas=0
    var minutos=0
    var segundos=0
    var aux=false;

    if (fecha>hoy){
        var diferencia=(fecha.getTime()-hoy.getTime())/1000
        dias=Math.floor(diferencia/86400)
        diferencia=diferencia-(86400*dias)
        horas=Math.floor(diferencia/3600)
        diferencia=diferencia-(3600*horas)
        minutos=Math.floor(diferencia/60)
        diferencia=diferencia-(60*minutos)
        segundos=Math.floor(diferencia)

        if(dias != 0){
            textoDias="días";
        }else{
            textoDias="día";
        }
        if(horas != 0){
            textoHoras="horas";
        }else{
            textoHoras="hora";
        }
        document.querySelector('[txt-dias]').textContent = textoDias;
        document.querySelector('[txt-horas]').textContent = textoHoras;
        document.querySelector('[data-titulo]').textContent = 'Faltan';
        document.querySelector('[data-dias]').textContent = dias;
        document.querySelector('[data-horas]').textContent = horas;
        document.querySelector('[data-mins]').textContent = minutos;
        document.querySelector('[data-segs]').textContent = segundos;


        if (dias>0 || horas>0 || minutos>0 || segundos>0){
            setTimeout(ini,1000)
        }

    }else{
        //document.querySelector('[data-titulo]').textContent = 'HOY';
        //document.querySelector('[data-dias]').textContent = '0';
        //document.querySelector('[data-horas]').textContent = '0';
        //document.querySelector('[data-mins]').textContent = '0';
        //document.querySelector('[data-segs]').textContent = '0';

    }

}
