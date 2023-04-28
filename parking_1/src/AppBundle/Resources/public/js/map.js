let infoWindow1;
let pos;

function initMap() {
    let map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 42.15574631218075, lng: 24.742712542086 },
        zoom: 14,
        clickableIcons: true
        //disableDefaultUI: !0
    });

    for (let k in data) {
        let marker = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            position: { lat: data[k].lat, lng: data[k].long },
            map: map,
            title: data[k].name
        });

        const infowindow = new google.maps.InfoWindow({
            content: ("<div id='content'> " + data[k].name + "</div>")
        });

        marker.addListener("moauseover", (e) => {
            infowindow.open({
                anchor: marker,
                map,
            })
        });



        marker.addListener("click", (e) => {
            let title = document.getElementById('myModalLabel').textContent = data[k].name;

            let templ = $('.content');
            templ.html('');
            templ.append("<h>Adress</h>");
            templ.append("<p>  " + data[k].address + "</p>");
            templ.append("<h>Work time</h>");
            templ.append("<p>" + data[k].workTime + "</p>");
            templ.append("<h>All spaces</h>");
            templ.append("<p>" + data[k].allSpaces + "</p>");
            templ.append("<h>Free spaces</h>");
            templ.append("<p> " + data[k].freeSpaces + "</p>");

            $("h").addClass("modal-h");
            $("p").addClass("par");
           
            $('#reserve-btn').attr('href', "/reservation/" + data[k].parkingID);
            $('#myModal').modal('show');

            map.setZoom(16);
            map.setCenter(marker.getPosition());

        });
    }

    const centerControlDiv = document.createElement("div");
    // Create the control.
    const centerControl = createCenterControl(map);
    // Append the control to the DIV.
    centerControlDiv.appendChild(centerControl);
    map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(centerControlDiv);
    infoWindow1 = new google.maps.InfoWindow();
}

window.initMap = initMap;


function createCenterControl(map) {
    const locationButton = document.createElement("button");

    // Set CSS for the control.
    locationButton.type = "button";
    locationButton.style.backgroundColor = "FFF";
    locationButton.style.border = "2px solid #fff";
    locationButton.style.borderRadius = "3px";
    locationButton.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    locationButton.style.color = "rgb(25,25,25)";
    locationButton.style.margin = "8px 0 22px";
    locationButton.style.marginRight = "10px";
    locationButton.style.marginTop = "80px";
    locationButton.style.padding = '22px';
    locationButton.title = "Click to find your location";
    locationButton.style.backgroundImage = "url('https://img.icons8.com/external-smashingstocks-glyph-smashing-stocks/44/external-Current-Location-seo-and-marketing-smashingstocks-glyph-smashing-stocks.png')";

    // Setup the click event listeners: simply set the map to Chicago.
    locationButton.addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    marker = new google.maps.Marker({
                        animation: google.maps.Animation.DROP,
                        position: pos,
                        map: map,
                        icon: 'https://img.icons8.com/external-smashingstocks-flat-smashing-stocks/41/external-car-transport-smashingstocks-flat-smashing-stocks-4.png',
                        title: 'My location'
                    });

                    infoWindow1.setPosition(pos);
                    map.setZoom(16);
                    map.setCenter(pos);
                },
            );

            () => {
                handleLocationError(true, infoWindow1, map.getCenter());
                
            }
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow1, map.getCenter());
        }
    });

    return locationButton;
}


