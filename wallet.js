function runWallet(opponent, section, row, seat, gate, date, time){
    let canvas = document.getElementById("buckeyes");
    let context = canvas.getContext("2d");
    let imageObj = new Image();
    imageObj.onload = function(){
        context.drawImage(imageObj, 0, 0);
        context.font = "47pt -apple-system, BlinkMacSystemFont, Helvetica, sans-serif";
        context.fillStyle = 'white';

        //using global vars from form
        context.fillText(date, 700, 130);
        context.fillText(opponent, 345, 595);
        context.fillText(section, 45, 735);
        context.fillText(row, 530, 735);
        context.fillText(seat, 950, 735);
        context.fillText(gate, 45, 880);

        context.font = "30pt -apple-system, BlinkMacSystemFont, Helvetica, sans-serif";
        context.fillText(time, 860, 65);

        let imgSrc = canvas.toDataURL("image/png");
        $('#buck_img').attr('src', imgSrc);
        canvas.style.display = "none";
    };
    imageObj.src = "images/buckeyes.png";
}

let state = 0;
$('.container').on('click', '.button', function() {
    let buttons = $('.button');
    let clickedButton = $(this);
    let topCardHolder = $('.card-large');
    let topCard = topCardHolder.children('.button');
    let nfc = $('.nfc');
    let wrap = $('.button-wrap');
    let extras = $('.ticket-extras');
    if(state===0){
        buttons.addClass('expanded');
        wrap.css('top', '40px');
        wrap.css('bottom', '');
        topCard.appendTo($('.button-wrap'));
        topCardHolder.remove();
        $('.container').prepend('<div class="card-large"></div>');
        extras.css('display', 'none');
        nfc.css('display', 'none');
        nfc.css('top', '40%');
        state = 1;
    }
    else if(state===1){
        if(clickedButton.hasClass('buckeyes')){
            nfc.css('top', '55%');
            extras.css('display', 'block');
        }
        wrap.css('top', '');
        wrap.css('bottom', '-80px');
        clickedButton.appendTo(topCardHolder);
        buttons.removeClass('expanded');
        nfc.css('display', 'block');
        state = 0;
    }
});

$('#form').on('submit', function(e){
    $('#form').css('display', 'none');
    $('.hide').css('display', 'block');

    let dt = moment($('#date').val());
    let date = dt.format('MMM D, YYYY');
    let time = dt.format('h:mm A');

    runWallet($('#opponent').val(), $('#section').val(), $('#row').val(), $('#seat').val(), $('#gate').val(), date, time);
    return false;
});