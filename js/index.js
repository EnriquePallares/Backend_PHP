/*
  Creación de una función personalizada para jQuery que detecta cuando se detiene el scroll en la página
*/
$.fn.scrollEnd = function(callback, timeout) {
    $(this).scroll(function() {
        var $this = $(this);
        if ($this.data('scrollTimeout')) {
            clearTimeout($this.data('scrollTimeout'));
        }
        $this.data('scrollTimeout', setTimeout(callback, timeout));
    });
};
/*
  Función que inicializa el elemento Slider
*/
function inicializarSlider() {
    $("#rangoPrecio").ionRangeSlider({
        type: "double",
        grid: false,
        min: 0,
        max: 100000,
        from: 200,
        to: 80000,
        prefix: "$"
    });
}

inicializarSlider();
/******************************************************************************************* */

//Función para insertar elemento con información de inmueble resultado de búsqueda
function insertCardInfo(address, city, phone, code, type, price) {

    stringHTML = '<div class="tituloContenido card itemMostrado">' +
        '  <img src="img/home.jpg">' +
        '  <div class="card-stacked">' +
        '    <p>' +
        '      <b>Dirección:</b> :direccion: <br>' +
        '      <b>Ciudad:</b> :ciudad: <br>' +
        '      <b>Teléfono:</b> :telefono: <br>' +
        '      <b>Código postal:</b> :codigoPostal: <br>' +
        '      <b>Tipo:</b> :tipo: <br>' +
        '      <b>Precio:</b> <span class="precioTexto"> :precio: </span> <br>' +
        '    </p>' +
        '    <div class="card-action">' +
        '      <a href="">VER MAS</a>' +
        '    </div>' +
        '  </div>' +
        '</div>'

    stringHTML = stringHTML.replace(':direccion:', address);
    stringHTML = stringHTML.replace(':ciudad:', city);
    stringHTML = stringHTML.replace(':telefono:', phone);
    stringHTML = stringHTML.replace(':codigoPostal:', code);
    stringHTML = stringHTML.replace(':tipo:', type);
    stringHTML = stringHTML.replace(':precio:', price);

    $('.colContenido').append(stringHTML);
}


//Función que establece en los elementos de formulario de tipo select
//las opciones posibles de acuerdo a la información existente
function setSelectElements() {
    $.ajax({
        url: 'api.php',
        type: 'get',
        data: { ciudad: "", tipo: "", precio: "", mostrar: "select" },
        success: function(response) {
            var jsonres = JSON.parse(response)
            $.each(jsonres.ciudades, function(i, item) {
                insertOptionInSelect($('#selectCiudad'), item)
            })
            $.each(jsonres.tipos, function(i, item) {
                insertOptionInSelect($('#selectTipo'), item)
            })
            $('select').material_select();
        }
    })
}

//Función que inserta elementos options dentro de un select
function insertOptionInSelect(element, itemValue) {
    stringHTML = '<option value=":valor:">:namevalor:</option>'
    stringHTML = stringHTML.replace(':valor:', String(itemValue));
    stringHTML = stringHTML.replace(':namevalor:', String(itemValue));
    element.append(stringHTML)
}

//Función que se ejecuta en success de consultas ajax para agregar visualización
// de inmuebles de acuerdo a la respuesta
function showData(response) {
    $('.itemMostrado').remove()
    var jsonres = JSON.parse(response)
    $.each(jsonres, function(i, item) {
        insertCardInfo(jsonres[i].Direccion,
            jsonres[i].Ciudad,
            jsonres[i].Telefono,
            jsonres[i].Codigo_Postal,
            jsonres[i].Tipo,
            jsonres[i].Precio)
    })
}

$(function() {
    setSelectElements()

    /*Mostrar Todos*/
    $('#mostrarTodos').on('click', function() {
        $.ajax({
            url: 'api.php',
            type: 'get',
            data: { ciudad: "", tipo: "", precio: "", mostrar: "true" },
            success: function(res) {
                showData(res)
            }
        })
    })

    /**Realización de búsqueda según el filtro */
    $('#submitButton').on('click', function(e) {
        e.preventDefault()
        ciudad = $('#selectCiudad').val()
        tipo = $('#selectTipo').val()
        precio = $('#rangoPrecio').val()
        $.ajax({
            url: 'api.php',
            type: 'get',
            data: { ciudad: ciudad, tipo: tipo, precio: precio, mostrar: "buscar" },
            success: function(res) {
                showData(res)
            }
        })
    })
});