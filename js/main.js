var connected = false;
var globalCharacteristic = null;

$(document).ready(function () {

    $(".root").on('click', function () {
        if (!connected) {
            navigator.bluetooth.requestDevice({
                filters: [{services: [0xffe5]}]
            })
                .then(function (device) {
                    device.addEventListener('gattserverdisconnected', onDisconnected);
                    return device.gatt.connect();
                })
                .then(function (server) {
                    return server.getPrimaryService(0x0000ffe5);
                })
                .then(function (service) {
                    return service.getCharacteristic(0xffe9);
                })
                .then(function (characteristic) {
                    globalCharacteristic = characteristic;
                    deviseIsConnected();
                });
        }

    });

    $(".color-picker").on('click', function () {
        $("#color-picker").click();
        $('.color-picker-text-wrapper').hide();
    });

    $('#color-picker').on('change', function () {
        updateRGBValues();
        $('.color-picker').css("background", $('#color-picker').val());
        changeColor(parseInt(getRed(), 16), parseInt(getGreen(), 16), parseInt(getBlue(), 16));
    });

    $('#rainbow-mode-btn').on('click', function () {
        rainbowMode();
    });

    $('#brightnessSlider').on('change', function () {
        changeBrightness($('#brightnessSlider').val());
    })


});

function deviseIsConnected() {
    $(".message").hide();
    // setCurrentDeviceColor();
    $(".control-center").show();
    connected = true;
}

function updateRGBValues() {
    $('#red-value').text(getRed());
    $('#green-value').text(getGreen());
    $('#blue-value').text(getBlue());

}

function getRed() {
    return $('#color-picker').val().slice(1, 3);
}

function getGreen() {
    return $('#color-picker').val().slice(3, 5);
}

function getBlue() {
    return $('#color-picker').val().slice(5, 7);
}


function changeColor(red, green, blue) {
    var data = new Uint8Array([
        0x56, red, green, blue, 0x00, 0xf0, 0xaa
    ]);
    globalCharacteristic.writeValue(data);
}

function rainbowMode() {
    var data = new Uint8Array([0xbb, 0x25, 0x05, 0x44]);
    return globalCharacteristic.writeValue(data);
}

function changeBrightness(brightness) {
    var data = new Uint8Array([
        0x56, parseInt(getRed(), 16), parseInt(getGreen(), 16), parseInt(getBlue(), 16), brightness, 0xf0, 0xaa
    ]);
    return globalCharacteristic.writeValue(data);
}

function onDisconnected() {
    $(".message").show();
    $(".control-center").hide();
    connected = false;
}