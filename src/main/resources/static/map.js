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

    var style = [
        {strokeColor: '#ff00ff', strokeOpacity: 0.7, strokeWidth: 3, fillColor: '#ff00ff', fillOpacity: 0.4}
    ];


    function Initialize(){
        var array = [];
        array.splice();

        const response = $.get(
            'http://localhost:8080/geoObjects/all'
        );
        response.done(function (result) {
            array.push(...result);
            DrawAll(array);
        });
    }
        function DrawAll(array){

        for (let i = 0; i < array.length; i++) {
            switch(array[i].type){
                case 'point':
                    AddPoint(ParsePoints(array[i].coords),array[i].id);
                    break;
                case 'polygon':
                    AddPolygon(ParseGeoObjects(array[i].coords),array[i].id);
                    break;
                case 'polyline':
                    AddPolyline(ParseGeoObjects(array[i].coords),array[i].id);
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

    function AddPoint(coords,id){
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

    function AddPolygon(arg,id){
        var myPolygon = new ymaps.Polygon([
                arg
            ],
            {
                myId: id,
                interactivityModel: 'default#transparent',
                fillColor: '#6699ff'
            }, {
                style
            }
        );
        myMap.geoObjects
            .add(myPolygon);
    }

    function AddPolyline(arg,id){
        var newGeoObject = new ymaps.GeoObject({
            geometry: {
                type: "LineString",
                coordinates: arg
            },
            properties:{
                hintContent: "Меня можно тыкать",
                myId: id
            }
        });
        newElem.add(newGeoObject);
        myMap.geoObjects
            .add(newGeoObject);
    }

    myMap.events.add('click', function (e) {
        var coords = e.get('coords');

        const url = 'http://localhost:8080/geoObjects/create';
        $.post(
            url,
            {
                coords: String(coords),
                type: 'point'
            },
            function (data) {
                console.log(data);
                AddPoint(coords,data);
            });
    });



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
            var coords = e.get('coords');

            const url = 'http://localhost:8080/geoObjects/create';
            $.post(
                url,
                {
                    coords: String(coords),
                    type: 'point'
                },
                function (data) {
                    console.log(data);
                    AddPoint(coords,data);
                });
        }
        else {
            var state = target.editor.state.get('editing');
            if (!state) {
                target.editor.startEditing();
            } else {
                target.editor.stopEditing();
                var coords = target.geometry.getCoordinates();
                var myId = target.properties.get('myId');

                const url = 'http://localhost:8080/geoObjects/update/' + myId;
                $.ajax({
                    url: url,
                    data: {
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

    var button = new ymaps.control.Button({data: {content: 'Polygon / Polyline'}, options: {maxWidth: 150}});
    myMap.controls.add(button);

    myMap.events.add('mousedown', function (e) {
        if (e.get('altKey')) {
            paintProcess = ymaps.ext.paintOnMap(myMap, e, {style: style});
        }
    });

    myMap.events.add('mouseup', function (e) {
        if (paintProcess) {

            var coordinates = paintProcess.finishPaintingAt(e);
            paintProcess = null;
            var isSelected = button.isSelected();

            const url = 'http://localhost:8080/geoObjects/create';

            if (!isSelected){
                $.post(
                    url,
                    {
                        coords: String(coordinates),
                        type: 'polygon'
                    });
            }
            else
            {
                $.post(
                    url,
                    {
                        coords: String(coordinates),
                        type: 'polyline'
                    });
            }
            var geoObject = button.isSelected() ?
                new ymaps.Polyline(coordinates, {}, style) :
                new ymaps.Polygon([coordinates], {interactivityModel: 'default#transparent', fillColor: '#6699ff'}, style);
            myMap.geoObjects.add(geoObject);
        }
    });
}