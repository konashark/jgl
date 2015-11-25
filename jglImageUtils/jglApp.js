window.addEventListener("load", jglApp, false);

var jgl = null;

function jglApp () {
    var jgl = new Jgl;
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    context.fillStyle = "#eeeeff";
    context.fillRect(0,0,1000,800);

    var img;
    jgl.newImage('jgl.png', function(img) {
        console.log("Loaded image...");
        jgl.drawImage(context, img, 20, 100);
        jgl.drawImage(context, img, 20, 200, { scaleX: 2 });
        jgl.drawImage(context, img, 20, 300, { scaleY: 2 });
        jgl.drawImage(context, img, 20, 430, { scaleY: .5, scaleX: 1.5 });
        jgl.drawImage(context, img, 20, 500, { scale: .5});
        jgl.drawImage(context, img, 20, 600, { scale: 2.5, opacity:.5 });

        jgl.drawImage(context, img, 350, 100, { center: true });
        jgl.drawImage(context, img, 350, 200, { center: true, scaleX: 2 });
        jgl.drawImage(context, img, 350, 300, { center: true, scaleY: 2 });
        jgl.drawImage(context, img, 350, 430, { center: true, scaleY: .5, scaleX: 1.5 });
        jgl.drawImage(context, img, 350, 500, { center: true, scale: .5});
        jgl.drawImage(context, img, 350, 600, { center: true, scale: 2.5, opacity:.5});

        var r = 0;

        animate = function() {
            context.fillRect(500,0,300,800);
            jgl.drawImage(context, img, 600, 120, { rotation: r });
            jgl.drawImage(context, img, 600, 300, { center: true, rotation: r });
            jgl.drawImage(context, img, 600, 450, { rotation: r, scale:.5});
            jgl.drawImage(context, img, 600, 600, { center: true, rotation: r, scale: 1.5, opacity:.5 });
            if (++r >= 360) { r = 0; }
            window.requestAnimFrame(animate);
        };

        window.requestAnimFrame(animate);

    });

}

