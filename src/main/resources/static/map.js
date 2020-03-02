var myMap;

// Дождёмся загрузки API и готовности DOM.
ymaps.ready(init);
ymaps.ready(['ext.paintOnMap']);

function init () {
    // Создание экземпляра карты и его привязка к контейнеру с
    // заданным id ("map").
    myMap = new ymaps.Map('map', {
        // При инициализации карты обязательно нужно указать
        // её центр и коэффициент масштабирования.
        center:[55.76, 37.64], // Москва
        zoom:10,
        controls: []
    });
    var array = [];
    var div = document.getElementById('map');
    var returnButton = '<button id="return">Восстановить</button>';
    div.insertAdjacentHTML('beforeend', returnButton);
    var currentButton = document.getElementById('return');
    currentButton.addEventListener('click',function (event) {
        array.splice();
        const response = $.get(
            'http://localhost:8080/points/',
        );
        response.done(function (result) {
            array.push(...result);
        });

        for (let i = 0; i < array.length; i++){
            var length = array[i].coords.length;
            var middle = array[i].coords.indexOf(',');
            var x = array[i].coords;
            var y = array[i].coords;
            x = Number(x.substring(0,middle));
            y = Number(y.substring(middle+1));
            var newGeoObject = new ymaps.GeoObject({
                geometry: {
                    type: "Point",
                    coordinates: [x,y]
                },
                // Свойства.
                properties: {
                    // Контент метки.
                    iconContent: 'Я',
                    hintContent: 'же'
                }
            }, {
                // Опции.
                // Иконка метки будет растягиваться под размер ее содержимого.
                preset: 'islands#blackStretchyIcon',
                // Метку можно перемещать.
                draggable: true
            });
            newElem.add(newGeoObject);
            myMap.geoObjects
                .add(newGeoObject);
        }



    });

    var newElem = new ymaps.GeoObjectCollection(null, {
        preset: 'islands#yellowIcon'
    });

    function CreatePoint(coords,id){
        var newGeoObject = new ymaps.GeoObject({
            // Описание геометрии.
            geometry: {
                type: "Point",
                coordinates: coords
            },
            // Свойства.
            properties: {
                // Контент метки.
                iconContent: 'Я',
                hintContent: 'же',
                myId: id
            }
        }, {
            // Опции.
            // Иконка метки будет растягиваться под размер ее содержимого.
            preset: 'islands#blackStretchyIcon',
            // Метку можно перемещать.
            draggable: true
        });
        newElem.add(newGeoObject);
        myMap.geoObjects
            .add(newGeoObject);
    }



    myMap.events.add('click', function (e) {
        var coords = e.get('coords');

        const url = 'http://localhost:8080/points/create';

        $.post(
            url,
            {
                coords: String(coords),
            },
            function (data) {
                console.log(data);
                CreatePoint(coords,data);
            });
    });



    myMap.geoObjects.events.add('dblclick', function (e){
        var target = e.get('target');
        var id = target.properties.get('myId');
        myMap.geoObjects.remove(target);

        const url = 'http://localhost:8080/points/delete/' + id;

        $.delete(
            url,
            );
    });

    myMap.geoObjects.events.add('click', function (e){

        var target = e.get('target');
        if (e.get('ctrlKey')){
            var coords = e.get('coords');
            var newGeoObject = new ymaps.GeoObject({
                // Описание геометрии.
                geometry: {
                    type: "Point",
                    coordinates: coords
                },
                // Свойства.
                properties: {
                    // Контент метки.
                    iconContent: 'Я',
                    hintContent: 'же'
                }
            }, {
                // Опции.
                // Иконка метки будет растягиваться под размер ее содержимого.
                preset: 'islands#blackStretchyIcon',
                // Метку можно перемещать.
                draggable: true
            });
            newElem.add(newGeoObject);
            myMap.geoObjects
                .add(newGeoObject);
        }
        else {
            var state = target.editor.state.get('editing');
            if (!state) {
                target.editor.startEditing();
            } else {
                target.editor.stopEditing();
            }
        }
    });

    myMap.behaviors
        .disable(['dblClickZoom'])

    var paintProcess;

    // Опции многоугольника или линии.
    var styles = [
        {strokeColor: '#ff00ff', strokeOpacity: 0.7, strokeWidth: 3, fillColor: '#ff00ff', fillOpacity: 0.4}
    ];

    var currentIndex = 0;




    // Создадим кнопку для выбора типа рисуемого контура.
    var button = new ymaps.control.Button({data: {content: 'Polygon / Polyline'}, options: {maxWidth: 150}});
    myMap.controls.add(button);

    // Подпишемся на событие нажатия кнопки мыши.
    myMap.events.add('mousedown', function (e) {
        // Если кнопка мыши была нажата с зажатой клавишей "alt", то начинаем рисование контура.
        if (e.get('altKey')) {
            paintProcess = ymaps.ext.paintOnMap(myMap, e, {style: styles[currentIndex]});
        }
    });

    // Подпишемся на событие отпускания кнопки мыши.
    myMap.events.add('mouseup', function (e) {
        if (paintProcess) {

            // Получаем координаты отрисованного контура.
            var coordinates = paintProcess.finishPaintingAt(e);
            paintProcess = null;
            // В зависимости от состояния кнопки добавляем на карту многоугольник или линию с полученными координатами.
            var geoObject = button.isSelected() ?
                new ymaps.Polyline(coordinates, {}, styles[currentIndex]) :
                new ymaps.Polygon([coordinates], {interactivityModel: 'default#transparent', fillColor: '#6699ff'}, styles[currentIndex]);

            myMap.geoObjects.add(geoObject);

        }
    });
}