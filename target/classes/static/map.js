var myMap;

// Дождёмся загрузки API и готовности DOM.
ymaps.ready(init);
ymaps.ready(['ext.paintOnMap']);

function init () {
    myMap = new ymaps.Map('map', {
        center:[55.76, 37.64], // Москва
        zoom:10,
        controls: []
    });

    var deleteAllButton = new ymaps.control.Button({
        data: {
            content: 'Delete all'
        },
        options: {
            selectOnClick: false
        }
    });

    myMap.controls.add(deleteAllButton, {float: 'left'});

    var reloadButton = new ymaps.control.Button({
        data: {
            content: 'Reload all'
        },
        options: {
            selectOnClick: false,
            maxWidth: [30, 100, 150]
        }
    });

    myMap.controls.add(reloadButton, {float: 'left'});

    deleteAllButton.events.add('click', function (e){
        const url = 'http://localhost:8080/geoObjects/deleteall';
        $.ajax({
            url: url,
            type: 'DELETE'
        });
        myMap.geoObjects.removeAll();
    });

    reloadButton.events.add('click', function (e){
        myMap.geoObjects.removeAll();
        Initialize();
    });

    function ParsePoints(arg){
        var arr = [];
        arr = arg.split(',');
        return arr;
    }

    function ParseGeoObjects(arg) {
        var DataSource = arg.split(',');
        var OuterArray = [];
        for (let i = 0; i < DataSource.length / 2; i++){
            OuterArray[i] = [DataSource[2*i],DataSource[2*i+1]];
        }
        return OuterArray;
    }

    function Initialize(){
        var array = [];
        array.splice();

        const response = $.ajax({
            url: 'http://localhost:8080/geoObjects/all',
            type: 'GET'
            }
        );
        response.done(function (result) {
            array.push(...result);
            DrawAll(result);
        });
    }
    function DrawAll(array){

        for (let i = 0; i < array.length; i++) {
            switch(array[i].type){
                case 'point':
                    CreatePoint(ParsePoints(array[i].coords),array[i].id);
                    break;
                case 'polygon':
                    CreatePolygon(ParseGeoObjects(array[i].coords),array[i].id);
                    break;
                case 'polyline':
                    CreatePolyline(ParseGeoObjects(array[i].coords),array[i].id);
                    break;
                default:
                    alert('Error');
            }
        }
    }

    Initialize();


    var newElem = new ymaps.GeoObjectCollection(null, {
        preset: 'islands#yellowIcon'
    });

    function CreatePoint(coords,id){
        var newGeoObject = new ymaps.GeoObject({
            geometry: {
                type: "Point",
                coordinates: coords
            },
            properties: {
                iconContent: 'Иконка',
                hintContent: 'Подсказка',
                myId: id
            }
        }, {
            preset: 'islands#blackStretchyIcon',
            draggable: true
        });
        newElem.add(newGeoObject);
        myMap.geoObjects
            .add(newGeoObject);
    }

    function CreatePolygon(arg,id){
        var myPolygon = new ymaps.Polygon([
                arg
            ],
            {
                myId: id
            }, {

            }
        );
        myMap.geoObjects
            .add(myPolygon);
    }

    function CreatePolyline(arg,id){
        var newGeoObject = new ymaps.GeoObject({
            geometry: {
                type: "LineString",
                coordinates: arg
            },
            properties:{
                hintContent: "Меня можно тыкать",
                myId: id
            }
        }, {
            draggable: true,
            strokeColor: "#ff00ff",
            strokeWidth: 5
        });
        newElem.add(newGeoObject);
        myMap.geoObjects
            .add(newGeoObject);
    }

    function addMarker(e) {
        var coords = e.get('coords');

        const url = 'http://localhost:8080/geoObjects/create';
        $.post(
            url,
            {
                coords: String(coords),
                type: 'point',
                dataType: 'json'
            },
            function (data) {
                console.log(data);
                CreatePoint(coords,data);
            });
    }

    myMap.events.add('click', addMarker);



    myMap.geoObjects.events.add('dblclick', function (e){
        var target = e.get('target');
        var myId = target.properties.get('myId');
        myMap.geoObjects.remove(target);

        const url = 'http://localhost:8080/geoObjects/delete/' + myId;
        $.ajax({
            url: url,
            type: 'DELETE'
        });
    });

    myMap.geoObjects.events.add('dragend', function (e){
        var target = e.get('target');
        var myId = target.properties.get('myId');
        var coords = target.geometry.getCoordinates();

        const url = 'http://localhost:8080/geoObjects/update/' + myId;
        $.ajax({
            url: url,
            data: {
                coords: String(coords)
            },
            type: 'POST'
        });


    });

    myMap.geoObjects.events.add('click', function (e){

        var target = e.get('target');
        if (e.get('ctrlKey')){
            addMarker(e);
        }
        else {
            var state = target.editor.state.get('editing');
            if (!state) {
                target.editor.startEditing();
            } else {
                target.editor.stopEditing();
                var coords = target.geometry.getCoordinates();
                var id = target.properties.get('myId');

                const url = 'http://localhost:8080/geoObjects/update/' + id;
                $.ajax({
                    url: url,
                    data: {
                        id: id,
                        coords: String(coords)
                    },
                    type: 'POST'
                });
            }
        }
    });

    myMap.behaviors
        .disable(['dblClickZoom'])

    var paintProcess;

    var styles = [
        {strokeColor: '#ff00ff', strokeOpacity: 0.7, strokeWidth: 3, fillColor: '#ff00ff', fillOpacity: 0.4}
    ];

    var currentIndex = 0;




    // Создадим кнопку для выбора типа рисуемого контура.
    var button = new ymaps.control.Button({data: {content: 'Polygon / Polyline'}, options: {maxWidth: 150}});
    myMap.controls.add(button);

    myMap.events.add('mousedown', function (e) {
        if (e.get('altKey')) {
            paintProcess = ymaps.ext.paintOnMap(myMap, e, {style: styles[currentIndex]});
        }
    });

    myMap.events.add('mouseup', function (e) {
        if (paintProcess) {

            var coords = paintProcess.finishPaintingAt(e);
            paintProcess = null;
            var isSelected = button.isSelected();

            const url = 'http://localhost:8080/geoObjects/create';

            if (!isSelected){
                $.post(
                    url,
                    {
                        coords: String(coords),
                        type: 'polygon',
                        dataType: 'json'
                    },
                    function (data) {
                        console.log(data);
                        CreatePolygon(coords,data);
                    });
            }
            else
            {
                $.post(
                    url,
                    {
                        coords: String(coords),
                        type: 'polyline',
                        dataType: 'json'
                    },
                    function (data) {
                        console.log(data);
                        CreatePolyline(coords,data);
                    });
            }
        }
    });
}