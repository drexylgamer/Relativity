const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d")
const canvas2 = document.getElementById("canvas2");
const ctx2 = canvas2.getContext("2d")
const canvas3 = document.getElementById("canvas3");
const ctx3 = canvas3.getContext("2d")

const T_VALUE_HOLDER = document.getElementById("t-value")
const T_DECIMAL_VALUE = document.getElementById("t-mul")

canvas.width = 500
canvas.height = 500
canvas2.width = 500
canvas2.height = 500
canvas3.width = 500
canvas3.height = 500

const object = new Object(new Vector3(250, 250, 250), 150, 150, 150, "green", new Vector3(-45, -45, -45));

function replaceValues() {
    T_VALUE_HOLDER.innerText = Util.make6Long(T_DECIMAL_VALUE.value)
}

function loop() {
    replaceValues();
    object.position.t = parseInt(T_DECIMAL_VALUE.value)
    ctx.clearRect(0, 0, 500, 500)
    ctx2.clearRect(0, 0, 500, 500)
    ctx3.clearRect(0, 0, 500, 500)
    object.render(ctx, ctx2, ctx3)

    requestAnimationFrame(loop);
}

loop()