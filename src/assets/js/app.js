$( document ).ready(function() {
    
    // Set global datetime variable
    var datetime;
    // Set global daylight savings variable
    var dst;
    // Set global day of week variable
    var day;
    var dateformatted;
    
    // Set url as variable for easy changing
    var jsonurl = 'http://worldclockapi.com/api/json/utc/now';
    
    $('#js-clockswitch').on('click', function() {
        $(this).toggleClass('switched');
        if ($('.clock__analogue').hasClass('active')) {
            $('.clock__analogue').removeClass('active');
            $('.clock__analogue').addClass('inactive');
            $('.clock__digital').removeClass('inactive');
            $('.clock__digital').addClass('active');
        }
        else {
            $('.clock__analogue').removeClass('inactive');
            $('.clock__analogue').addClass('active');
            $('.clock__digital').removeClass('active');
            $('.clock__digital').addClass('inactive');
        }
    })
    // Function to get data from worldclockapi server
    function getjsontime() {
        $.getJSON(jsonurl, function (data) {
            console.log(data);
            // Save true/false value of daylight savings boolean as string
            dst = data['isDayLightSavingsTime'].toString();
            
            day = data['dayOfTheWeek'].toString();
            
            /** Save formatted date for use in latesttime function
            ** strips unwanted characters out using replace
            **/
            datetime = data['currentDateTime'].toString().replace('T',' ').replace('Z','');
            
            dateformatted = data['currentDateTime'].toString().substring(0, 10);
            
            digitalclock();
            todayinfo();
        });
    };
    
    // Get current time on load
    getjsontime();
    // Sync time every 60 seconds and update
    setInterval(getjsontime, 60*1000);
    
    // Draw clock on load
    canvasclock();
    
    // Function to get latest time and return in hours and minutes format
    function latesttime() {
        utcdate = new Date(datetime);
        utchours = utcdate.getHours();
        utcminutes = utcdate.getMinutes();
        
        if (utchours < 10) {
            utchours = "0" + utchours
        }
    
        if (utcminutes < 10 ) {
            utcminutes = "0" + utcminutes
        }
        
        // Return objects
        return {
            hours: utchours, 
            mins: utcminutes,
        };
    }
    
    // Topbar todays info
    function todayinfo() {
        $('#js-day').html('Day: <span class="current">' + day + " (" + dateformatted + ")</span>");
        
        $('#js-dst').html('Daylight savings: <span class="current">' + dst + "</span>");
        
        var oneday = 24*60*60*1000; // hours*minutes*seconds*milliseconds
        var yearstart = new Date(2016,01,01);
        var datenow = new Date();
        
        var diffDays = Math.round(Math.abs((yearstart.getTime() - datenow.getTime())/(oneday)));
        
        $('#js-yeardays').html('Days since year start: <span class="current">' + diffDays + "</span>");
    }
    
    function digitalclock() {
        var timenow = latesttime();
        $('#js-digital').html(timenow.hours + '<span class="blink">:</span>' + timenow.mins);
    }
    
    /** ALL HTML5 CANVAS CLOCK FUNCTIONALITY
    * http://www.w3schools.com/canvas/canvas_clock_start.asp
    */
    function canvasclock() {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        var radius = canvas.height / 2;
        ctx.translate(radius, radius);
        radius = radius * 0.90
        setInterval(drawClock, 1000);

        function drawClock() {
          drawFace(ctx, radius);
          drawNumbers(ctx, radius);
          drawTime(ctx, radius);
        }

        function drawFace(ctx, radius) {
          var grad;
          ctx.beginPath();
          ctx.arc(0, 0, radius, 0, 2*Math.PI);
          ctx.fillStyle = 'pink';
          ctx.fill();
          grad = ctx.createRadialGradient(0,0,radius*0.95, 0,0,radius*1.05);
          grad.addColorStop(0, '#333');
          grad.addColorStop(0.5, 'white');
          grad.addColorStop(1, '#333');
          ctx.strokeStyle = grad;
          ctx.lineWidth = radius*0.1;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, radius*0.1, 0, 2*Math.PI);
          ctx.fillStyle = '#333';
          ctx.fill();
        }

        function drawNumbers(ctx, radius) {
          var ang;
          var num;
          ctx.font = radius*0.15 + "px arial";
          ctx.textBaseline="middle";
          ctx.textAlign="center";
          for(num = 1; num < 13; num++){
            ang = num * Math.PI / 6;
            ctx.rotate(ang);
            ctx.translate(0, -radius*0.85);
            ctx.rotate(-ang);
            ctx.fillText(num.toString(), 0, 0);
            ctx.rotate(ang);
            ctx.translate(0, radius*0.85);
            ctx.rotate(-ang);
          }
        }

        function drawTime(ctx, radius){
            
            var timenow = latesttime();

            var hour = timenow.hours;
            var minute = timenow.mins;
            var second = 00;
        
            hour=hour%12;
            hour=(hour*Math.PI/6)+
            (minute*Math.PI/(6*60))+
            (second*Math.PI/(360*60));
            drawHand(ctx, hour, radius*0.5, radius*0.07);
            //minute
            minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
            drawHand(ctx, minute, radius*0.8, radius*0.07);
            // second
            second=(second*Math.PI/30);
            drawHand(ctx, second, radius*0.9, radius*0.02);

        }

        function drawHand(ctx, pos, length, width) {
            ctx.beginPath();
            ctx.lineWidth = width;
            ctx.lineCap = "round";
            ctx.moveTo(0,0);
            ctx.rotate(pos);
            ctx.lineTo(0, -length);
            ctx.stroke();
            ctx.rotate(-pos);
        }
    }
});