$(() => {

     start();

     function start() {
         const preloader = $('#preloader');
         $(document).ajaxStart(() => preloader.show());
         $(document).ajaxStop(() => preloader.hide());

         let button = $('#show-button');
         button.on('click', e => {
             let countryContainer = $('#country-container');
             countryContainer.html('');
             let countryName = $('#country-name').val();
             getCountryInfo(countryName, countryContainer);
         });
     }

     function getCountryInfo(countryName, countryContainer) {
         $.get({
             url: 'https://restcountries.eu/rest/v2/name/' + countryName + '?fullText=true',
             success: response => {
                 let country = response[0];
                 createBlockForObjectValue(translatedKeys, countryContainer);
                 const idArray = getIdArrayFromCreatedELements(countryContainer);
                 printCountryInfo(country, idArray);
             },
             error: error => {
                 // В свойствах нашел responseJSON.message - не уверен что это то что нужно!
                 alert('Ошибка! ' + error.status + ': ' + error.responseJSON.message);
             },
             complete: () => {
                 $('.interactive-maps').show();
                 let mymap = L.map('map-id').setView([51.505, -0.09], 13);

                 L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' +
                     'pk.eyJ1IjoibWlyYXN0ZWtlc2JhZXY5NCIsImEiOiJja2VlMmt4OTAwaHdnMnZtbDdkdW8ycDJyIn0.umItUeYcxiWOdO7_AvEtLg', {
                     maxZoom: 18,
                     id: 'mapbox/streets-v11',
                     tileSize: 512,
                     zoomOffset: -1,
                     accessToken: 'your.mapbox.access.token'
                 }).addTo(mymap);
             }
         });
     }

     function printCountryInfo(country, idArray) {
         for (let key in country) {
             if (!country.hasOwnProperty(key)) {
                 continue;
             }

             for (let i = 0; i < idArray.length; i++) {
                 if (idArray[i] === key && idArray[i] !== 'flag') {
                     let span = $('<span>').attr('class', 'value');
                     if ((country[key] instanceof Object) && (Array.isArray(country[key]) === false)) {
                         let object = country[key];
                         let str = '';
                         for (let key in object) {
                             if (!object.hasOwnProperty(key)){
                                 continue;
                             }
                             str += key + ': ' + object[key] + ', ';
                         }
                         span.text(str);
                         $('#' + idArray[i]).append(span);
                     } else if (Array.isArray(country[key])) {
                         let str = country[key].join(', ');
                         span.text(str);
                         $('#' + idArray[i]).append(span);
                     } else if (Array.isArray(country[key])) {
                         let str = '';
                         let array = country[key];
                         for (let i = 0; i < array.length; i++) {
                             if (array[i] instanceof Object && Array.isArray(array[i]) === false) {
                                 for (let key in array[i]) {
                                     if (!array[i].hasOwnProperty(key)){
                                         continue;
                                     }
                                     str += key + ': ' + array[i][key] + ', ';
                                 }
                             }
                         }
                         span.text(str);
                         $('#' + idArray[i]).append(span);
                     } else {
                         span.text(country[key]);
                         $('#' + idArray[i]).append(span);
                     }

                 }
                 if (idArray[i] === 'flag' && key === 'flag') {
                     let span = $('<span>').attr('class', 'value');
                     let img = $('<img>').attr('src', country[key]).attr('class', 'image');
                     span.append(img);
                     $('#' + idArray[i]).append(span);
                 }
             }
         }
     }


     function createBlockForObjectValue(object, countryContainer) {
        for (let key in object) {
            if (!object.hasOwnProperty(key)){
                continue;
            }

            let div = $('<div>').attr('id', key);
            div.append(object[key]);
            countryContainer.append(div);
        }
     }

     function getIdArrayFromCreatedELements(countryContainer) {
        let idArray = [];
        let elems = countryContainer.children();
        for (let i = 0; i < elems.length; i++) {
            idArray.push($(elems[i]).attr('id'));
        }
        return idArray;
     }

     let translatedKeys = {
         name: 'Название: ',
         topLevelDomain: 'Домен верхнего уровня: ',
         alpha2Code: 'Двузначный код: ',
         alpha3Code: 'Трехзначный код: ',
         callingCodes: 'Код страны телефонного номера: ',
         capital: 'Столица: ',
         altSpellings: 'Альтернативные варианты написания: ',
         region: 'Регион: ',
         subregion: 'Внутренний регион: ',
         population: 'Численность населения: ',
         latlng: 'Географические координаты: ',
         demonym: 'Жители: ',
         area: 'Площадь: ',
         gini: 'Gini: ', // Я не понял что это такое!
         timezones: 'Часовой пояс: ',
         borders: 'Граница: ',
         nativeName: 'Официальное наименование: ',
         numericCode: 'Уникальный цифровой код: ',
         currencies: 'Валюты: ',
         languages: 'Языки: ',
         translations: 'Перевод: ',
         flag: 'Флаг: ',
         regionBlocks: 'Региональный блок: ',
         cioc: 'Cioc: ', // это тоже, в документации не указано. Или я не смог найти
     };
});